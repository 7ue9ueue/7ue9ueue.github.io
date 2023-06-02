**算法名字:** Maximum Flow Minimum Cut/Dinic

**对应难度:** 省选-/USACO Platinum-

**算法优势:** 

1. 图论基本算法之一

**解决问题** [最大流](https://www.luogu.com.cn/problem/P4782)

给图 G, 源点 S, 汇点 T. 边的边权为容量

若 S 点有无限的水流流入, 则 T 点会有多少的水流流出?

**算法描述:**

使用增广路算法

建反向边, 容量为0

每次在图当中寻找 S->T 的路径, 则最大流的答案会增加残余网络当中最小的容量, 称其为增广量

找到一条路径后, 在路径中的反向边的容量当中增加增广量, 在原边中减去增广量

之后在新的图当中继续寻找增广路即可, 当图不联通的时候, 算法结束

一个图的割是将图分为两部分, 一部分包含S, 一部分包含T

统计所有 u $\in$ S, v $\in$ T, u-v 的容量之和, 其和为这个割的大小

可以证明, 最大流等于最小割
 

**板子附上:**

```cpp
#include"bits/stdc++.h"
typedef long long ll;
using namespace std;

const ll inf = 1e15;
int n,m,s,t;
const int maxn = 6e5;
ll dis[maxn];
int tot = 1;
int now[maxn];
int head[maxn]; 

struct node {
	int to,net;
	ll val;
} e[maxn];

void add (int u,int v, ll w) {
	e[++tot].to = v;
	e[tot].val = w;
	e[tot].net = head[u];
	head[u] = tot;

	e[++tot].to = u;
	e[tot].val = 0;
	e[tot].net = head[v];
	head[v] = tot;
}

int bfs () {  
	for (int i=1;i<=n;i++) dis[i] = inf;
	queue<int> q;q.push(s);
	dis[s] = 0;
	now[s] = head[s];
	while (!q.empty()) {
		int x = q.front();q.pop();
		for(int i=head[x];i;i=e[i].net) {
			int v = e[i].to;
			if (e[i].val>0&&dis[v]==inf) {
				q.push(v);
				now[v] = head[v];
				dis[v] = dis[x]+1;
				if(v==t) return 1;
			}
		}
	}
	return 0;
}

ll dfs (int x,ll sum) { 
	if (x==t) return sum;
	ll k,res=0; 
	for(int i=now[x];i&&sum>0;i=e[i].net) {
		now[x] = i;  
		int v = e[i].to;
		if (e[i].val>0&&(dis[v]==dis[x]+1)) {
			k = dfs(v,min(sum,e[i].val));
			if(k==0) dis[v] = inf; 
			e[i].val -= k;
            e[i^1].val += k;
			res += k;
            sum -= k; 
		}
	}
	return res;
}

int main() {
	cin>>n>>m>>s>>t;
	for(int i=1;i<=m;i++) {
        int u,v,w;
		cin>>u>>v>>w;
		add(u,v,w);
	}
    ll ans = 0;
	while (bfs()) ans += dfs(s,inf); 
	cout<<ans<<endl;
	return 0;
}
```