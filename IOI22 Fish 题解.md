# IOI 2022 D1T1 Fish 题解

题目链接: https://ioi2022.id/tasks/

通过人数：50/357

题目难度：CF2400?
### Subtask 1

全部加在一起即可

### Subtask 2,4,5


首先，一定最多只有两个连续的 $c_i = 0$，因为如果有连续三个 $c_i = 0$, 则中间的一个 $c_i = n$ 一定是一个更好的选择。

所以每一个连续的非零 $c_i$ 的最大子段之间最多只间隔两个 $0$.

因此，考虑分类讨论。

如果间隔两个 $0$， 那么这两段之间没有影响。


观察到在这种形式的 $c_i$ 的情况中:
`
(5,0,3,0,5)
`，中间的 `3` 没有起到任何的作用。但是如果是`(5,0,6,0,5)`，中间的 `6` 掌控着旁边两个区域。

更广义的情况是，如果间隔一个 $0$, 考虑将所有这些 $0$ 移除，那么剩下的连续非零的 $c_i$ 的最大子段一定是单峰且凸的。

因此，考虑动态规划，令 `dp[i][h][0/1]` 为选到第 `i` 列且 $c_i$ 的值是 `h` 且目前是在上升/下降情况下最大的答案。转移必然是来自 `dp[i-1][h']`, `dp[i-2][h']`, 和`dp[i-3][h']`. 由于一定是先升后降（先0后1），转移方法是：

```text
dp[i][h][0] = max of：
max(dp[i-1][h'][0] + prex[i][h] - prex[i][h'])
max(dp[i-2][h'][0] + prex[i][h]) 
{h'<=h}
max(dp[i-3][h'][0] + prex[i-2][h'] + prex[i-1][h])
max(dp[i-3][h'][1] + prex[i-2][h'] + prex[i-1][h])

dp[i][h][1] = max of:
max(dp[i-1][hp][1] + prex[i][h'] - prex[i][h]);
max(dp[i-2][hp][1] + prex[i-1][h']);
max(dp[i-1][hp][0] + prex[i][h'] - prex[i][h]);
max(dp[i-2][hp][0] + prex[i-1][h']);
{h'>=h}
```

分八种情况讨论，前缀和维护动态规划 $O(n^3)$ 即可。

```cpp
#include"bits/stdc++.h"
#include"iostream"
#include"vector"
#include"cstring"
#include"fish.h"
#define ll long long 
using namespace std;

struct P
{
    int x,y,w;
};
const int maxm = 3e5+5;
const int maxn = 3005;
ll dp[maxn][maxn][2];
ll prx[maxn][maxn];
P fish[maxm];
ll ans;
int n,m;

ll c (int i, int l, int r) {
    return prx[i][r]-prx[i][l-1];
}

ll max_weights (int n, int m, vector<int> X, vector<int> Y, vector<int> W) {
    for (int i=0;i<m;i++) {
        prx[X[i]+1][Y[i]+1] += W[i];
    }
    for (int i=1;i<=n;i++) for (int j=1;j<=n;j++) {
        prx[i][j] += prx[i][j-1];
    }
    memset(dp,-0x3f,sizeof(dp));
    dp[0][0][0] = 0;
    for (int i=1;i<=n;i++) {
        for (int h=0;h<=n;h++) {
            for (int hp=0;hp<=n;hp++) {
                if (hp<=h) {
                	if (i-1>=0) dp[i][h][0] = max(dp[i][h][0],dp[i-1][hp][0]+c(i-1,hp+1,h));
                	if (i-2>=0) dp[i][h][0] = max(dp[i][h][0],dp[i-2][hp][0]+c(i-1,1,h));
                }
                if (hp>=h) {
                	if (i-1>=0) dp[i][h][1] = max(dp[i][h][1],dp[i-1][hp][1]+c(i,h+1,hp));
                	if (i-2>=0) dp[i][h][1] = max(dp[i][h][1],dp[i-2][hp][1]+c(i-1,1,hp));
                	if (i-1>=0) dp[i][h][1] = max(dp[i][h][1],dp[i-1][hp][0]+c(i,h+1,hp));
                	if (i-2>=0) dp[i][h][1] = max(dp[i][h][1],dp[i-2][hp][0]+c(i-1,1,hp));
                }
                if (i-3>=0) {
                    dp[i][h][0] = max(dp[i][h][0],dp[i-3][hp][1]+c(i-2,1,hp)+c(i-1,1,h));
                    dp[i][h][0] = max(dp[i][h][0],dp[i-3][hp][0]+c(i-2,1,hp)+c(i-1,1,h));
                }
            }
        }
    }
    for (int i=1;i<=n;i++) for (int h=0;h<=n;h++) {
        ans = max(ans,dp[i][h][1]+c(i+1,1,h));
        ans = max(ans,dp[i][h][0]+c(i+1,1,h));
    }
    return ans;
}
```

