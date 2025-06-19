---
date: 2023-06-23
title: 【UWP/XAML】合并资源字典时出现 Error HRESULT E_FAIL
category:
  - C#
tag:
  - UWP
  - XAML
---

# 【UWP/XAML】合并资源字典时出现 Error HRESULT E_FAIL

![](assets/合并资源字典时出现%20Error%20HRESULT%20E_FAIL/01.png)
此错误在使用后台代码合并资源字典时可能触发
事实上，这可能是资源字典而非代码造成的错误，但此错误**没有任何有效提示**

## 解决方法

先使用下图方法在XAML中手动添加出错的资源字典：
![](assets/合并资源字典时出现%20Error%20HRESULT%20E_FAIL/02.png)
此时编译应用，就可以看到正常的报错信息了
