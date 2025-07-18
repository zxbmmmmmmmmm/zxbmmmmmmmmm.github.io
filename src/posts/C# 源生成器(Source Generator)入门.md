---
date: 2025-07-11
title: C# 源生成器(Source Generator)入门
category:
  - C#
tag:
  - Roslyn
  - 源生成器
---

# C# 源生成器(Source Generator)入门

C#9 引入了一个强大的机制：源生成器(Source Generator)。通过创建源生成器，我们可以简化大量重复编写的代码，或是减少反射来获得更强的性能以及AOT支持

本文将介绍如何从零开始创建一个最简单的源生成器



## 创建生成器项目

创建一个SourceGeneratorDemo.Generator项目，目标框架需要设置为.NET Standard 2.0

> 这大概由于Visual Studio尚未迁移到.NET Core，Framework最高支持.NET Standard 2.0的项目

添加`Microsoft.CodeAnalysis.Analyzers`、`Microsoft.CodeAnalysis.CSharp`的nuget引用。

添加`EnForceExtendedAnalyzerRules`属性，强制禁用一些分析器不适用的API，否则IDE会有警告

（此属性的具体作用可以看lindexi大佬的[这篇文章](https://blog.lindexi.com/post/Roslyn-分析器-EnforceExtendedAnalyzerRules-属性的作用.html)）

```xml
<PropertyGroup>
	...
    <EnForceExtendedAnalyzerRules>true</EnForceExtendedAnalyzerRules>
</PropertyGroup>
```

最终csproj文件如下：

```xml
<Project Sdk="Microsoft.NET.Sdk">

    <PropertyGroup>
        <TargetFramework>netstandard2.0</TargetFramework>
        <LangVersion>preview</LangVersion>
        <Nullable>enable</Nullable>
        <EnForceExtendedAnalyzerRules>true</EnForceExtendedAnalyzerRules>
    </PropertyGroup>

    <ItemGroup>
      <PackageReference Include="Microsoft.CodeAnalysis.Analyzers" Version="4.14.0">
        <PrivateAssets>all</PrivateAssets>
        <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
      </PackageReference>
      <PackageReference Include="Microsoft.CodeAnalysis.CSharp" Version="4.14.0" />
    </ItemGroup>

</Project>
```



## 编写源生成器

创建`SampleGenerator.cs`，添加`[Generator]`特性并实现`IIncrementalGenerator`接口

>旧的源生成器`ISourceGenerator`在每次代码有更改时都会扫描整个语法树，开销很大。而新的增量生成器`IIncrementalGenerator`通过管道等方式遴选需要扫描的代码，大大减少生成开销。
>
>因此这里我们选择`IIncrementalGenerator`进行实现

```csharp
[Generator]
public class SampleGenerator : IIncrementalGenerator
{
	public void Initialize(IncrementalGeneratorInitializationContext context)
    {
        //在这里编写生成器逻辑
    }
}
```

我们希望生成的代码如下，这里就放在一个常量中：

```csharp
private const string HelloWorld =
    """
    //加上此行以防止编译器进行不必要的代码分析，避免出现警告
    //<auto-generated>
    using System;
    namespace SourceGeneratorDemo.Generator;

    public class HelloWorld
    {
        public static void SayHello()
        {
            Console.WriteLine("Hello, World!");
        }
    }
    """;
```

现在来编写`Initialize`方法，这是源生成器的核心部分：

```csharp
public void Initialize(IncrementalGeneratorInitializationContext context)
{
    //在编译时生成源代码
    //HelloWorld.g.cs就是生成代码的文件名称
    context.RegisterPostInitializationOutput(ctx => ctx.AddSource("HelloWorld.g.cs",SourceText.From(HelloWorld, Encoding.UTF8)));
}
```

所有代码如下：

```csharp
using System.Text;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Text;

namespace SourceGeneratorDemo.Generator;

[Generator]
public class SampleGenerator : IIncrementalGenerator
{
    private const string HelloWorld =
        """
        //加上此行以防止编译器进行不必要的代码分析，避免出现警告
        //<auto-generated>
        using System;
        namespace SourceGeneratorDemo.Generator;

        public class HelloWorld
        {
            public static void SayHello()
            {
                Console.WriteLine("Hello, World!");
            }
        }
        """;

    public void Initialize(IncrementalGeneratorInitializationContext context)
    {
        //在编译时生成源代码
        context.RegisterPostInitializationOutput(ctx => 
            ctx.AddSource("HelloWorld.g.cs",SourceText.From(HelloWorld, Encoding.UTF8)));
    }
}
```



## 在其他项目中引用源生成器

创建一个控制台项目SourceGeneratorDemo.Console，设为我们的启动项目

添加项目引用后，我们还要在csproj文件里做出以下调整：

```xml
<ProjectReference Include="..\SourceGeneratorDemo.Generator\SourceGeneratorDemo.Generator.csproj" OutputItemType="Analyzer" ReferenceOutputAssembly="false"/>
```

`OutputItemType`属性说明源生成器是作为一个分析器(Analyzer)引入项目；

`ReferenceOutputAssembly`阻止源生成器的程序集复制到输出文件夹，因为其只在编译时起作用



重新生成解决方案后，以Rider为例，我们可以在项目的`依赖项>.NET 9.0（取决于当前项目的.NET版本）>SourceGeneratorDemo.Generator.SampleGenerator`中找到刚刚生成的`HelloWorld.g.cs`，其内容与刚刚常量中的代码完全一致

![](assets/CSharp%20源生成器(Source%20Generator)入门/01.png)

若使用Visual Studio 2022，在项目的`依赖项>分析器>SourceGeneratorDemo.Generator>SourceGeneratorDemo.Generator.SampleGenerator`中也可以找到相同文件

![](assets/CSharp%20源生成器(Source%20Generator)入门/02.png)



现在我们就可以在Program.cs引用生成的内容了:

```csharp
using SourceGeneratorDemo.Generator;
HelloWorld.SayHello();
```

编译成功即可看到输出

![](assets/CSharp%20源生成器(Source%20Generator)入门/03.png)



## 源码
https://github.com/zxbmmmmmmmmm/SourceGeneratorDemo



## 引用

[Roslyn 分析器 EnforceExtendedAnalyzerRules 属性的作用](https://blog.lindexi.com/post/Roslyn-分析器-EnforceExtendedAnalyzerRules-属性的作用.html)

[源生成器：根据需要自动生成机械重复代码 | 扑克博客](https://poker-sang.github.io/posts/分析器/源生成器：根据需要自动生成机械重复代码.html#创建及使用attribute)