### Subtask 3,6


首先，把八种转移根据限制分成三种，注意到转移满足抉择单调性，把循环枚举的转移部分去掉即可。

例如 `h'<=h` 这类限制中，随着 `h` 越大，其来自的 `h'` 也会越来越大。在循环 `h` 的时候处理 `h'` 即可。时间复杂度 $O(n^2)$

```cpp
#include"bits/stdc++.h"
#include"iostream"
#include"vector"
#include"cstring"
#include"fish.h"
#define ll long long 
using namespace std;

struct P
{
    int x,y,w;
};
const int maxm = 3e5+5;
const int maxn = 3005;
ll dp[maxn][maxn][2];
ll prx[maxn][maxn];
ll v[maxn];
P fish[maxm];
ll ans;
int n,m;

ll max_weights (int n, int m, vector<int> X, vector<int> Y, vector<int> W) {
    for (int i=0;i<m;i++) {
        prx[X[i]+1][Y[i]+1] += W[i];
    }
    for (int i=1;i<=n;i++) for (int j=1;j<=n;j++) {
        prx[i][j] += prx[i][j-1];
    }
    memset(dp,-0x3f,sizeof(dp));
    dp[0][0][0] = 0;
    for (int i=1;i<=n;i++) {
    	for (int h=0;h<=8;h++) v[h] = 0;
        for (int h=0;h<=n;h++) {
            if (i-1>=0) v[1] = max(v[1],dp[i-1][h][0]-prx[i-1][h]);
            if (i-2>=0) v[2] = max(v[2],dp[i-2][h][0]);
            if (i-3>=0) v[7] = max(v[7],dp[i-3][h][1]+prx[i-2][h]);
            if (i-3>=0) v[8] = max(v[8],dp[i-3][h][0]+prx[i-2][h]);
            dp[i][h][0] = max({dp[i][h][0],v[1]+prx[i-1][h],v[2]+prx[i-1][h]});
        }
        for (int h=n;h>=0;h--) {
            if (i-1>=0) v[3] = max(v[3],dp[i-1][h][1]+prx[i][h]);
            if (i-2>=0) v[4] = max(v[4],dp[i-2][h][1]+prx[i-1][h]);
            if (i-1>=0) v[5] = max(v[5],dp[i-1][h][0]+prx[i][h]);
            if (i-2>=0) v[6] = max(v[6],dp[i-2][h][0]+prx[i-1][h]);
            dp[i][h][1] = max({dp[i][h][1],v[3]-prx[i][h],v[4],v[5]-prx[i][h],v[6]});
        }
        for (int h=0;h<=n;h++) {
            dp[i][h][0] = max({dp[i][h][0],v[7]+prx[i-1][h],v[8]+prx[i-1][h]});
        }
    }
    for (int i=1;i<=n;i++) for (int h=0;h<=n;h++) {
        ans = max(ans,dp[i][h][1]+(prx[i+1][h]));
        ans = max(ans,dp[i][h][0]+(prx[i+1][h]));
    }
    return ans;
}
```

### Full Solution

注意到还有一个限制没有用: $m<10^5$.

同时，子任务 7 也提示了我们，需要考虑每条鱼的位置。也就是柱子最好的选择一定是鱼的位置下面一格。因为在这种情况下，我们才在尽可能不“盖”住某条鱼的前提之下让它覆盖的范围尽可能大。

所以，把第二维换成鱼在列里的第几个即可。

枚举的时候需要考虑两个位置：当前的位置和现在的位置。

要注意到，前缀和可能和枚举的位置（列坐标）不对应，二分到正确的前缀和即可。

