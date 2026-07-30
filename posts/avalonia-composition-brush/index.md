---
title: Avalonia 12.2新特性：Composition Brush（合成笔刷）
date: 2026-7-30
tag:	
  - Avalonia
  - Composition
---

上一篇文章中我们介绍了Avalonia中`CompositionAnimation`（合成动画）的使用方法与优势

先前的版本中，合成动画只能在`Visual`的部分属性上使用。但在Avalonia 12.2中实现了`CompositionBrush`（合成笔刷），这将允许我们在笔刷上也能使用合成动画，从而更方便地实现一些高级笔刷效果


> 此功能的实现由我编写，实现细节可以在[PR #20181](https://github.com/AvaloniaUI/Avalonia/pull/20181)中查看
>

---


## 基本用法

`CompositionBrush`需要从`Compositor`中创建。以下代码创建一个纯色合成笔刷：

```csharp
var compositor = ElementComposition.GetElementVisual(BrushHost)!.Compositor;
var brush = compositor.CreateSolidColorBrush();
```

我们可以创建一个`KeyFrameAnimation`并在`CompositionBrush`启动，让这个笔刷的颜色不断改变：

```csharp
var animation = compositor.CreateColorKeyFrameAnimation();
animation.InsertKeyFrame(0f, Colors.Red);
animation.InsertKeyFrame(0.5f, Colors.Green);
animation.InsertKeyFrame(1f, Colors.Blue);
animation.Duration = TimeSpan.FromSeconds(5);
animation.IterationBehavior = AnimationIterationBehavior.Forever; // 重复播放
animation.Direction = PlaybackDirection.Alternate; // 正向播放完毕后反向播放
brush.StartAnimation("Color", animation);
```

所有`CompositionBrush`均实现了`IBrush`接口。因此你可以像普通笔刷一样使用它们：

```csharp
BrushHost.Background = brush;
```

最终效果如下：

<video src="./basic.mp4" autoplay muted loop/>

> 显然，使用`Transitions`和`Storyboard`，或添加一个定时器并不断更新笔刷的颜色，都可以创建相同效果的动画
>
> 但这两种方法的代码都更加冗长，且性能远不及`CompositionBrush`（参考上篇文章介绍`CompositionAnimation`原理的部分）

## 示例1：动态发光效果

AI相关的应用中经常能见到这种渐变发光边框，看上去有一种色彩流动的感觉：

<video src="./search.mp4" autoplay muted loop/>

通过`CreateConicGradientBrush()`创建一个圆形渐变并添加相应的渐变色：

> 因为`GradientStop`本身也要支持动画，所以`CompositionGradientBrush`使用`CompositionGradientStop`而非`Avalonia.Media.GradientStop`
>
> 使用`Compositor.CreateGradientStop()`方法来创建它们

```csharp
var brush = compositor.CreateConicGradientBrush();

brush.GradientStops.Add(compositor.CreateGradientStop(0f, Colors.Cyan));
brush.GradientStops.Add(compositor.CreateGradientStop(0.25f, Colors.Magenta));
brush.GradientStops.Add(compositor.CreateGradientStop(0.5f, Colors.Yellow));
brush.GradientStops.Add(compositor.CreateGradientStop(0.75f, Colors.Lime));
brush.GradientStops.Add(compositor.CreateGradientStop(1f, Colors.Cyan));
brush.Center = RelativePoint.Center;
```

为了达到色彩流动的效果，我们要让这个圆形渐变笔刷“转”起来

因此，我们选择对其`Angle`属性进行动画：

```csharp
var animation = compositor.CreateScalarKeyFrameAnimation();
animation.Duration = TimeSpan.FromSeconds(5);
animation.IterationBehavior = AnimationIterationBehavior.Forever;
animation.InsertKeyFrame(0f, 0f);
animation.InsertKeyFrame(1f, 360f);
brush.StartAnimation("Angle", animation);

BrushHost.BorderBrush = brush;
```

现在`BrushHost`的边框已经有了彩虹跑马灯的样子：

<video src="./glow-1.mp4" autoplay muted loop/>

而发光效果可以直接使用XAML搞定，创建一个元素并绑定相同的`Brush`，应用一下模糊效果即可

```xaml
<Panel>
    <Border
        Background="{Binding #BrushHost.BorderBrush}"
        Opacity="0.5"
        CornerRadius="8">
        <Border.Effect>
            <BlurEffect Radius="100" />
        </Border.Effect>
    </Border>
    <Border
        x:Name="BrushHost"
        Background="Gray"
        BorderThickness="1"
        CornerRadius="8"/>
</Panel>
```

<video src="./glow-2.mp4" autoplay muted loop/>

## 示例2：骨架屏

骨架屏常用于指示加载状态，例如Microsoft Store的加载页面：

<video src="./msstore.mp4" autoplay muted loop/>

先创建一个`LinearGradientBrush`，通过透明渐变来实现骨架屏的光带效果：

```csharp
var compositor = ElementComposition.GetElementVisual(BrushHost)!.Compositor;
var brush = compositor.CreateLinearGradientBrush();
brush.StartPoint = new RelativePoint(0, 0.5, RelativeUnit.Relative);
brush.EndPoint = new RelativePoint(1, 0.5, RelativeUnit.Relative);

var leadingStop = compositor.CreateGradientStop(0f, Colors.Transparent);
var highlightStop = compositor.CreateGradientStop(
    0.15f, Color.FromArgb(96, 255, 255, 255));
var trailingStop = compositor.CreateGradientStop(0.3f, Colors.Transparent);

brush.GradientStops.Add(leadingStop);
brush.GradientStops.Add(highlightStop);
brush.GradientStops.Add(trailingStop);
```

为了让光带移动起来，我们要控制渐变的`GradientStop`，使其重复从左到右移动：

```csharp
void AnimateOffset(CompositionGradientStop gradientStop, float from, float to)
{
    var animation = compositor.CreateScalarKeyFrameAnimation();
    animation.Duration = TimeSpan.FromSeconds(1.5);
    animation.IterationBehavior = AnimationIterationBehavior.Forever;
    animation.InsertKeyFrame(0f, from);
    animation.InsertKeyFrame(1f, to);
    gradientStop.StartAnimation("Offset", animation);
}

AnimateOffset(leadingStop, 0f, 0.7f);
AnimateOffset(highlightStop, 0.15f, 0.85f);
AnimateOffset(trailingStop, 0.3f, 1f);

BrushHost.Background = brush;
```

把此使用此笔刷的元素作为光带层，叠在占位符元素上，就能看到一个标准的动态骨架屏效果：

<video src="./skeleton.mp4" autoplay muted loop/>
