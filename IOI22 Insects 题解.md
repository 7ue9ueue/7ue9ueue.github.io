
# IOI2022 Insects 题解


题目链接: https://loj.ac/p/3833

通过人数：~100/357

题目难度：CF1800

---
# 观察

题目的描述看起来非常开幕雷击 - 这怎么可能能做呢？这个看起来像动态规划的问题凭什么可以区间修改？ - 估计隐藏了一些条件，那么这题的目的就是找到隐藏的条件了。

# 解答

首先注意到 DAG 和树在本问题上没有区别。因此考虑一个树。

对于 DAG 中的任意一个节点 u, 若令该节点不亮的参数选择有 $a_u$ 种，令该节点不亮的参数选择有 $b_u$ 种, 令集合 $S(u)$ 包括所有存在边 (u,v) 的点 v， 且定义函数 $f(v)$ 为

$$f(v) = (\prod_{s \in S(u)} (a_s+b_s))\times b_v$$

（设一个点的点权为他的同父亲节点的点的 $(a+b)$ 之积和该点的 $b$ 的乘积）

则 $b_u$ 满足以下递归式


$$b_u = \sum_{s \in S(u)} f(v)$$

（对于 $b_u$, 可以分解为 $u$ 的所有相邻点（除父亲节点外）的权值之和）

观察到 $(a_i+b_i)$ 为常数，将 $b_1$ 即所求答案的表达式打开可以得到叶子节点的贡献对于 $b_1$ 加法独立。注意到叶子节点 $b_l = 1$ 是亮，$a_l = 0$ 是不亮。线段树维护即可（维护 $\sum g(i)$, 也就是对于每个叶子维护单独的贡献之和）。

# 证明

根据组合意义显然。

也可以考虑计算的方式，考虑生成函数 $f_i(x) = (a_i+b_ix)$, 则 $b_u$ 可以表达为一些 $f_i(x)$ 的积的系数的带权和。（也就是对于每种亮和不亮的选择，我可以选择权值使得当前的节点亮必须要小于等于亮的节点个数）。权与 $x$ 的幂次相关（因为幂次是亮的灯的个数），因此考虑求导。

所以 $b_u$ 的递归式可以写成如下的形式。

$$ b_u = \sum_{c} [x^c] \frac{\text{d}}{\text{d}x}\prod (a_i+b_ix) $$

$$ b_u = [x^{p-1}] \frac{1}{1-x} \frac{\text{d}}{\text{d}x}\prod (a_i+b_ix) $$

$$ b_u = [x^{p-1}] \frac{1}{1-x} \sum_i\frac{b_i}{a_i+b_ix}\prod_{j} (a_j+b_jx) $$

注意到我们要求的是 $x$ 的 1-p 次幂的系数和。其中 p 为度数。但左侧生成函数的最高次只有 $p$, 因此所有的 $x$ 都可以取 1 （现在可以随便选也满足要求，限制求导后就消失了，x=1 就去掉生成函数了）.

$$ b_u =  \sum_i\frac{b_i}{a_i+b_i}\prod_{j} (a_j+b_j) $$

变形后可以得到前面的公式。证毕。

```cpp
#include"circuit.h"
#include"bits/stdc++.h"
#define ll long long 
#define ls p+p
#define rs p+p+1
using namespace std;

const int maxn = 2e5+5;
vector<int> E[maxn];
vector<ll> pre[maxn], suf[maxn];
ll val[maxn]; ll deg[maxn];
ll on[maxn]; ll ans[maxn];
ll cnt[maxn];
int n,m,rt = 1;
const int MOD = 1e9+2022;

struct seg {
    int l, r;
    ll cur, oth;
    int tag;
};
seg t[maxn*4];

void pushup (int p) {
    t[p].cur = (t[ls].cur+t[rs].cur)%MOD;
    t[p].oth = (t[ls].oth+t[rs].oth)%MOD;
}

void pushdown (int p) {
    if (!t[p].tag) return;
    t[p].tag = 0;
    t[ls].tag ^= 1;t[rs].tag ^= 1;
    swap(t[ls].cur,t[ls].oth);
    swap(t[rs].cur,t[rs].oth);
}

void build (int p, int l, int r) {
    t[p].l = l;
    t[p].r = r;
    if (l==r) {
        if (on[l]) t[p].cur = ans[l+n];
        else t[p].oth = ans[l+n];
        return;
    }
    int mid = (l+r)/2;
    build(ls,l,mid);
    build(rs,mid+1,r);
    pushup(p);
}

int query () {
    return t[1].cur%MOD;
}

void update (int p, int l, int r) {
    if (l<=t[p].l && t[p].r<=r) {
        swap(t[p].cur,t[p].oth);
        t[p].tag ^= 1;
        return;
    }
    pushdown(p);
    int mid = (t[p].l+t[p].r)/2;
    if (l<=mid) update(ls,l,r);
    if (mid<r) update(rs,l,r);
    pushup(p);
}

int DFS1 (int u) {
    val[u] = max(1ll,deg[u]);
    for (int v:E[u]) {
        val[u] *= DFS1(v);
        val[u] %= MOD;
    }
    return val[u];
}

void DFS2 (int u, ll prod) {
    ans[u] = prod;
    for (int i=0;i<E[u].size();i++) {
        ll nprod = prod;
        int v = E[u][i];
        if (i>0) {
            nprod *= pre[u][i-1];
            nprod %= MOD;
        }
        if (i<E[u].size()-1) {
            nprod *= suf[u][i+1];
            nprod %= MOD;
        }
        DFS2(v,nprod);
    }
}
void init (int N, int M, vector<int> f, vector<int> v) {
    n = N; m = M;
    for (int i=0;i<f.size();i++) {
        E[f[i]+1].push_back(i+1);
        pre[f[i]+1].push_back(1);
        suf[f[i]+1].push_back(1);
        deg[f[i]+1]++;
    }
    for (int i=0;i<v.size();i++) {
        on[i+1] = v[i];
    }
    DFS1(rt);
    for (int i=1;i<=n+m;i++) {
        for (int j=0;j<E[i].size();j++) {
            pre[i][j] = val[E[i][j]];
            suf[i][j] = val[E[i][j]];
        }
        for (int j=1;j<E[i].size();j++) {
            pre[i][j] *= pre[i][j-1];
            pre[i][j] %= MOD;
        }
        for (int j=E[i].size()-2;j>=0;j--) {
            suf[i][j] *= suf[i][j+1];
            suf[i][j] %= MOD;
        }
    }
    DFS2(rt,1);
    build(1,1,m);
}

int count_ways (int l, int r) {
    l++;r++;l-=n;r-=n;
    update(1,l,r);
    return query();
}
```