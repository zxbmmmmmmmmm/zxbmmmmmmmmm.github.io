using System;
using Avalonia.Animation;
using Avalonia.Controls;
using Avalonia.Interactivity;
using Avalonia.Media;
using Avalonia.Rendering.Composition;
using Avalonia.Rendering.Composition.Animations;

namespace CompositionBrushSample.Pages;

public partial class BasicPage : ContentPage
{

    public BasicPage()
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
        var brush = compositor.CreateSolidColorBrush();

        var animation = compositor.CreateColorKeyFrameAnimation();
        animation.InsertKeyFrame(0f, Colors.Red);
        animation.InsertKeyFrame(0.5f, Colors.Green);
        animation.InsertKeyFrame(1f, Colors.Blue);
        animation.Duration = TimeSpan.FromSeconds(5);
        animation.IterationBehavior = AnimationIterationBehavior.Forever;
        animation.Direction = PlaybackDirection.Alternate;
        brush.StartAnimation("Color", animation);

        BrushHost.Background = brush;
    }
}