```cpp
#include"bits/stdc++.h"
#include"iostream"
#include"vector"
#include"cstring"
#include"fish.h"
#include"algorithm"
#define ll long long 
#define P pair<long long,long long>
using namespace std;

const int maxm = 3e5+5;
const int maxn = 3e5+5;
const ll inf = 1e18;
vector<P> dp[maxn];
vector<P> fish[maxn];
ll v[10], pter[10];
ll ans;
int n,m;

ll solve (int i, ll val) {
	if (i>n) return 0;
	if (i<=0) return 0;
    int pos = upper_bound(fish[i].begin(),fish[i].end(),make_pair(val,inf))-fish[i].begin()-1;
    if (pos<0) return 0;
    return fish[i][pos].second;
}

ll max_weights (int N, int M, vector<int> X, vector<int> Y, vector<int> W) {
    n = N; m = M;
    for (int i=0;i<m;i++) {
        fish[X[i]+1].push_back(make_pair(Y[i]+1,W[i]));
        dp[X[i]+1].push_back(make_pair(-inf,-inf));
    }
    for (int i=1;i<=n;i++) {
        fish[i].push_back(make_pair(n+1,0));
        fish[i].push_back(make_pair(0,0));
        dp[i].push_back(make_pair(-inf,-inf));
        dp[i].push_back(make_pair(-inf,-inf));
        sort(fish[i].begin(),fish[i].end());
    }
    for (int i=1;i<=n;i++) for (int j=1;j<fish[i].size();j++) {
        fish[i][j].second += fish[i][j-1].second;
    }
	fish[0].push_back(make_pair(0,0));
    dp[0].push_back(make_pair(0,-inf));
    for (int i=1;i<=n;i++) {
    	for (int j=0;j<=8;j++) pter[j] = v[j] = 0;
        for (int j=3;j<=6;j++) pter[j] = dp[i-2+j%2].size()-1;
        for (int h=0;h<dp[i].size();h++) {
            int pos = fish[i][h].first-1;
            if (pos<0) pos = 0;
            if (i-1>=0) while (pter[1]<dp[i-1].size() and fish[i-1][pter[1]].first-1<=pos) {
                v[1] = max(v[1],dp[i-1][pter[1]].first-solve(i-1,fish[i-1][pter[1]].first-1));
                pter[1]++;
            }

            if (i-2>=0) while (pter[2]<dp[i-2].size() and fish[i-2][pter[2]].first-1<=pos) {
                v[2] = max(v[2],dp[i-2][pter[2]].first-1);
                pter[2]++;
            }

            if (i-3>=0) while (pter[7]<dp[i-3].size() and fish[i-3][pter[7]].first-1<=pos) {
                v[7] = max(v[7],dp[i-3][pter[7]].second+solve(i-2,fish[i-3][pter[7]].first-1));
                pter[7]++;
            }

            if (i-3>=0) while (pter[8]<dp[i-3].size() and fish[i-3][pter[8]].first-1<=pos) {
                v[8] = max(v[8],dp[i-3][pter[8]].first+solve(i-2,fish[i-3][pter[8]].first-1));
                pter[8]++;
            }
            dp[i][h].first = max({dp[i][h].first,v[1]+solve(i-1,pos),v[2]+solve(i-1,pos)});
        }
        for (int h=dp[i].size()-1;h>=0;h--) {
            int pos = fish[i][h].first-1;
            if (i-1>=0) while (pter[3]>=0 and fish[i-1][pter[3]].first-1>=pos) {
                v[3] = max(v[3],dp[i-1][pter[3]].second+solve(i,fish[i-1][pter[3]].first-1));
                pter[3]--;
            }
            if (i-2>=0) while (pter[4]>=0 and fish[i-2][pter[4]].first-1>=pos) {
                v[4] = max(v[4],dp[i-2][pter[4]].second+solve(i-1,fish[i-2][pter[4]].first-1));
                pter[4]--;
            }
            if (i-1>=0) while (pter[5]>=0 and fish[i-1][pter[5]].first-1>=pos) {
                v[5] = max(v[5],dp[i-1][pter[5]].first+solve(i,fish[i-1][pter[5]].first-1));
                pter[5]--;
            }
            if (i-2>=0) while (pter[6]>=0 and fish[i-2][pter[6]].first-1>=pos) {
                v[6] = max(v[6],dp[i-2][pter[6]].first+solve(i-1,fish[i-2][pter[6]].first-1));
                pter[6]--;
            }
            dp[i][h].second = max({dp[i][h].second,v[3]-solve(i,pos),v[4],v[5]-solve(i,pos),v[6]});
        }
        for (int h=0;h<dp[i].size();h++) {
        	int pos = fish[i][h].first-1;
            if (pos<0) pos = 0;
            dp[i][h].first = max({dp[i][h].first,v[7]+solve(i-1,pos),v[8]+solve(i-1,pos)});
        }
    }
    for (int i=1;i<=n;i++) for (int h=0;h<dp[i].size();h++) {
        int pos = fish[i][h].first-1;
        if (pos<0) pos = 0;
        ans = max(ans,dp[i][h].second+solve(i+1,pos));
        ans = max(ans,dp[i][h].first+solve(i+1,pos));
    }
    return ans;
}
```
