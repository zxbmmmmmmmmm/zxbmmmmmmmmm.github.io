---
date: 2025-07-14
title: 用代码写代码：使用Roslyn API构建语法树并应用于源生成器
category:
  - C#
tag:
  - Roslyn
  - 源生成器
---

# 用代码写代码：使用Roslyn API构建语法树并应用于源生成器

在上文构建源生成器的过程中，我们使用字符串直接插入代码。这样做固然方便快捷，但字符串需要手动格式化，且无法检测拼写错误，这对需要生成复杂结构的源生成器项目很不友好。

本文将介绍生成代码的另一种方式：使用Roslyn API构建语法树。



## 什么是语法树 (Syntax Tree)？

语法树是编译器用于理解C#程序的数据结构。Roslyn在解析C#代码后就会生成一棵语法树，以供后续的进一步分析和编译。

一棵语法树由`Node(节点)`、`Token(标记)`、`Trivia(额外信息)`构成。

- `SyntaxNode`：声明、语句、子句和表达式等语法构造

  如一个类的声明会被解析成一个`ClassDeclaration`

- `SyntaxToken`：独立的关键字、标识符、运算符或标点

  如一个左括号`(`会被解析为`OpenParenToken`

- `SyntaxTrivia`：不重要的信息，例如标记、预处理指令和注释之间的空格

  如一行注释会被解析为`SingleLineCommentTrivia`

例如，有如下代码：

```csharp
using System;
namespace App
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
        }
    }
}

```

Roslyn会将这段代码解析为如下结构(此处仅保留`SyntaxNode`)：

```csharp
CompilationUnitSyntax
 ├── UsingDirectiveSyntax (using System;)
 └── NamespaceDeclarationSyntax (namespace ConsoleApp1)
      └── ClassDeclarationSyntax (internal class Program)
           └── MethodDeclarationSyntax (static void Main(string[] args))
                └── BlockSyntax
                     └── ExpressionStatementSyntax (Console.WriteLine("Hello, World!");)
                          └── InvocationExpressionSyntax
                               ├── SimpleMemberAccessExpressionSyntax (Console.WriteLine)
                               │    ├── IdentifierNameSyntax (Console)
                               │    └── IdentifierNameSyntax (WriteLine)
                               └── ArgumentListSyntax
                                    └── ArgumentSyntax
                                         └── LiteralExpressionSyntax ("Hello, World!")
```

