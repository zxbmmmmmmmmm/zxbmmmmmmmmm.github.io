---
date: 2024-06-29
title: C# 13前瞻:Extensions
category:
  - C#
---

# C# 13前瞻:Extensions

从C#3开始，`拓展方法`这一特性就得到了广泛的应用。

此功能允许你能够使用实例方法的语法调用某个静态方法，以下是一个获取/创建文件的静态方法:

```csharp
public static async Task<StorageFile> GetOrCreateFileAsync(this StorageFolder folder,string name)
{
    var item = await folder.TryGetItemAsync(name) as StorageFile;
    item ??= await folder.CreateFileAsync(name);
    return item;
}
```

可以采取如下方式调用此方法，但可读性较差：

```csharp
await Extensions.GetOrCreateFileAsync(folder, "FileName");
```

通过为方法的第一个参数添加`this`标记，我们还可以这样调用

```csharp
await folder.GetOrCreateFileAsync("FileName");
```

拓展方法在C#的发展中有着举足轻重的作用，`System.Linq`就使用了大量拓展方法极大简化了数据查询:

```csharp
//筛选最高温大于30°C的每日天气数据并按照天气类型分组
var result = forecasts.Where(p => p.MaxTemperature > 30).GroupBy(p => p.WeatherType);
```

而现在，可拓展的内容不再局限于方法

我们可以拓展**属性、索引器（有参属性）、静态成员甚至运算符**等内容

> **注意:**`extensions`功能尚未正式进入C#13的预览版，以下示例根据[语言提案](https://github.com/dotnet/csharplang/blob/main/proposals/extensions.md)/[Build 2024演示](https://build.microsoft.com/en-US/sessions/689e5104-72e9-4d02-bb52-77676d1ec5bc)中的相关内容编写，正式版语法可能有所不同
> 
> 目前的Roslyn实现在[feature/roles](https://github.com/dotnet/roslyn/tree/features/roles)分支，可以自行编译尝试

## 示例1：隐式拓展

假定有以下类型

```csharp
public class DailyWeather
{
    public int MaxTemperature { get; set; }
    public int MinTemperature { get; set; }
    public string WeatherType { get; set; }
    public List<HourlyWeather> HourlyForecasts { get; set; }

    public class HourlyWeather
    {
        public int Temperature { get; set; }
        public string WeatherType { get; set; }
    }
}
```

定义以下隐式拓展(`implicit extension`)

拓展的语法与类十分相似，**它可以访问该类中的任意非`private`或`protected`成员，但不能有实例字段**

```csharp
public implicit extension DailyWeatherExtension for DailyWeather
{
    //拓展属性:平均温度
    public int AverageTemperature => (int)Math.Round(HourlyForecasts.Average(p => p.Temperature));

    //拓展索引器:获取/修改某小时预报
    public HourlyWeather this[int index] 
    { 
        get => HourlyForecasts[index];
        set => HourlyForecasts[index] = value;        
    }

    //拓展运算符:通过比较最高温大小支持">"/"<"运算符
    public static bool operator >(DailyWeather a,DailyWeather b)
    {
        return a.MaxTemperature > b.MaxTemperature;
    }
    public static bool operator <(DailyWeather a, DailyWeather b)
    {
        return a.MaxTemperature < b.MaxTemperature;
    }

    //拓展静态方法:获取今日天气
    public static async Task<DailyWeather> GetWeatherToday()
    {
        //从外部获取今日天气...
    }
}
```

在代码中，我们就可以这样使用:

```csharp
public async void PrintInfo(DailyWeather weather)
{
    Console.WriteLine(weather.AverageTemperature);    
    var weatherToday = await DailyWeather.GetWeatherToday();
    if(weather > weatherToday)
    {
        Console.WriteLine(weather[0].WeatherType);
    }
}
```

 这些“拓展”似乎就是类中真实存在的成员！原先需要继承才能部分实现的功能，使用一个`extension`即可完美解决

## 示例2：显式拓展

通过声明一个显式拓展(`explict extension`)，我们可以使用类型转换将类型转换为拓展的类型并获得相应的成员

有如下天气数据JSON

```json
{
    "type": "clear",
    "tempMax": 32,
    "tempMin": 20,
    "hourly": [
        {
            "time": "2024-06-09T00:00",
            "type": "cloudy",
            "temp": 20
        },
        {
            "time": "2024-06-09T06:00",
            "type": "clear",
            "temp": 24
        },
        {
            "time": "2024-06-09T12:00",
            "type": "clear",
            "temp": 32
        },
        {
            "time": "2024-06-09T18:00",
            "type": "cloudy",
            "temp": 26
        },
        {
            "time": "2024-06-09T23:00",
            "type": "rain",
            "temp": 21
        }
    ]
}
```

定义如下显式拓展:

```csharp
public explicit extension DailyWeather for JsonElement
{
    public string WeatherType => this.GetProperty("type").GetString()!;
    public string MaxTemperature => this.GetProperty("tempMax").GetString()!;
    public string MinTemperature => this.GetProperty("tempMin").GetString()!;
    public IEnumerable<HourlyWeather> HourlyForecasts => this.GetProperty("hourly")!.EnumerateArray();//此处有隐式类型转换
}
public explicit extension HourlyWeather for JsonElement
{
    public DateTime Time => this.GetProperty("time").GetDateTime()!;
    public int Temperature => this.GetProperty("temp").GetInt32()!;
    public string WeatherType  => this.GetProperty("type").GetString()!;
}
```

现在，我们可以用类型安全的方式访问JSON中的内容

```CSHA
var data = jsonData.ParseAsJson();
var weather = (DailyWeather)data;

Console.WriteLine($"今日天气:{weather.WeatherType});
foreach(HourlyWeather hourly in weather.HourlyForecasts)//此处有隐式类型转换
{
    Console.WriteLine($"{hourly.Time.Hour}时的天气:{hourly.WeatherType}");
}
```
