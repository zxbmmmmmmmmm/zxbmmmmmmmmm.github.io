---
date: 2023-11-26
title: 在WPF/MAUI中使用x:Bind
category:
  - C#
tag:
  - WPF
  - MAUI
---

# 在WPF/MAUI中使用x:Bind

最近逛GitHub的时候的时候，偶然看到了[CompiledBindings](https://github.com/levitali/CompiledBindings)这个库，据说可以实现和UWP中x:Bind一样的效果

原理也是在编译时生成相关代码，性能应该比自带的Binding好些

***

## 使用

从[NuGet](https://www.nuget.org/packages/CompiledBindings.WPF/)中安装:

![](assets/在WPF%20MAUI中使用x%20Bind/01.png)

安装完成后，可直接在XAML中使用x:Bind

使用方法类似于UWP，无需设置DataContext（默认绑定方式为OneWay）

### 绑定到属性

```xml
<TextBlock Text="{x:Bind ViewModel.Text}"/>
```

```csharp
public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
    }

    public MainWindowViewModel ViewModel = new();
}

```

```csharp
public partial class MainWindowViewModel:ObservableObject
{
    [ObservableProperty]
        public string _text;

    public MainWindowViewModel()
    {
        var timer = new DispatcherTimer { Interval = TimeSpan.FromSeconds(1) };
        timer.Tick += (s, e) =>
        {
            Text = DateTime.Now.ToString();
        };
        timer.Start();
    }
}
```

![](assets/在WPF%20MAUI中使用x%20Bind/02.gif)

### 绑定到方法

```xml
<TextBox x:Name="MyTextBox"/>
<TextBlock Text="{x:Bind TestMethod(MyTextBox.Text)}" />
```

```csharp
public string TestMethod(string text)
{
    if (text == "Hello")
        return "Hello";
    else
        return "你好";
}
```

![](assets/在WPF%20MAUI中使用x%20Bind/03.gif)

### 运算符

```xml
<Button IsEnabled="{x:Bind not IsChanged}"/>

<TextBlock Visibility="{x:Bind IsChanged ? Collapsed : Visible}"/>
```

### 调试

可以在XAML中设置x:Bind的断点，当属性更新时即可触发
![](assets/在WPF%20MAUI中使用x%20Bind/04.png)

***

此外，这里还提供了UWP的x:Bind中没有的功能，比如StringFormat之类的

## 缺陷

- 没有代码提示
- 不支持热重载