# IOI 2021 D1T3 Towers 题解

题目链接: https://ioi2022.id/tasks/

通过人数：8/357

题目难度：CF3000?

---

题目等价与选出一些点，使得这些点之间两两有边。

首先，观察到题目有笛卡尔树的形式。注意到笛卡尔树是二叉树。

### D = 1
当 D 的限制不存在的时候，笛卡尔树上任何一个节点的的左子树的任何一个节点都可以前往右子树的另一个节点。这两个点之间一定有一条边。因此我们可以尝试令 f[i] 为 i 节点内的字数内的答案。并且动态规划。

考虑最小的树的情况，也就是一个节点和两个孩子：可以发现，两个孩子都可以选择。也就是 `f[i] = f[ls[i]]+f[rs[i]]`, 但是，当一个孩子都没有的时候，其实也可以选择这个节点本身。所以实际上动态规划的转移方程是 `f[i] = max(1,f[ls[i]]+f[rs[i]])`, 其中 `ls` 代表左子树的编号，`rs` 代表右子树的编号。

此时如果对于每个询问去做一次动态规划，就可以得到答案了。具体就是，找到这个区间对应的笛卡尔树上的一些节点，累加即可。

有没有更快的计算方式呢？有的。可以发现，`f[i] = max(1,f[ls[i]]+f[rs[i]])` 等价与 `f[i] 的叶子节点数量`。利用这个特征就可以快速计算了。

证明是显然的。分两类讨论：

如果一个节点没有孩子，他就是孩子，而 `f[i] = max(1,f[ls[i]]+f[rs[i]]) = 1`. 也就是孩子的数量。

如果一个节点有孩子，那么它左边子树和右边子树的每个答案必然也是孩子个数，数学归纳证明即可。

现在问题变成了：给一个区间 `[L,R]`, 这里面有多少个叶子？ 线段树回答询问即可。

### D > 1 但是 L = 1 和 R = n

如果  `D>1` 动态规划的转移式是什么样的呢？更具体的问，`D>1` 会产生什么变化？产生的变化是某些节点**不再能令左边的全部节点和右边的全部节点可选**，而是需要同时满足 `h[i]-h[other]>=D`。

换句话来说，某个叶子由于高度问题，在笛卡尔树上比较深的地方，不能参与转移。在比较高的地方才可以。

那能不能把这个叶子 “移动” 祖先上第一个可以参与转移的节点呢？那么答案是不是就还是 "叶子节点的个数" 呢？答案是肯定的。DFS一遍找到转移的位置即可。

现在的叶子，就是只考虑参与 “移动” 后的位置的情况。如果它的子树内没有其他 “移动” 过来的节点，那么它就是叶子，

但是这个时候怎么计算区间 给一个区间 `[L,R]`, 这里面有多少个 "叶子"？这个是不好计算的，因为叶子的位置随时随地在变化。怎么记录叶子的变化的？可以考虑可持久化线段树。考虑倒序考虑所有的 D, 那么 "叶子" 的位置一定慢慢从根走到叶子。

但是直接维护的情况变化次数是叶子的深度的和，也就是 $O(n^2)$。减少的方式是令这个原本在线段树代表叶子的 `1` 换一个其他的位置，也就是给它的对应的祖先。

换句话来说，如果某一个时刻我们想把一个位置的 `1` 下方到它的两个孩子。我们需要做三次操作：一次 `-1` 和两次 `+1`. 但是如果我们保留这个当前位置的 `1`，也就是忽视一个孩子需要 `+1` 的操作而只考虑另外一个，我们只需要修改一次了。

也就是线段树的上 `1` 不再是说明这个位置是一个 "叶子"，而是这个位置的孩子有一个 "叶子"。

这样子就只需要修改 $O(n)$ 次了。怎么知道要修改的是左孩子还是右孩子呢？

如果考虑使得 `h[i]-h[other]<D`的 `other` 点为消失，那么最后一个完全消失的节点是我们希望修改的，因为这个节点所代表的子树是关键的。如果另外一个子树消失，答案不会变化，如果这个子树消失，答案就会变化。这里的答案指 "移动" 后的位置对答案的影响。

也就是该子树内最小的节点比另一个大。这样，我们就找到了一个顺序，并且只需要修改可持久化线段树 $O(n)$ 次，对应线段树询问即可。

### Full Solution

注意到线段树上 “叶子” 节点的位置并不是真正的位置，也是在该位置时不会对答案有影响。

但是这是不可能的，当区间询问时，答案还是会受到影响。

如果一个节点不在 `[L,R]` 的区间内，但是它转移的节点在的话，就会被多算一次。因此，这种情况我们希望减掉。

怎么处理？这种情况现在只会在最左边和最右边发生一次。对于最边上的节点 `pos`，我们考虑它是不是被 `[L,pos-1] or [pos+1,R]` 内的点转移过来的即可。也就是 `[L,pos-1] or [pos+1,R]` 内的最小值需要大于 `h[pos]-D`.

题目得到解决 $O(n\log n)$

