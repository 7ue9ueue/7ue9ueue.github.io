**题目难度:** NOIP / USACO Silver

**题目分类:** 简单题

**题目大意:** [AIOSeniorT4] Lollipops, Sweets and Chocolates

[https://orac.amt.edu.au/cgi-bin/train/problem.pl?set=aio17sen&problemid=985]

一条街上面有 $n$ 个商铺, 第 $i$ 个商铺在 $a_i$ 上面

已知有一告示牌在位置 $x$, 且根据距离从上到下依次写出距离告示牌从近到远的编号, 求 $x$


$n≤10^5$ 

$0≤a_i≤10^9$

**题目答案:**

我看到这道题的时候直觉是去二分, 然后将告示牌上的内容求出来, 并且对 $x$ 做出调整

但是这个做法的正确性存疑, 因此我问了 @ETK , 他说可以从上到下遍历告示牌上的内容, 然后维护一个答案可能出现在的区间, 每次求并集即可

很神奇, 两种解法都是可行的!

但是本菜鸡只会 $O(n\log^2n)$, 差点卡常被卡死 (

显然 $O(n)$ 的后者更优!

今天还做了一道题, 感觉非常的不好写, 问了 @ETK 之后才发现是个2-SAT板子, 呜呜呜

Sol 1

```cpp
#include"bits/stdc++.h"
using namespace std;

struct P {
    int x;
    int id;
};

const int maxn = 1e5+5;
int a[maxn];
int o[maxn];
int n;

int cmp (P a, P b) {
    return a.x<b.x;
}

P v[maxn];
inline int check (int x) {
    for (int i=1;i<=n;i++) v[i] = {abs(a[i]-x),i};
    sort(v+1,v+n+1,cmp);
    // cout<<"x = "<<x<<endl;
    // for (int i=0;i<n;i++) {
    //     cout<<v[i].id<<" ";
    // }
    // cout<<endl;
    for (int i=1;i<=n;i++) {
        if (o[i]!=v[i].id) {
            if (abs(a[o[i]]-x)==abs(a[v[i].id]-x)) continue;
            return a[o[i]]-x<0;
        } 
    }
    cout<<x<<"\n";
    exit(0);
}
int main() {
    freopen("lscin.txt","r",stdin);
    freopen("lscout.txt","w",stdout);
    ios::sync_with_stdio(false);
    cin.tie(0);
	cin>>n;
	int L;cin>>L;
    for (int i=1;i<=n;i++) cin>>a[i];
    for (int i=1;i<=n;i++) cin>>o[i];
    int left = 0;
    int right = L;
    while (left<=right) {
        int mid = (left+right)/2;
        if (check(mid)) right = mid-1;
        else left = mid+1;
    }
    cout<<-1<<"\n";
}
```

Sol 2
```cpp
//#include<bits/stdc++.h>
#include<iostream>
using namespace std;

struct seg {
    int l;
    int r;
};

const int maxn = 2e5+5;
int a[maxn];
int o[maxn];

seg Union (seg a, seg b) {
    seg res = {-1,-1};
    res.l = max(a.l,b.l);
    res.r = min(a.r,b.r);
    if (res.l>res.r) {
        cout<<-1<<endl;
        exit(0);
    }
    return res;
}
int main() {
    freopen("lscin.txt","r",stdin);
    freopen("lscout.txt","w",stdout);
	int n;cin>>n;
	int L;cin>>L;
    for (int i=1;i<=n;i++) cin>>a[i];
    for (int i=1;i<=n;i++) cin>>o[i];
    seg ans = {1,L};
    for (int i=1;i<n;i++) {
        seg cur;
        int pos = (a[o[i]]+a[o[i+1]])/2;
        if (a[o[i]]>a[o[i+1]]) {
            cur.r = L;
            cur.l = (a[o[i]]+a[o[i+1]]+1)/2;
        }
        else {
            cur.l = 0;
            cur.r = (a[o[i]]+a[o[i+1]])/2;
        }
        ans = Union(ans,cur);
    }
    cout<<ans.l<<endl;
}
```