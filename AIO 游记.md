金色的AIO 2021游记


---
 好耶, 集训队了 \
题目难度: CF2000-2200, CSP-S一等奖 \
分数: (100+100+100+100+100+100) / 600

---

Day -2

考前在做一道比较分类讨论的题目: 

```
有 n 个学生, 其中有一个学生偷吃了饼干
现在有 m 条口供, 每一种口供为如下三种其一:

x 说 y 在说谎
x 说 y 没有说谎
x 说 y 偷吃了饼干

已知每个学生要么只说谎要么只说实话, 求谁可能偷吃了饼干, 或者此情况是不可能的
```

去年都用二分图染色去做, 没成功

这次用并查集去做, 调了 10hrs 后分类讨论出来了

---

Day 1

请假 ~~(逃课)~~ 在睡觉, 然后打游戏

上午的时候做了套前几年的题, 40min AK掉了, 自信心提升了

下午的时候想写写题, 第一题就没调出来, 就又睡觉去了

---

Day 0

比较提前的到了考场, 心情比较平静, 比较紧张, 和Ethan妈妈一起布置了一下考场环境然后简单的沟通了一下就直接开考了 

我的策略是顺着做题, 做完才看下一题, 因为我是奔着满分去的, 而不是在省选集训那样为了骗分去打出各种策略

一共有六道题, 前三题是简单题, 大概是普及组的难度, 花了15分钟左右写好了

**T1 Robot [普及]**, 考虑起点和终点的曼哈顿距离即可 \
**T2 Art Class II  [普及]**,考虑x y坐标情况下分别的最值即可 \
**T3  Melody  [普及]**, 考虑 Mod 3 每个同余组内最多的数的个数即可

然后其实把握是比较大的, 因为最近几个月的cf训练导致我的手速及其的快, 其实这套题也和cf的题目类似, 也就做的比较顺了

---

**T4 Social Distancing [普及+/提高-]** 是第一道有一些算法的题目, 但是很显然的动态规划, 具体而言, 转移式应是 : 

$$ 
dp(i) = \max((dp(j)+v(i) [pos(i)-pos(j) ≥ k] ))
$$

$$v(i), pos(i) ≥ 0$$

对所有的 $\text{pos}$ 进行排序后动态规划即可

朴素的做法是 $O(n^2)$, 直接数据结构是 $O(n\log n)$ 的, 而且会非常的耗时, 但是这个动态规划显然单调递增, 因此具有抉择单调性, 可以用维护一个前缀最大值的方法做到 $O(n)$, 而且比较好写

写法大概就是考虑一个新的 $\text{i}$ 可以激活什么点, 激活后就把放入到前缀最大值的考虑当中  

抉择单调性的证明是这样的:

$dp(i) = \max((dp(j)+v(i)[pos(i)-pos(j) ≥ k]) $

$dp(i) = \max(dp(j)[pos(i)-k≥pos(j)])+v(i) $

又有 $pos(i)-k$ 递增, 故 $\text{dp}$ 递增, 自然具有抉择单调性

大概花了20分钟就写出来, 感觉难度不是很大, 但是写这种 「激活」类型的代码我一直不太擅长, 所以运气还是比较好的  

第一遍提交的时候以为 $v[i]=1$ 了, 读了一边题后发现了这个问题, 解决了就通过了

---

**T5 Space Mission [提高]** 是一个trival的数据结构问题

这个问题用代数形式表达出来就是:

$$\max(\text{abs}(i-j)[v[i]+v[j]≤C])$$

遇到绝对值可以直接分类讨论, 然后看到这是个类似二维偏序的问题, 直接数据结构就好了, 然后可以用上一题激活的思想离线可以处理掉一维, 最后剩下的问题用线段树/树状数组就好了

(不知道为啥我离线之后维度还是二, 反思了一下如果离线之后可能不需要数据结构了, 但是我考场上还是写了个线段树)

我的代码能力比较差, 这题大概花了一个小时, 但还是有惊无险的通过了

---

**T6 Laser Cut [提高+/省选-]** 是对代码能力要求比较高的题目, 题目大意是在一个正方形中给一个两条不相交的折线(每一部分与正方形一边平行), 其中折线的长度都是正方形长度的两倍, 求两条折线中间围出的区域最大能塞一个多大的正方形  

这道题看到的时候稍微有点慌, 因为一眼只有想法, 没有答案  

前几题一眼能看出答案, 这题只能大概猜出是动态规划或者数据结构方面的一个问题, 但是看到数据范围是 $ 10^5$  就大概清楚具体做法了

首先这个问题必须要利用到单调性, 因为 $10^{10}$ 的信息量去表达一个形状是不可行的,  因此需要用 $10^5$ 的信息量去考虑每一行的左右限制


1) 我的第一想法是首先考虑下折线中的每个折点, 我认为每一种正方形的方法都可以平移到使得左下角在折点中的情况  