```
#include"bits/stdc++.h"
#include"iostream"
#include"vector"
#include"towers.h"
using namespace std;

const int maxn = 1e5+5;
int ls[maxn], rs[maxn], h[maxn], stk[maxn], fa[maxn];
int leaf[maxn];
int st[maxn][30], ln[maxn];
int n,q,pter;
int L[maxn*40], R[maxn*40], val[maxn*40], vis[maxn];
int mn[maxn];
int rt[maxn];
pair<int,int> s[maxn];
vector<int> e[maxn];

int larger(int x) {
    int l = 1, r = n; 
    int ans = 0;
    while (l<=r) {
        int mid = (l+r)/2;
        if (s[mid]>=make_pair(x,-1)) {
            ans = mid;
            r = mid-1;
        }
        else {
            l = mid+1;
        }
    }
    return ans;
}

void descartes () {
    int top = 0;
    for (int i=1;i<=n;i++) {
        int k = top;
        while (k>0 and h[stk[k]]<h[i]) k--;
        if (k) rs[stk[k]] = i; 
        if (k<top) ls[i] = stk[k+1]; 
        stk[++k] = i;
        top = k;
    }
    for (int i=1;i<=n;i++) {
        if (ls[i]) fa[ls[i]] = i;
        if (rs[i]) fa[rs[i]] = i;
        if (!ls[i] and !rs[i]) leaf[i] = true;
    }
}
int stquery (int l, int r) {
	if (l>r) return 1e9;
    int logsize = ln[r-l+1];
    int ans = min(st[l][logsize],st[r-(1<<logsize)+1][logsize]);
    return ans;
}
int findfirst (int p, int l, int r, int ql, int qr) {
    if (val[p]==0) return -1;
    if (l==r) return (l+l+r+r)/4;
    int mid = (l+r)>>1;
    int ans = -1;
    if (ql<=l && r<=qr) {
        if (val[L[p]]>0) return findfirst(L[p],l,mid,ql,qr);
        else return findfirst(R[p],mid+1,r,ql,qr);
    }
    if (ql<=mid) ans = findfirst(L[p],l,mid,ql,qr);
    if (ans==-1 && qr>mid) ans = findfirst(R[p],mid+1,r,ql,qr);
    return ans;
}
int findlast (int p, int l, int r, int ql, int qr) {
    if (val[p]==0) return -1;
    if (l==r) return (l+l+r+r)/4;
    int mid = (l+r)>>1;
    int ans = -1;
    if (ql<=l && r<=qr) {
        if (val[R[p]]>0) return findlast(R[p],mid+1,r,ql,qr);
        else return findlast(L[p],l,mid,ql,qr);
    }
    if (qr>mid) ans = findlast(R[p],mid+1,r,ql,qr);
    if (ans==-1 && ql<=mid) ans = findlast(L[p],l,mid,ql,qr);
    return ans;
}
void build (int &p, int l, int r) {
    p = ++pter;
    if (l==r) return;
    int mid = (l+r)>>1;
    build(L[p],l,mid);build(R[p],mid+1,r);
}

void update (int &p, int x, int l, int r) {
    int t = p;
    p = ++pter;
    L[p] = L[t]; 
    R[p] = R[t];
    val[p] = val[t];
    val[p]++;
    if (l==r) return;
    int mid = (l+r)>>1;
    if (x<=mid) update(L[p],x,l,mid);
    else update(R[p],x,mid+1,r);
    //cout<<L[p]<<" "<<R[p]<<" "<<p<<endl;
}

int query (int p, int l, int r, int ql, int qr) {
	if (ql<=l && r<=qr) {
		return val[p];
	}
	int mid = (l+r)>>1;
	int ans = 0;
	if (ql<=mid) ans += query(L[p],l,mid,ql,qr);
	if (qr>mid) ans += query(R[p],mid+1,r,ql,qr);
	return ans;
}
void DFS (int x) {
	vis[x] = true;
    if (ls[x] and !vis[ls[x]]) DFS(ls[x]);
    if (rs[x] and !vis[rs[x]]) DFS(rs[x]);
    if (!ls[x] and !rs[x]) return;
	mn[x] = min({mn[x],mn[ls[x]],mn[rs[x]]});
	s[x].first = h[x]-max(mn[ls[x]],mn[rs[x]]);
	s[x].second = x;
}
void init (int N, vector<int> H) {
    n = N;
    h[0] = 2e9;mn[0] = 2e9;
    for (int i=1;i<=n;i++) {
        h[i] = H[i-1];
        mn[i] = h[i];
        st[i][0] = h[i];
    }
    ln[1] = 0;ln[2] = 1;
    for (int i=3;i<maxn;i++) {
        ln[i] = ln[i>>1]+1;
    }
    descartes();
    for (int j=1;j<=20;j++) {
        for (int i=1;i+(1<<j)-1<=n;i++) {
            st[i][j] = min(st[i][j-1],st[i+(1<<(j-1))][j-1]);
        }
    }
    build(rt[n+1],1,n);
    for (int i=1;i<=n;i++) {
        if (!vis[i]) DFS(i);
    }
    sort(s+1,s+n+1);
	for (int i=1;i<=n;i++) {
		if (s[i].first>0) e[larger(s[i].first)].push_back(s[i].second);
	}
    for (int i=n;i>=1;i--) {
    	rt[i] = rt[i+1];
    	for (int j=0;j<e[i].size();j++) {
    		update(rt[i],e[i][j],1,n);
    	}
    }
}

int max_towers(int l, int r, int d) {
    l++;r++;
	int cnt = larger(d);
	int ans = query(rt[cnt],1,n,l,r);
	if (ans>0) {
        int pos = findfirst(rt[cnt],1,n,l,r);
		if (!leaf[pos] && stquery(l,pos-1)+d>h[pos]) ans--;
    }
    if (ans>0) {
        int pos = findlast(rt[cnt],1,n,l,r);
		if (!leaf[pos] && stquery(pos+1,r)+d>h[pos]) ans--;
    }
	return ans+1;
}
```