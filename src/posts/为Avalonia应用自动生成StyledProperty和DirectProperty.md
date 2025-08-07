---
date: 2025-08-07
title: 为Avalonia应用自动生成StyledProperty和DirectProperty
category:
  - C#
tag:
  - Avalonia
  - Roslyn
  - 源生成器
---

# 为Avalonia应用自动生成StyledProperty和DirectProperty

最近学习了源生成器，遂仿照[CommunityToolkit/Windows](https://github.com/CommunityToolkit/Windows)中的DependencyPropertyGenerator写了个生成器，可自动生成Avalonia中的`StyledProperty`和`DirectProperty`

NuGet：https://www.nuget.org/packages/PropertyGenerator.Avalonia
Github：https://github.com/zxbmmmmmmmmm/PropertyGenerator

## 先决条件

Avalonia版本：≥ 11.3.0

由于使用了`field`关键字和部分属性，需要在项目文件内将`LangVersion`设置为`preview`

## StyledProperty

在需要生成`StyledProperty`的部分属性上添加`GeneratedStyledProperty`特性即可

```csharp
[GeneratedStyledProperty]
public partial int Count { get; set; }
```

生成的代码:

```csharp
StyledProperty<int> CountProperty = AvaloniaProperty.Register<MainWindow, int>(name: nameof(Count));
public partial int Count { get => GetValue(CountProperty); set => SetValue(CountProperty, value); }
```

***

`StyledProperty`不支持直接设置默认值，需要使用以下写法

```csharp
[GeneratedStyledProperty(10)]
public partial int Count { get; set; }
```

生成的代码:

```csharp
Avalonia.StyledProperty<int> CountProperty = AvaloniaProperty.Register<MainWindow, int>(name: nameof(Count), defaultValue: 10);
public partial int Count { get => GetValue(CountProperty); set => SetValue(CountProperty, value); }
```

***

StyledProperty的所有功能都被支持（仅作展示）

```csharp
[GeneratedStyledProperty(
    DefaultValueCallback = nameof(DefaultValueCallback),
    DefaultValue = true,
    Validate = nameof(Validate),
    Coerce = nameof(Coerce),
    EnableDataValidation = true,
    Inherits = true,
    DefaultBindingMode = BindingMode.TwoWay)]
public partial bool? IsStarted { get; set; }

private static bool DefaultValueCallback()
{
    return true;
}
private static bool Validate(bool? value)
{
    return true;
}
private static bool? Coerce(AvaloniaObject x, bool? y)
{
    return true;
}
```

生成的代码：

```csharp
StyledProperty<bool?> IsStartedProperty = AvaloniaProperty.Register<MainWindow, bool?>(
	name: nameof(IsStarted), 
	defaultValue: DefaultValueCallback(), 
	validate: Validate,
	coerce: Coerce, 
	enableDataValidation: true,
	inherits: true, 
	defaultBindingMode:BindingMode.TwoWay);
public partial bool? IsStarted { get => GetValue(IsStartedProperty); set => SetValue(IsStartedProperty, value); }
```

## DirectProperty

和`GeneratedStyledProperty`的写法相似：

```csharp
[GeneratedDirectProperty]
public partial IEnumerable? Items { get; set; }
```

***

 `DirectProperty`可以被直接初始化
```csharp
[GeneratedDirectProperty]
public partial IEnumerable? Items { get; set; } = new AvaloniaList<object>();
```


***

支持自定义`DirectProperty`的 `Getter` 和`Setter` 

```csharp
[GeneratedDirectProperty(Getter = nameof(Getter), Setter = nameof(Setter))]
public partial IEnumerable? Items { get; set; }
public static IEnumerable? Getter(MainWindow o) => o.Items;
public static void Setter(MainWindow o, IEnumerable? v) => o.Items = v;
```

生成的代码：

```csharp
public static readonly DirectProperty<MainWindow, IEnumerable?> ItemsProperty
    = AvaloniaProperty.RegisterDirect<MainWindow, IEnumerable?>(
    name: nameof(Items),
    getter: Getter, 
    setter: Setter);

public partial IEnumerable? Items { get => field; set => SetAndRaise(ItemsProperty, ref field, value); }
```

## OnPropertyChanged

使用`GeneratedStyledProperty`或者`GeneratedDirectProperty`时，会自动生成部分方法用以通知属性更改

```csharp
partial void OnCountPropertyChanged(int newValue);
partial void OnCountPropertyChanged(int oldValue, int newValue);
partial void OnCountPropertyChanged(AvaloniaPropertyChangedEventArgs e);

protected override void OnPropertyChanged(AvaloniaPropertyChangedEventArgs change)
{
    base.OnPropertyChanged(change);
    switch (change.Property.Name)
    {
        case nameof(Count):
            OnCountPropertyChanged(change);
            OnCountPropertyChanged((int)change.NewValue);
            OnCountPropertyChanged((int)change.OldValue, (int)change.NewValue);
            break;
    }
}
```

可以直接使用这些方法直接处理属性的变化：

```csharp
partial void OnCountPropertyChanged(int newValue) 
{ 
    // 处理属性变化...
}
```

如果代码已重写`OnPropertyChanged`并包含其他逻辑，则可以通过`DoNotGenerateOnPropertyChanged`特性关闭此功能：

```csharp
[DoNotGenerateOnPropertyChanged]
public partial class MainWindow : Window
{ ... }
```

也可以在整个程序集上禁用此功能

```csharp
[assembly: DoNotGenerateOnPropertyChanged]
```