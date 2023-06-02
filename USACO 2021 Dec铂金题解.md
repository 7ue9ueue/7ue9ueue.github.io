# USACO 21DEC Platinum

## T1 Ticket

>  题目难度：USACO P/省选

先想暴力做法。注意到一个人不会重复买票，所以我们可以把每种票看作虚拟节点，买票看作从 $c_i$ 到 $i$ 号票边权为 $p_i$ 的边，同时 $i$ 号票向区间 $[a_i,b_i]$ 中的所有点连边权为 $0$ 的边。题目希望求出每个点到达 $1$ 和 $n$ 所需的最小代价，不妨建反图以 $1$ 和 $n$ 为原点分别跑一遍最短路。

然而这样会喜提 WA 。因为仍然没有解决重复买票的问题，两条最短路的交集中的所有边被算了两遍。怎么解决？先记当前答案为 $dis_i=d1_i+dn_i$ ，若节点 $u$ 的两条最短路均经过它的邻居 $v$ ，不难发现 $dis_u=dis_v+w$ 。这和单源最短路的松弛本质相同，我们对答案数组重新跑一遍最短路即可。

时间复杂度：$O(NK\log(NK))$

下面提供两种优化的思路，第一种是考场第一眼看出的线段树优化建图，具体知识可以参考这个博客 [DS优化建图](https://www.luogu.com.cn/blog/forever-captain/DS-optimize-graph) 。

对区间中的每个点暴力连边是不好的！我们用线段树建图的方式连边，时间复杂度为 $O(N\log^2 N)$ 。USACO评测机或洛谷开 O2 均可通过本题。

```cpp
#include <bits/stdc++.h>
#define rep(i,a,b) for(int i=(a);i<=(b);++i)
#define ll long long
using namespace std;
inline ll read(){
    ll x=0,f=1;char ch=getchar();
    while (!isdigit(ch)){if (ch=='-') f=-1;ch=getchar();}
    while (isdigit(ch)){x=x*10+ch-48;ch=getchar();}
    return x*f;
}
const int N=1e6+5,M=7e6+5;
const ll inf=1e16;
int head[N],cnt;
struct Edge{
    int to,nxt,w;
}e[M];
inline void add(int u,int v,int w){e[++cnt]={v,head[u],w};head[u]=cnt;}
int n,q,s;
struct Node{int l,r;}t[N];
#define ls (p<<1)
#define rs (ls|1)
inline void build(int p,int l,int r){
    t[p].l=l,t[p].r=r;
    if(l==r){//叶子节点与原图加边
        add(l+8*n,p,0);add(p+4*n,l+8*n,0);
        add(p,l+8*n,0);add(l+8*n,p+4*n,0);
        return;
    }
    //向儿子连边
    add(p,ls,0);add((ls)+4*n,p+4*n,0);
    add(p,rs,0);add((rs)+4*n,p+4*n,0);
    int mid=(l+r)>>1;
    build(ls,l,mid);
    build(rs,mid+1,r);
}
inline void upd(int p,int L,int R,int u,int w){
    int l=t[p].l,r=t[p].r,mid=(l+r)>>1;
    if(l==L&&r==R){//当前节点覆盖区间
        add(p+4*n,u+8*n,w);
        return;
    }
    if(R<=mid)upd(ls,L,R,u,w);
    else if(L>mid)upd(rs,L,R,u,w);
    else{
        upd(ls,L,mid,u,w);upd(rs,mid+1,R,u,w);
    }
}
ll dis[N],d[N];
struct node{
    ll dis;int pos;
    bool operator <( const node &x )const{
        return x.dis < dis;
    }
};
bool vis[N];
priority_queue <node> pq;
inline void dijkstra(bool op=0){
    if(!op){
        memset(dis,0x3f,sizeof(dis));
        dis[s]=0;pq.push({0,s});
    }else{
        rep(i,1,9*n+q)pq.push({dis[i],i});
    }
    memset(vis,0,sizeof(vis));
    while(!pq.empty()){
        node tmp=pq.top();pq.pop();
        int x=tmp.pos;
        if(vis[x])continue;
        vis[x]=1;
        for(int i=head[x];i;i=e[i].nxt){
            int y=e[i].to;
            if(dis[y]>dis[x]+e[i].w){
                dis[y]=dis[x]+e[i].w;
                pq.push({dis[y],y});
            }
        }
    }
}
int main(){
    n=read(),q=read();
    build(1,1,n);
    rep(i,1,q){
        int a=read(),w=read(),b=read(),c=read();
        upd(1,b,c,i+n,0);
        add(9*n+i,a+8*n,w);
    }
    s=8*n+1;
    dijkstra();
    memcpy(d,dis,sizeof(d));
    //rep(i,1,n)cout<<dis[i+8*n]<<' ';
    s=9*n;
    dijkstra();
    rep(i,1,9*n+q)dis[i]+=d[i];
    dijkstra(1);
    rep(i,1,n){
        if(dis[i+8*n]>inf)puts("-1");
        else printf("%lld\n",dis[i+8*n]);
    }
    return 0;
}
```

如何优化？考虑 dijkstra 时实际上在做什么。原图中的节点会影响将它包含的票的虚拟节点，然后这个虚拟节点仅影响其所对应的一个原图节点 $(i\to c_i)$ 。其次，我们知道堆优化 dijkstra 后每个票仅会被更新一次。于是并不需要建出图，在线段树上转移并且对更新完的区间打上标记就可以做到 $O(N\log N)$ （代码咕咕咕）。

第二种做法来自 Benq 的题解。同样利用上面的性质，对所有票按左端点升序排列，注意到每个门票最多入队一次，建一棵势能线段树维护一段区间的所有票右端点的最大值即可。在每个票入队后打上标记，均摊分析可以得出复杂度为 $O(N\log N)$ 。目前在洛谷上是最优解。

时间复杂度：$O(N\log N)$

```cpp
#include <bits/stdc++.h>
#define rep(i,a,b) for(int i=(a);i<=(b);++i)
#define per(i,a,b) for(int i=(a);i>=(b);--i)
#define pii pair<int,int>
#define vi vector<int>
#define fi first
#define se second
#define pb push_back
#define ALL(x) x.begin(),x.end()
#define sz(x) int(x.size())
#define ll long long
using namespace std;
inline ll read(){
    ll x=0,f=1;char ch=getchar();
    while (!isdigit(ch)){if (ch=='-') f=-1;ch=getchar();}
    while (isdigit(ch)){x=x*10+ch-48;ch=getchar();}
    return x*f;
}
const int N=2e5+5;
const ll inf = 1e18;
struct ticket{int c,p,a,b;};
bool cmp(ticket x,ticket y){return x.a<y.a;}
struct SegTree{
    int n,sz;
    vector <int> mx;
    vector <ticket> tickets;
#define ls (p<<1)
#define rs (ls|1)
    void pushup(int p){mx[p]=max(mx[ls],mx[rs]);}
    SegTree(vector <ticket> tickets) : tickets(tickets){//初始化
        n = 1;
        sz = sz(tickets);
        while(n < sz)n<<=1;
        mx.assign(2*n,0);
        rep(i,0,n-1){
            if(i < sz){
                mx[i+n] = tickets[i].b;
            }else mx[i+n] = -1;
        }
        per(i,n-1,1)pushup(i);
    }
    //找到所有可能转移的门票并移除
    void remove(vector <int> &v,int x,int p=1,int L=0,int R=-1){
        if(R==-1)R+=n;
        if(L>=sz||tickets[L].a>x||mx[p]<x)return;
        if(L==R){
            mx[p] = -1;
            v.pb(L);
            return;
        }
        int mid = (L+R)>>1;
        remove(v,x,ls,L,mid),remove(v,x,rs,mid+1,R);
        pushup(p);
    }
};
void Min(ll &a,const ll b){if(a>b)a=b;}
int main(){
    int n=read(),k=read();
    vector <ticket> tickets(k);
    for(auto &t: tickets){
        t.c=read()-1,t.p=read(),t.a=read()-1,t.b=read()-1;
    }
    sort(ALL(tickets),cmp);
    auto Dij = [&](vector<ll> &dis){//Dijkstra
        priority_queue <pair<ll,int>> pq;
        rep(i,0,k-1){
            Min(dis[tickets[i].c],dis[i+n]+tickets[i].p);
        }
        rep(i,0,n-1){
            if(dis[i]<inf)pq.push({-dis[i],i});
        }
        SegTree seg(tickets);
        while(!pq.empty()){
            pii x = pq.top();
            pq.pop();
            if(-x.fi>dis[x.se])continue;
            vector <int> vec;
            seg.remove(vec,x.se);//找到转移的门票
            for(int t : vec){
                if(dis[t+n] > dis[x.se]){
                    dis[t+n] = dis[x.se];
                    if(dis[tickets[t].c] > dis[x.se] + tickets[t].p){
                        dis[tickets[t].c] = dis[x.se] + tickets[t].p;
                        pq.push({-dis[tickets[t].c],tickets[t].c});
                    }
                }
            }
        }
    };
    //三次最短路
    vector <ll> L(n+k,inf),R(n+k,inf),dis(n+k);
    L[0]=0,R[n-1]=0;
    Dij(L),Dij(R);
    rep(i,0,n+k-1)dis[i] = L[i] + R[i];
    Dij(dis);
    rep(i,0,n-1){
        if(dis[i]<inf)printf("%lld\n",dis[i]);
        else puts("-1");
    }
    return 0;
}
```

## T2 Paired Up

> 题目难度：USACO P+/NOI-

**子任务 1：**$T=1,N\le 5000$

设 $dp[i][j]$ 为当前考虑到第 $i$ 头 H 牛，第 $j$ 头 G 牛时匹配的牛的最大权值和。那么我们可以选择不匹配 $i$ ，不匹配 $j$ ，或者是将 $i$ 和 $j$ 匹配。

时间复杂度： $O(N^2)$

```cpp
#define rep(i,a,b) for(int i=(a);i<=(b);++i)
#define pii pair<int,int>
#define vi vector<int>
int main(){
	T=read(),n=read(),K=read();
    vector <pii> cow[2];
    cow[0].pb({0,0}),cow[1].pb({0,0});
    rep(i,1,n){
        cin>>c;
        int x=read(),y=read();
        cow[c=='H'].pb({x,y});
        sum+=y;
    }
    A=sz(cow[0]),B=sz(cow[1]);
    if(T==1){
        vector <vi> dp(A+1,vi(B+1));
        rep(i,1,A)rep(j,1,B){
            dp[i][j]=max(dp[i-1][j],dp[i][j-1]);
            if(abs(cow[0][i].x-cow[1][j].x)<=K)
                dp[i][j]=max(dp[i][j],dp[i-1][j-1]+cow[0][i].y+cow[1][j].y);
        }
        printf("%d\n",sum-dp[A][B]);
    }
}
```

**子任务 2：**$T=2,N\le 300$

对于最大化未匹配的权值和，我们考虑使用类似的 dp 状态。但是注意到在上述转移时，有时候我们考虑的并不是**最大**匹配，只是因为最优解只产生于最大匹配（若不是最大匹配，多匹配两头牛显然更优），我们才能得到 $T=1$ 时的答案。 

于是我们需要把**最大**匹配这一限制加入我们的 dp 状态，具体地，我们加入一维 $k$ 表示最后一头未匹配的牛，假设我们不想匹配当前的 H 牛，那么牛 $k$ 必须满足如下条件之一：

- 牛 $k$ 的品种是 $H$
- 牛 $k$ 与当前牛的距离大于 $K$

状态量是 $O(N^3)$ ，每次转移还是 $O(1)$ 的，足够通过该子任务。

时间复杂度：$O(N^3)$

```cpp
vector <vector<vi>> dp(A+1,vector<vi>(B+1,vi(n+1,-1)));
dp[0][0][n]=0;
rep(i,0,A)rep(j,0,B)rep(k,0,n){
    if(dp[i][j][k]==-1)continue;
    if(i<A&&j<B&&abs(cow[0][i].x-cow[1][j].x)<=K)
        Max(dp[i+1][j+1][k],dp[i][j][k]);
    if(i<A&&(!(A<=k&&k<n&&cow[0][i].x<=cow[1][k-A].x+K)))
        Max(dp[i+1][j][i],dp[i][j][k]+cow[0][i].y);
    if(j<B&&(!(k<A&&cow[1][j].x<=cow[0][k].x+K)))
        Max(dp[i][j+1][A+j],dp[i][j][k]+cow[1][j].y);
}
int ans = 0;
rep(i,0,n)Max(ans,dp[A][B][i]);
printf("%d\n",ans);
```

**子任务 3：**$T=2,N\le 5000$

考虑最终的优化，$i,j$ 两维比较难舍去，但我们可以修改最后一维的定义。定义 $dp[i][j][x]$ 为处理到前 $i$ 头 H 牛， $j$  头 G 牛，并且钦定下一种不放入匹配的牛的品种为 $x$ 。有转移：
$$
dp[i][j][x]\to dp[i+1][j+1][x]$$
$$
dp[i][j][H]\to dp[i+1][j][H]$$
$$
dp[i][j][G]\to dp[i][j+1][G]$$

 当然我们也可以转换钦定的品种：如果之前我们被强制不选 H 牛，那么最后一个未匹配的 H 牛最多是第 $i$ 个。能不放入匹配的 G 牛需要离该牛距离至少为 $K$ ，且在该牛之前的所有牛都要放入匹配。预处理出对于所有 $i$ ，满足条件的 G 牛编号的最小值，并且判断这段区间的牛是否能全部匹配即可。

时间复杂度：$O(N^2)$

```cpp
per(i,A,1)per(j,B,1){
    if(chk(i,j))lst[i][j]=lst[i+1][j+1]+1;
    else lst[i][j]=0;
}
int j=1;
rep(i,1,A){
    while(j<=B&&(chk(i,j)||G[j].x<H[i].x))j++;
    nxtH[i] = j;
}
j=1;
rep(i,1,B){
    while(j<=A&&(chk(j,i)||H[j].x<G[i].x))j++;
    nxtG[i] = j;
}
memset(f,-0x3f,sizeof(f));
memset(g,-0x3f,sizeof(g));
nxtG[0] = nxtH[0] = 1;
f[0][0] = g[0][0] = 0;
rep(i,0,A)rep(j,0,B){
    int cnt = max(nxtH[i]-j-1,0);
    if(i+cnt<=A && lst[i+1][j+1]>=cnt)
        Max(g[i+cnt][j+cnt],f[i][j]);
    cnt = max(nxtG[j]-i-1,0);
    if(j+cnt<=B && lst[i+1][j+1]>=cnt)
        Max(f[i+cnt][j+cnt],g[i][j]);
    if(i<A && j<B && chk(i+1,j+1)){
        Max(f[i+1][j+1],f[i][j]);
        Max(g[i+1][j+1],g[i][j]);
    }
    if(i<A) Max(f[i+1][j],f[i][j]+H[i+1].y);
    if(j<B) Max(g[i][j+1],g[i][j]+G[j+1].y);
}
printf("%d\n",max(f[A][B],g[A][B]));
```

## T3 HILO

> 题目难度：USACO P/省选-

不难发现猜 HI 的数不会使猜 LO 的数被跳过。设 $y=N-x$ ，那么原题相当于将 $a_1,a_2,\dots,a_x$ 和 $b_1,b_2,\cdots,b_y$ 排列，只记录 $a,b$ 的每次下标最大值的出现位置，求期望 $ba$ 的数量。

这可以 dp ，设 $dp[i][j][0/1]$ 为当前最大出现 $a_i,b_j$ 以及最后一个出现的是 $a/b$ ，通过简单的转移可以做到 $O(N^3)$ 。前缀和优化可以做到 $O(N^2)$ ，这里不再赘述。

比较吸引我的是在赛后讨论中看到的 $O(N)$ 做法，这里简单的证明一下。

结论：令 $H_0=0,H_N=1+\frac{1}{2}+\cdots+\frac{1}{N}$ . 有
$$
E[\#(ba)]=\frac{1}{2}(H_x+H_y-H_N+\frac{y}{N})\\
$$
证明：

$x=0$ 或 $y=0$ 时结论显然成立，不妨对 $y$ 归纳。即证 $(x,y)\to(x,y+1)$ 后期望的变化为：
$$
\Delta=\frac12(\frac1{y+1}-\frac{1}{N+1}+\frac{y+1}{N+1}-\frac{y}{N})$$
$$
=\frac{1}{2(y+1)}-\frac{y}{2N(N+1)}
$$
计算对 $a_1a_2\dots a_xb_2b_3\dots b_y$ 的排列中插入 $b_1$ 对答案的贡献， $b_1$ 只能排在第一个出现的 $b$ 之前，否则会被跳过。$y$ 个 $b$ 将 $x$ 个 $a$ 分成 $y+1$ 段，故第一个 $b$ 前 $a$ 的期望个数为 $\frac{x}{y+1}$ 个。设前面有 $k$ 个 $a$ 。

接下来，只要 $b_1$ 被插入在 $k$ 个 $a$ 中最大的 $a$ 前面，都会对期望贡献一个 "ba" 。最大的 $a$ 的期望位置为：
$$
E[index]=\left\{\begin{matrix} 
 \frac{k+1}2,\qquad k>0\\
 0,\qquad k=0\\
\end{matrix}\right. 
$$
$k=0$ 即为原排列首项是 $b$ 的概率，为 $\frac{y}{N}$ 。 能得出：
$$
\Delta = \frac{1}{N+1}(\frac{1}{2}\times(\frac{x}{y+1}+1)-\frac{y}{N}\times\frac{0+1}{2}) $$
$$
=\frac{1}{2(y+1)}-\frac{y}{2N(N+1)}
$$


```cpp
const int N=2e5+5,P=1e9+7;
int n,x;
ll H[N],inv[N];
int main(){
    n=read(),x=read();
    inv[1]=1;
    ll fac = 1;
    rep(i,2,n){
        inv[i]=(P-P/i)*inv[P%i]%P;
        fac = fac*i%P;
    }
    rep(i,1,n)H[i]=(H[i-1]+inv[i])%P;
    int y = n-x;
    cout<<(fac*inv[2]%P*(inv[n]*y%P+H[x]+H[y]-H[n])%P+P)%P;
    return 0;
}
```

