
**题目难度:** 省选-

**题目分类:** 计算数论

**题目大意:**

珂朵莉被困在了梦里!

她询问眼前的红发少女的离开的方法,

红发少女说:

“我的梦境中有 k 个星球“

”每个星球上都住着一个黄金妖精“

“她们都有一个生命力“

“生命力若到达了魔力上限 n, 则会触发妖精乡之门, 燃尽自己的生命”

“但我不知道她们的生命力分别是多少”

“陌生的黄金妖精啊, 你若可以帮我求得”

“斐波那契数列中“

”属于她们生命力的最大公约数的那一项”

“再将所有可能的情况求和”

“我则可以让你离开”

$$
\sum_{a_1=1}^n\sum_{a_2=1}^n\sum_{a_3=1}^n\dots\sum_{a_k=1}^nf(\gcd(a_i)) $$ 

$k≤10^4$ and $n≤10^4$


**解题思路:**

将此抽象问题转化成数论计数问题, 后考虑组合和容斥将其转化成莫比乌斯反演求解即可   

**题目答案:**
$$
\sum_{a_1=1}^n\sum_{a_2=1}^n\sum_{a_3=1}^n\dots\sum_{a_k=1}^nf(\gcd(a_i)) $$ 
$$
\sum_{i=1}^n f(i)g(\lfloor \frac{n}{i} \rfloor) $$

纯莫比乌斯反演法

$$
g(n) = g_a(n) = \sum_{i=1}^n g_a\prime(i) $$ 
$$
n^k =g_b(n) = \sum_{i=1}^n g_b\prime(i) $$ 
$$
\because g_b(n) = \sum_{d|n}g_a\prime(d) $$ 
$$
\therefore g_a\prime(n) = \sum_{d|n}\mu(d)g_b\prime(\frac{n}{d}) $$ 

反演, 变换, 求其值!

$$
g_a(n) = \sum_{i=1}^n g_a\prime(i) = \sum_{i=1}^n\sum_{d|i}\mu(d)g_b\prime(\frac{i}{d}) $$ 
$$
g_a(n)= \sum_{d=1}^n\mu(d)\sum_{i=1}^n g_b\prime(i) [d|i] $$ 
$$
 g_a(n)= \sum_{d=1}^n\mu(d)\sum_{i=1}^{\lfloor\frac{n}{d}\rfloor} g_b\prime(i) $$ 
$$
 g_a(n)= \sum_{d=1}^n\mu(d)g_b(\lfloor\frac{n}{d}\rfloor) $$ 
$$
g_a(n) = \sum_{d=1}^n\mu(d)\lfloor\frac{n}{d}\rfloor^k $$ 
$$
g_a(n) = \sum_{d=1}^n\mu(d)\lfloor\frac{n}{d}\rfloor^k $$
$$
\sum_{i=1}^nf(i)\sum_{d=1}^{\lfloor \frac{n}{i} \rfloor}\mu(d)\lfloor\frac{{\lfloor \frac{n}{i} \rfloor}}{d}\rfloor^k
$$

时间复杂度简单证明

**Claim:** 时间复杂度是 $O(n)$

**lemma:** $g(n)$ 的时间复杂度是 $O(\sqrt n)$

$$\because \lfloor \frac{n}{i} \rfloor 有O(\sqrt n)种取值$$
$$\therefore g(n)的 时间复杂度是 (\sqrt n)$$
****

$情况1:$ $i \in [\sqrt n,n]$, $\frac{n}{i} \in [1,\sqrt n]$

$$
即计算 \sum_{i=1}^\sqrt{n} \sqrt i $$
$$
约等于 \int_0^\sqrt{n} \sqrt i di$$
$$
等于 \frac{2}{3}(\sqrt n)^\frac{3}{2}$$
$$
等于 O(n^\frac{3}{4})$$
****

$情况2:$ $i \in [1,\sqrt n]$
$$
\lfloor \frac{n}{i} \rfloor 约等于 \frac{n}{i}
$$
$$ 
即计算 \sum_{i=1}^\sqrt n \sqrt \frac{n}{i} $$ 

$$ 约等于 \int_o^\sqrt n \sqrt \frac{n}{i}di $$

$$ 等于 \int_o^\sqrt n  \sqrt n\times \frac{1}{ \sqrt i}di $$

$$ 等于 \sqrt n \times n^{\frac{1}{4}} = O(n^\frac{3}{4}) \space \square$$

**Note:** 这都能有对称性? 巧合还是注定?

