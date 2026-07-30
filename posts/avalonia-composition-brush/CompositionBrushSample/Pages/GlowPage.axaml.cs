using System;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Interactivity;
using Avalonia.Media;
using Avalonia.Rendering.Composition;
using Avalonia.Rendering.Composition.Animations;

namespace CompositionBrushSample.Pages;

public partial class GlowPage : ContentPage
{
    public GlowPage()
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
        var brush = compositor.CreateConicGradientBrush();

        brush.GradientStops.Add(compositor.CreateGradientStop(0f, Colors.Cyan));
        brush.GradientStops.Add(compositor.CreateGradientStop(0.25f, Colors.Magenta));
        brush.GradientStops.Add(compositor.CreateGradientStop(0.5f, Colors.Yellow));
        brush.GradientStops.Add(compositor.CreateGradientStop(0.75f, Colors.Lime));
        brush.GradientStops.Add(compositor.CreateGradientStop(1f, Colors.Cyan));
        brush.Center = RelativePoint.Center;

        var animation = compositor.CreateScalarKeyFrameAnimation();
        animation.Duration = TimeSpan.FromSeconds(5);
        animation.IterationBehavior = AnimationIterationBehavior.Forever;
        animation.InsertKeyFrame(0f, 0f);
        animation.InsertKeyFrame(1f, 360f);
        brush.StartAnimation("Angle", animation);

        BrushHost.BorderBrush = brush;
    }
}
