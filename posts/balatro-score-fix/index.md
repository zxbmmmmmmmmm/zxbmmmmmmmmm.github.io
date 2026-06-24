---
title: 修复《小丑牌》爆机后出牌闪退的问题
date: 2026-6-24
tag:
  - 游戏
  - Lua
---

最近玩小丑牌有点上头，想打个无尽39底注爆机玩玩。结果在二十多底注左右的时候不小心打爆了一次，后面一旦出牌就直接闪退，感觉丢掉玩了这么久的存档也不太好，遂尝试修复

---

> 给没玩过的科普一下：小丑牌的分数数据使用双精度浮点(`double`)类型存储，一旦获得的分数超出了`double`能存储的最大数值(`1.797e308`)，这次出牌的得分就会显示为`nan`，也就是所谓的“爆机”
>
> 在无尽模式中，筹码所需要的分数是呈指数型增长的，到了39底注时，回合的至少得分也超出了`double`的数据上限，彻底无法打败，某种意义上算是无尽的终点

小丑牌没有做任何加密/混淆措施，你可以直接找到其源码进行修改

> 我购买的是XBOX（微软商店）版，源码位于`XboxGames\Balatro\Content\Assets`中
>
> Steam版需要打开游戏目录找到`Balatro.exe`并以压缩包打开

经过一番搜索，我找到了问题所在：在`functions/misc_functions.lua`中，出牌时会将分数与本局最高分相比较

然而由于我们上一次出牌爆机，这里的出牌最高分记录也变成了`nan`，在与当前分数进行比较时就会异常从而导致游戏闪退

```lua
function check_and_set_high_score(score, amt) --出牌时，传入score的值为'hand'，此时G.GAME.round_scores[score].amt代表的是本局最高分数
  if not amt or type(amt) ~= 'number' then return end
  if G.GAME.round_scores[score] and math.floor(amt) > G.GAME.round_scores[score].amt then --G.GAME.round_scores[score].amt为nan，比较失败导致游戏崩溃并闪退
    G.GAME.round_scores[score].amt = math.floor(amt)
  end
  if  G.GAME.seeded  then return end
  if score == 'hand' and G.SETTINGS.COMP and ((not G.SETTINGS.COMP.score) or (G.SETTINGS.COMP.score < math.floor(amt))) then
    G.SETTINGS.COMP.score = amt
    send_score(math.floor(amt))
  end
  if G.PROFILES[G.SETTINGS.profile].high_scores[score] and math.floor(amt) > G.PROFILES[G.SETTINGS.profile].high_scores[score].amt then
    if G.GAME.round_scores[score] then G.GAME.round_scores[score].high_score = true end
    	G.PROFILES[G.SETTINGS.profile].high_scores[score].amt = math.floor(amt)
    G:save_settings()
  end
end
```

要修复此问题，只需要修改第二个if，确保仅在`G.GAME.round_scores[score].amt`为合法数值时再进行进一步比较

修改后的函数如下：

```lua
function check_and_set_high_score(score, amt)
  if not amt or type(amt) ~= 'number' then return end
  if G.GAME.round_scores[score] then
    local round_amt = G.GAME.round_scores[score].amt
    if type(round_amt) == 'number' and round_amt == round_amt and math.floor(amt) > round_amt then --仅在round_amt为非nan值时进行比较
      G.GAME.round_scores[score].amt = math.floor(amt)
    end
  end
  if  G.GAME.seeded  then return end
  if score == 'hand' and G.SETTINGS.COMP and ((not G.SETTINGS.COMP.score) or (G.SETTINGS.COMP.score < math.floor(amt))) then
    G.SETTINGS.COMP.score = amt
    send_score(math.floor(amt))
  end
  if G.PROFILES[G.SETTINGS.profile].high_scores[score] and math.floor(amt) > G.PROFILES[G.SETTINGS.profile].high_scores[score].amt then
    if G.GAME.round_scores[score] then G.GAME.round_scores[score].high_score = true end
    G.PROFILES[G.SETTINGS.profile].high_scores[score].amt = math.floor(amt)
    G:save_settings()
  end
end
```

将源文件的函数替换后，在39注之前就不用再去特意控分防止爆机导致存档损坏了！

---

在这附一张前两天打的39注爆机：

~~X1.5倍率！再来一次！爽！~~

![](/01.jpg)
