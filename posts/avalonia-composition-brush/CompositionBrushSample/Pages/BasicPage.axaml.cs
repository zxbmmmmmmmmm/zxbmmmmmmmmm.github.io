using Avalonia.Controls;
using Avalonia.Interactivity;

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
        
        //BrushHost.Background = brush;
    }
}