由于题目的特殊限制是**正方形**, 不是**长方形**, 那么我可以锁定右上角在 $x = y$ 上的所有点上, 只要在中间区域就行

然后会发现上折线中的折点如果在 $x = y$ 一点的右下方, 这个点就不能选了, 那此时我把这个问题从一个不具体的二维问题变成了一个可做的东西, 然后枚举下折点, 和上折点, 就可以做到 $O(n^2)$ 了  

但是这一切是基于 猜想 1  成立的情况下的

写了个暴力, 一直没过, 开始质疑自己的结论但是没有找到反例, 最后在考试还剩30分钟的时候暴力成功通过  

当时很激动, 因为我大概 $O(n\log n)$ 做法

考虑每个右折点会导致答案 $ans = \min(ans,v[r])$, 然后最终答案自然是 $\max(ans)$, 此时有单调性:

**v[x] 是凹函数**

我只需要在上面一个做斜率二分就好了, 但是我发现我不会斜率二分, 然后我打算写一个三分乱搞试试

反正时间没多少, 不如写一个自己有把握的

但是三分的问题是可能两个采样点相等, 当时看到问题的时候有些害怕, 因为这个问题似乎非常的本质, 无法短时间解决  

我记得当时还剩10分钟, 但是我之前的紧张感好像一点都没了

我只在认真的思考解决的方法  

我在想, 我在想如何拯救一个假掉的算法

如果能想出来, 那集训队就到手了

那么如果问题是本质的话, 那就考虑乱搞吧

梦回金华集训!!!!!!

我如果两个采样点相同, 那么我直接break掉循环, 然后遍历 v[left:right], 然后就看有没有奇迹了

然后奇迹发生了, 通过了, 运气非常不错, 当时比赛还剩五分钟, 看到自己的分数是 

---

100 + 100 + 100 + 100 + 100 + 100

---

非常的激动, 庆祝了一番, 然后就和Ethan和深中的某位大佬吃饭去了

然后吃完饭, Ethan带我走了走校园, 不得不说还是非常壮观的, 甚至校园内部有一个园林, 园林内部还有湖, 湖里还有鸭子可以喂

如果能重来, 我要上清华!!!!!!!!!!!!!!!!! (?)

----
对于第六题的证明是这样的:

最多有 n 组情况会导致强制break, 有 $n^2$ 中采样方法, 概率大概是 $\dfrac{1}{n}$


所以次数必然小于

$$
\sum_{i=1}^{O(\lg n)} \dfrac{1}{n^i}(\dfrac{3}{4})^i O(\lg n)
$$

必然小于


$$
\sum_{i=1}^{\inf} \dfrac{1}{n^i}(\dfrac{3}{4})^i O(\lg n)
$$

固然小于 

$$
\dfrac {O(\lg n)}{1-\dfrac{3}{4n}} = \dfrac {O(\lg n)}{\dfrac{4n-3}{4n}} = \dfrac {4nO(\lg n)}{4n-3} = O(\lg n)
$$

所以随机情况下这个算法的时间复杂度是正确的 

---
感谢我的爸爸和妈妈始终支持我学习算法, 帮我买书, 报课, 报集训!

感谢Ethan妈妈帮我成功在深圳报上AIO! 

感谢ETK和我一直进行算法学习上的交流 ~

感谢Starlight237的学习资料和考前的rp++!

感谢干大好事群里的各位, 我以后打比赛也会继续当吉祥物的! 祝各位都进省队~

那么我就很荣幸的暂时AFO啦~ 几个月后见
---