> 我们还可以安装语法树可视化工具(`VS Installer>找到对应版本>修改>单个组件>DGML 编辑器`)
>
> 安装完成后，搜索"Syntax Visualizer "即可
>
> 具体可查看[使用 Visual Studio 中的 Roslyn 语法可视化工具浏览代码](https://learn.microsoft.com/zh-cn/dotnet/csharp/roslyn-sdk/syntax-visualizer)

既然Roslyn需要将代码解析成语法树，那么我们是否可以自行构建一个语法树并"反向"输出C#代码呢？

答案是：可以！



## 构建语法树

在开始之前，我们需要引入`Microsoft.CodeAnalysis.CSharp`包

若我们需要编写的代码如下：

```csharp
using System;
namespace ConsoleApp1;

public class HelloWorld
{
    public static void SayHello()
    {
        Console.WriteLine("Hello, World!");
    }
}
```

创建一个`CompilationUnit`并添加using语句：

```csharp
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using static Microsoft.CodeAnalysis.CSharp.SyntaxFactory;

var complicationUnit = CompilationUnit()
    .AddUsings(
        UsingDirective(
            IdentifierName("System")));
```

添加命名空间：

```csharp
AddMembers(
    FileScopedNamespaceDeclaration(
        IdentifierName("ConsoleApp1")));
```

添加HelloWorld类：

```csharp
AddMembers(
    ClassDeclaration("HelloWorld")
    .AddModifiers(
        Token(SyntaxKind.PublicKeyword))
    .AddMembers(/*这里编写SayHello方法*/));
```

编写SayHello方法：

```csharp
MethodDeclaration(
        PredefinedType(
            Token(SyntaxKind.VoidKeyword)),
        Identifier("SayHello"))
    .WithModifiers(
        TokenList(
            Token(SyntaxKind.PublicKeyword),
            Token(SyntaxKind.StaticKeyword)))
    .WithBody(
        Block(
            ExpressionStatement(
                InvocationExpression(
                        MemberAccessExpression(
                            SyntaxKind.SimpleAssignmentExpression,
                            IdentifierName("Console"),
                            IdentifierName("WriteLine")))
                    .WithArgumentList(
                        ArgumentList(
                            SingletonSeparatedList<ArgumentSyntax>(
                                Argument(
                                    LiteralExpression(
                                        SyntaxKind.StringLiteralExpression,
                                        Literal("Hello World")))))))))
```

构建语法树：

```csharp
var syntaxTree = SyntaxTree(complicationUnit);
```

全部代码：

```csharp
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using static Microsoft.CodeAnalysis.CSharp.SyntaxFactory;

var complicationUnit = CompilationUnit()
    .AddUsings(
        UsingDirective(
            IdentifierName("System")))
    .AddMembers(
        FileScopedNamespaceDeclaration(
            IdentifierName("ConsoleApp1")))
    .AddMembers(
        ClassDeclaration("HelloWorld")
            .AddModifiers(
                Token(SyntaxKind.PublicKeyword))
            .AddMembers(
                MethodDeclaration(
                        PredefinedType(
                            Token(SyntaxKind.VoidKeyword)),
                        Identifier("SayHello"))
                    .WithModifiers(
                        TokenList(
                            Token(SyntaxKind.PublicKeyword),
                            Token(SyntaxKind.StaticKeyword)))
                    .WithBody(
                        Block(
                            ExpressionStatement(
                                InvocationExpression(
                                        MemberAccessExpression(
                                            SyntaxKind.SimpleMemberAccessExpression,
                                            IdentifierName("Console"),
                                            IdentifierName("WriteLine")))
                                    .WithArgumentList(
                                        ArgumentList(
                                            SingletonSeparatedList(
                                                Argument(
                                                    LiteralExpression(
                                                        SyntaxKind.StringLiteralExpression,
                                                        Literal("Hello World")))))))))));
var syntaxTree = SyntaxTree(complicationUnit);
```

> 使用[Roslyn Quoter](https://roslynquoter.azurewebsites.net/)工具可以将代码直接转化为上文的形式（会比上文写的更长），可作为一些参考



## 将语法树转换为C#代码

对`syntaxTree`调用`GetText()`后调用`ToString()`即可得字符串

```csharp
var code = syntaxTree.GetText().ToString();
//使用异步重载
//var code = (await syntaxTree.GetTextAsync()).ToString();
```

> 或创建一个`StreamWriter`，将`complicationUnit`写入即可
>
> ```csharp
> await using var streamWriter = new StreamWriter("output.txt");
> complicationUnit.WriteTo(streamWriter);
> ```


打开输出，我们发现这些代码并没有被格式化——我们需要添加必要的`Trivia`

```csharp
usingSystem;namespaceConsoleApp1;publicclassHelloWorld{publicstaticvoidSayHello(){Console.WriteLine("Hello World");}}
```

我们可以在需要空格或换行的代码后调用`WithLeadingTrivia()`方法手动添加，但这样会显得代码异常冗长且可读性不佳

更好的方法是给`complicationUnit`调用`NormalizeWhitespace()`方法自动添加所需的`Trivia`

```csharp
complicationUnit = complicationUnit.NormalizeWhitespace();
var syntaxTree = SyntaxTree(complicationUnit);
var code = (await syntaxTree.GetTextAsync()).ToString();
```



## 在源生成器中的应用

在构建`SyntaxTree`时，手动指定编码形式为`UTF8`，即可将语法树转换后的代码供源生成器使用

```csharp
context.RegisterPostInitializationOutput(ctx => 
    ctx.AddSource("HelloWorldSyntaxTree.g.cs",SyntaxTree(complicationUnit, encoding:Encoding.UTF8).GetText()));
```



## 源代码

在源生成器中的应用

https://github.com/zxbmmmmmmmmm/SourceGeneratorDemo/blob/master/SourceGeneratorDemo.Generator/SyntaxTreeGenerator.cs



## 引用

[使用代码编写代码 ——Roslyn API 入门](https://www.bilibili.com/video/BV1mfUpYrE6s/?spm_id_from=333.1391.0.0)

[使用 Visual Studio 中的 Roslyn 语法可视化工具浏览代码](https://learn.microsoft.com/zh-cn/dotnet/csharp/roslyn-sdk/syntax-visualizer)

[Roslyn Quoter](https://roslynquoter.azurewebsites.net/)