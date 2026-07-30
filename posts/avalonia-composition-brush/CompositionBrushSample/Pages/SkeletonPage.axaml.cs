using System;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Interactivity;
using Avalonia.Media;
using Avalonia.Rendering.Composition;
using Avalonia.Rendering.Composition.Animations;

namespace CompositionBrushSample.Pages;

public partial class SkeletonPage : ContentPage
{
    public SkeletonPage()
    {
        InitializeComponent();
    }

    protected override void OnLoaded(RoutedEventArgs e)
    {
        base.OnLoaded(e);
        ApplyCompositionBrush();
    }

    private void ApplyCompositionBrush()
    {
        var compositor = ElementComposition.GetElementVisual(BrushHost)!.Compositor;

        var brush = compositor.CreateLinearGradientBrush();
        brush.StartPoint = new RelativePoint(-0.5, 0.5, RelativeUnit.Relative);
        brush.EndPoint = new RelativePoint(1.5, 0.5, RelativeUnit.Relative);

        var leadingStop = compositor.CreateGradientStop(0f, Colors.Transparent);
        var highlightStop = compositor.CreateGradientStop(
            0.25f, Color.FromArgb(8, 255, 255, 255));
        var trailingStop = compositor.CreateGradientStop(0.5f, Colors.Transparent);

        brush.GradientStops.Add(leadingStop);
        brush.GradientStops.Add(highlightStop);
        brush.GradientStops.Add(trailingStop);

        AnimateOffset(compositor, leadingStop, -0.5f, 1f);
        AnimateOffset(compositor, highlightStop, -0.25f, 1.25f);
        AnimateOffset(compositor, trailingStop, 0f, 1.5f);

        BrushHost.Background = brush;
    }

    private static void AnimateOffset(
        Compositor compositor,
        CompositionGradientStop gradientStop,
        float from,
        float to)
    {
        var animation = compositor.CreateScalarKeyFrameAnimation();
        animation.Duration = TimeSpan.FromSeconds(1.5);
        animation.IterationBehavior = AnimationIterationBehavior.Forever;
        animation.InsertKeyFrame(0f, from);
        animation.InsertKeyFrame(1f, to);
        gradientStop.StartAnimation("Offset", animation);
    }
}
