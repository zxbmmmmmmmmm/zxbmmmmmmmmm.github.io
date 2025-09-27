---
date: 2025-09-27
title: BindingList的应用与改进
slug: application-and-improvement-of-bindinglist
category:
  - C#
tag:
  - XAML
  - Avalonia
---

# BindingList的应用与改进

在编写UI的过程中，我们通常使用`ObservableCollection`来监听列表的变化。然而，`ObservableCollection`只能在**添加/移动/移除元素**时通知界面，这意味着元素内部更改时，`ObservableCollection`是无法通知的

如果需要监听列表元素内部的更改，可以使用`System.ComponentModel.BindingList`。

`BindingList`作用是将列表中元素内部的更改"转发"到外部。由于需要监听每个元素内部的属性更改，**`BindingList`中的所有元素必须实现`INotifyPropertyChanged`**



## 使用

现有`Item`类如下:


```csharp
public partial class Item : ObservableObject
{
    [ObservableProperty]
    public partial string? Name { get; set; }

    [ObservableProperty]
    public partial int Value { get; set; }
}
```

有`Items`列表中存储多个`Item`，如果需要计算列表中所有`Value`的总和，我们就可以使用`BindingList`
```csharp
[ObservableProperty]
public partial BindingList<Item> Items { get; set; } = [];

public int TotalValue => Items.Sum(i => i.Value);
```

然而修改`Items`中元素后，`TotalValue`并没有被更新，这是为什么呢？

事实上，`BindingList`并不能主动通知`TotalValue`属性。但它提供了十分强大的`ListChanged`事件，它在添加/删除元素或元素内部更改时均会触发(会根据更改类型会在`ListChangedEventArgs`中提供不同的`ListChangedType`)，这是`ObservableCollection`无法做到的

```csharp
public enum ListChangedType
{
	Reset,// 清空列表或列表行为变化(AllowNew/AllowEdit/AllowRemove发生改变)
	ItemAdded,// 添加元素
	ItemDeleted// 删除元素
	ItemMoved,// 移动元素
	ItemChanged,// 元素内部属性更改

	// BindingList未使用下面三个成员
	PropertyDescriptorAdded,
	PropertyDescriptorDeleted,
	PropertyDescriptorChanged
}
```

我们可以订阅此事件并完成对`TotalValue`的通知

```csharp
public MainViewModel()
{
    // 此处OnPropertyChanged为MVVM工具包中ObservableObject的代码，可替换为PropertyChanged?.Invoke()
    Items.ListChanged += (s, e) => OnPropertyChanged(nameof(TotalValue));
}
```

现在，TotalValue在元素更改时就会重新计算，可直接用于单向绑定



## 缺陷以及解决方案

在Avalonia测试时，会发现一个很奇怪的现象：如果将`BindingList`作为列表控件的`ItemSource`使用，在添加/删除元素时，尽管`TotalValue`会被正确更新，但列表没有任何变化。同时，`Count`属性也没有得到正确通知

<video id="video" controls="" >
      <source id="mp4" src="@source/posts/assets/BindingList的应用与改进/video_01.mp4" type="video/mp4">
</video>

查看Avalonia中[ItemSourceView的代码](https://github.com/AvaloniaUI/Avalonia/blob/master/src/Avalonia.Controls/ItemsSourceView.cs#L286)后发现，它只通过`INotifyCollectionChanged`的`CollectionChanged`事件来刷新列表，而`BindingList`并未实现和`INotifyCollectionChanged`接口，这也就是为什么`BindingList`无法正确通知UI

同时，`BindingList`也未实现`INotifyPropertyChanged`，造成`Count`属性未更新

>WinUI 3中，列表未刷新但`Count`属性能更新，可能是不同UI框架实现的问题

```csharp
private protected void SetSource(IEnumerable source)
{
    ...
    if (_listening && _source is INotifyCollectionChanged inccNew)
        CollectionChangedEventManager.Instance.AddListener(inccNew, this);
}
```

现在解决方法就很简单了：继承`BindingList`，实现这两个接口并在添加/移除元素进行通知即可。

完整代码如下：

```csharp
public class ObservableBindingList<T> : BindingList<T>, INotifyCollectionChanged, INotifyPropertyChanged
{
    public event NotifyCollectionChangedEventHandler? CollectionChanged;
    public event PropertyChangedEventHandler? PropertyChanged;

    protected override void InsertItem(int index, T item)
    {
        base.InsertItem(index, item);
        CollectionChanged?.Invoke(index, new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Add, item, index));
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(Count)));
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("Item[]"));// 通知集合索引器的变化(通过索引器绑定列表第几项时使用)
    }

    protected override void RemoveItem(int index)
    {
        var item = this[index];
        base.RemoveItem(index);
        CollectionChanged?.Invoke(index, new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Remove, item, index));
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(Count)));
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("Item[]"));
    }
}
```

使用：

```csharp
[ObservableProperty]
public partial ObservableBindingList<Item> Items { get; set; } = [];

public int TotalValue => Items.Sum(i => i.Value);

public MainViewModel()
{   
    // 此处OnPropertyChanged为MVVM工具包中ObservableObject的代码，可替换为PropertyChanged?.Invoke()
    Items.ListChanged += (s, e) => OnPropertyChanged(nameof(TotalValue));
}
```

现在，增删(移动)元素/修改元素内部的值均可正确通知界面

<video id="video" controls="" >
      <source id="mp4" src="@source/posts/assets/BindingList的应用与改进/video_02.mp4" type="video/mp4">
</video>

## 示例代码

[BindingListTest](https://github.com/zxbmmmmmmmmm/BindingListTest)
