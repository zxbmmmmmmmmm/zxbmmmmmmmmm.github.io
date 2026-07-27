---
titie: Avalonia 12.2新特性：Composition Brush（合成笔刷）
tags:	
  - Avalonia
  - Composition
---

上一篇文章中我们介绍了Avalonia中Composition Animation（合成动画）的使用方法与优势

先前的版本中，合成动画只能在`Visual`的部分属性上使用。但在Avalonia 12.2中实现了Composition Brush（合成笔刷）功能，这将允许我们在笔刷上也能使用合成动画，从而更方便地实现一些高级笔刷效果

---

> 此功能的实现由我编写
>
> 实现细节可以在[PR #20181](https://github.com/AvaloniaUI/Avalonia/pull/20181)中查看

## 基本用法

`CompositionBrush`需要从`Compositor`中创建。例如，以下代码创建一个纯色合成笔刷：

```csharp
var brush = compositor.CreateSolidColorBrush();
compositionBrush.Color = Colors.Red;
```

所有`CompositionBrush`均实现了`IBrush`接口。因此，你可以像普通笔刷一样使用它们：

```csharp
brushHost.Background = brush;
```

而`CompositionBrush`与普通笔刷的最大区别，就在于其核心属性都支持合成动画。以下代码就编写了一个关键帧合成动画，让这个笔刷的颜色不断改变：

```
```

> 显然，使用`Transitions`和`StoryBoard`，或添加一个定时器并不断更新笔刷的颜色，都可以创建相同效果的动画
>
> 但这两种方法的代码都更加冗长，且性能远不及`CompositionBrush`（参考上篇文章介绍`CompositionAnimation`原理的部分）

## 使用实例1：渐变按钮

AI相关的应用中经常能见到这种彩色边框的按钮，有一种色彩流动的感觉：



我们可以创建一个`ConicGradientBrush`以实现此效果



## 使用实例2：骨架屏/Shimmer

