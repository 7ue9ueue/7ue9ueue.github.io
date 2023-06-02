# [USACO] 全组别题解

```
题解作者: 
BronzeT1: tiger2005 	BronzeT2: Delta Coding 	BronzeT3: tiger2005 
SilverT1: tiger2005 	SilverT2: tiger2005 		SilverT3: tiger2005
GoldT1: tiger2005 		GoldT2: tiger2005 			GoldT3: tiger2005
PlatinumT1: KarL05		PlatinumT2: KarL05 			PlatinumT3: KarL05

非常感谢 tiger2005 提供的题解!
```





## Bronze T1



### 题意简述

有一个序列 $a$，你可以将不超过 $L$ 个位置上的数字加上 $1$，求出最大的 $h$，使得有至少 $h$ 个 $a_i \geq h$。

### 分析

对于这种答案对分析的限制非常严重的题目，考虑二分答案。我们在 $\operatorname{check}(mid)$ 函数中，记录下大于等于 $mid$ 的数字个数和等于 $mid-1$ 的数字个数，分别为 $x$ 和 $y$。我们可以将后者中最多 $L$ 个加一使得它符合 $a_i \geq mid$。所以判断条件就是 $x+\min(y,L) \geq mid$。

```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
#include <cmath>

using namespace std;
int N,L;
int C[100010];
bool check(int m){
    int x=0,y=0;
    for(int i=1;i<=N;i++)
        if(C[i]>=m) ++x;
        else if(C[i]==m-1)  ++y;
    return x+min(y,L)>=m;
}
int main(){
    scanf("%d%d",&N,&L);
    for(int i=1;i<=N;i++)   scanf("%d",&C[i]);
    int l=0,r=N+1,m;
    while(l<r-1){
        m=(l+r)>>1;
        if(check(m))    l=m;
        else    r=m;
    }
    printf("%d",l);
    return 0;
}
```


## Bronze T2

创建一个n*n大小的二维数组，根据K本出版物计算出两两之间的大小关系，再根据传递性计算出所有(i, j)之间的大小关系，最后根据大小关系输出结果即可。

```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
#include <cmath>
#include <map>
#include <iostream>
#include <vector>

using namespace std;
map<string,int> mp;
int K,N;
char str[110][110];
int main(){
    cin.tie(0);
    cin >> K >> N;
    for(int i=1;i<=N;i++)
        for(int j=1;j<=N;j++)
            str[i][j]=(i==j?'B':'?');
    string re;
    for(int i=1;i<=N;i++){
        cin >> re;
        mp[re]=i;
    }
    vector<string> vec;
    vector<string> idl;
    for(int i=1;i<=K;i++){
        vec.clear();idl.clear();
        for(int j=1;j<=N;j++){
            cin >> re;
            if(!idl.empty() && re<idl.back()){
                for(int k=0;k<(int)idl.size();k++)
                    vec.push_back(idl[k]);
                idl.clear();
            }
            for(int k=0;k<(int)vec.size();k++){
                str[mp[vec[k]]][mp[re]]='0',
                str[mp[re]][mp[vec[k]]]='1';
            }
            idl.push_back(re);
        }
    }
    for(int i=1;i<=N;i++)
        printf("%s\n",str[i]+1);
    return 0;
}
```



## Bronze T3

建议读懂题目后再阅读下面的内容。

首先我们知道，在 `2*2` 的方格中的两个奶牛可以有两种选择方式，但是在 `1*3` 方格旁边中的两个奶牛选择方式只有一个。又因为每一个草块只能选择一次，所以先选择 `1*3` 类型的奶牛位置可以避免重复计算的麻烦。在计算完之后，田字格中对角线的两个奶牛如果还有草可以选，那么这个田字格可以保证有几个地方没有奶牛（用 `X` 表示，因为存在的话就会在一开始就被用掉）：

```
.X.

XGC

.C.
```



所以可以放心的选择草块，因为从两个可能的地方任选一个使用掉不可能会影响到其他 `2*2` 方格中牛的选择。

```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
#include <cmath>

using namespace std;
int N,M;
char A[1010][1010];
int S[1010],L[1010];
int main(){
    scanf("%d%d",&N,&M);
    for(int i=1;i<=N;i++)
        scanf(" %s",A[i]+1);
    int ans=0;
    for(int i=1;i<=N;i++)
        for(int j=1;j<=M-2;j++)
            if(A[i][j]=='C' && A[i][j+2]=='C' && A[i][j+1]=='G')
                ++ans,A[i][j+1]='.';
    for(int i=1;i<=N-2;i++)
        for(int j=1;j<=M;j++)
            if(A[i][j]=='C' && A[i+2][j]=='C' && A[i+1][j]=='G')
                ++ans,A[i+1][j]='.';
    for(int i=1;i<=N;i++)
        for(int j=1;j<=M;j++)
            if((A[i][j]=='C' && A[i+1][j+1]=='C')
            || (A[i][j+1]=='C' && A[i+1][j]=='C')){
                bool hav=false;
                hav|=(A[i][j]=='G');
                hav|=(A[i][j+1]=='G');
                hav|=(A[i+1][j]=='G');
                hav|=(A[i+1][j+1]=='G');
                if(!hav)    continue;
                if(A[i][j]=='G')    A[i][j]='.';
                else if(A[i][j+1]=='G') A[i][j+1]='.';
                else if(A[i+1][j]=='G') A[i+1][j]='.';
                else    A[i+1][j+1]='.';
                ++ans;
            }
    printf("%d",ans);
    return 0;
}
```

## Silver T1

建议读懂题目后再阅读下面的内容。

首先我们发现，可以使用一个 $3^9$ 大小的数字储存下一个井字棋状态。由于 $3^9 \leq 2*10^5$，所以我们可以考虑 $O(3^9N^2)$ 的方法。

考虑进行深度优先搜索。使用 `bool hav[N][N][3**9]` 记录下这个状态是否出现过（位置和井字棋的状态），防止重复搜索。如果没有被搜索过，首先判断这个位置上要不要填入棋子，需要的话改变状态。然后判断这个状态是否胜利，是的话记录并且退出。最后想四个方向进行搜索即可。

对于可行状态，可以直接转换成 `3*3` 的数组，然后暴力判断。建议先预处理出所有状态的可行性。

```cpp
#pragma GCC optimize(2)
#include <cstdio>
#include <cstring>
#include <algorithm>
#include <cmath>
#include <string>

using namespace std;
int N;
char Maz[30][100];
int pw[10];
int fang[4][2]={{0,1},{0,-1},{1,0},{-1,0}};
bool dp[30][30][20010];
bool pd[20010];
bool isP[20010];
char mp[5][5];
inline bool isWin(int k){
    for(int i=1;i<=3;i++)
        for(int j=1;j<=3;j++){
            mp[i][j]=k%3;
            if(mp[i][j]==0) mp[i][j]='.';
            else if(mp[i][j]==1)    mp[i][j]='M';
            else    mp[i][j]='O';
            k/=3;
        }
    string p="";
    for(int i=1;i<=3;i++){
        for(int j=1;j<=3;j++)
            p+=mp[i][j];
        if(p=="MOO" || p=="OOM")    return true;
        p="";
    }
    for(int i=1;i<=3;i++){
        for(int j=1;j<=3;j++)
            p+=mp[j][i];
        if(p=="MOO" || p=="OOM")    return true;
        p="";
    }
    for(int i=1;i<=3;i++)
        p+=mp[i][i];
    if(p=="MOO" || p=="OOM")    return true;
    p="";
    for(int i=1;i<=3;i++)
        p+=mp[i][4-i];
    if(p=="MOO" || p=="OOM")    return true;
    return false;
}
int Draw(int k,char q,int x,int y){
    x=3*x+y;
    int u=(k/pw[x])%3;
    if(u!=0)    return k;
    return k+(q=='M'?1:2)*pw[x];
}
int ans;
void dfs(int x,int y,int k){
    if(Maz[x][3*y+1]=='M' || Maz[x][3*y+1]=='O')
        k=Draw(k,Maz[x][3*y+1],Maz[x][3*y+2]-'1',Maz[x][3*y+3]-'1');
    if(dp[x][y][k]) return;
    dp[x][y][k]=true;
    if(isP[k]){
        ans+=!pd[k];
        pd[k]=true;
        return;
    }
    for(int i=0,xx,yy;i<4;i++){
        xx=x+fang[i][0],yy=y+fang[i][1];
        if(Maz[xx][3*yy+1]!='\0' && Maz[xx][3*yy+1]!='#')
            dfs(xx,yy,k);
    }
}
int main() {
    pw[0]=1;
    for(int i=1;i<=9;i++)   pw[i]=pw[i-1]*3;
    scanf("%d",&N);
    for(int i=1;i<=N;i++)
        scanf(" %s",Maz[i]+1);
    for(int i=0;i<pw[9];i++)    isP[i]=isWin(i);
    for(int i=1;i<=N;i++)
        for(int j=1;j<=N;j++)
            if(Maz[i][3*j+1]=='B')
                dfs(i,j,0);
    printf("%d",ans);
    return 0;
}
```

## Silver T2

### 题意简述

给定一些数字 $x_i$，求出有多少组 $(A,B,C)$，使得 $1 \leq A \leq B \leq C$，并且 $\forall i,x_i \in \{A,B,C,A+B,B+C,A+C,A+B+C\}$。

其中保证 $x_i$ 互不相同且个数在 4 到 7 中间。

### 分析

这道题实际上并没有什么好解决的方法。我们假设上面的 7 种和是 7 个桶，而我们需要做的就是往里面放入几个数字使其对应，然后暴力求出解。我们很容易发现者 7 个数的大小关系只有两个（从小到大）：

$$A,B,C,A+B,B+C,A+C,A+B+C\ or\ A,B,A+B,C,B+C,A+C,A+B+C$$

那么我们只需要将 $x_i$ 按大小顺序填进去，然后计算的时候把第三个和第四个交换一下再算一次就行。

关于计算的方法：我们发现会有四种情况：

$A,B,C$ 中三个确定了：直接进行校验就行。

$A,B,C$ 中两个确定了：通过剩下的 5 个位置中，除了两个确定的位置之和外还有四个位置，并且里面一定有一个确定的数字。直接利用那个数字解出剩下的数字校验。

$A,B,C$ 中一个确定了：发现 $A+B,B+C,A+C$ 中有两个确定，可以直接计算出剩下两个数字并且校验。

$A,B,C$ 中没有确定的：可以知道 $A+B,B+C,A+C,A+B+C$ 确定，可以接解出 $A,B,C$，最后校验就行。

```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
#include <cmath>
#include <set>

using namespace std;
int T,N,A[10];
int B[10],C[4];
int ans;
set<pair<int,pair<int,int> > > st;
inline bool checkD(int a,int b){
    return a==0 || a==b;
}
inline bool checkIf(){
    return C[1]>0 && C[2]>=C[1] && C[3]>=C[2]
    && checkD(B[1],C[1]) && checkD(B[2],C[2]) && checkD(B[3],C[3])
    && checkD(B[4],C[1]+C[2]) && checkD(B[5],C[1]+C[3]) && checkD(B[6],C[3]+C[2])
    && checkD(B[7],C[1]+C[2]+C[3])
    && !st.count(make_pair(C[1],make_pair(C[2],C[3])));
}
inline void Overall(){
    C[1]=C[2]=C[3]=0;
    if(B[1] && B[2]){
        C[1]=B[1];C[2]=B[2];
        if(B[3])    C[3]=B[3];
        else if(B[5])   C[3]=B[5]-C[1];
        else if(B[6])   C[3]=B[6]-C[2];
        else C[3]=B[7]-C[1]-C[2];
        if(checkIf())   ++ans,st.insert(make_pair(C[1],make_pair(C[2],C[3])));
        return;
    }
    if(B[1] && B[3]){
        C[1]=B[1];C[3]=B[3];
        if(B[2])    C[2]=B[2];
        else if(B[4])   C[2]=B[4]-C[1];
        else if(B[6])   C[2]=B[6]-C[3];
        else C[2]=B[7]-C[1]-C[3];
        if(checkIf())   ++ans,st.insert(make_pair(C[1],make_pair(C[2],C[3])));
        return;
    }
    if(B[2] && B[3]){
        C[2]=B[2];C[3]=B[3];
        if(B[1])    C[1]=B[1];
        else if(B[4])   C[1]=B[4]-C[2];
        else if(B[5])   C[1]=B[5]-C[3];
        else C[1]=B[7]-C[2]-C[3];
        if(checkIf())   ++ans,st.insert(make_pair(C[1],make_pair(C[2],C[3])));
        return;
    }
    if(B[1]){
        C[1]=B[1];
        if(B[4])    C[2]=B[4]-C[1];
        if(B[5])    C[3]=B[5]-C[1];
        if(B[6]){
            if(C[2])    C[3]=B[6]-C[2];
            else    C[2]=B[6]-C[3];
        }
        if(checkIf())   ++ans,st.insert(make_pair(C[1],make_pair(C[2],C[3])));
        return;
    }
    if(B[2]){
        C[2]=B[2];
        if(B[4])    C[1]=B[4]-C[2];
        if(B[6])    C[3]=B[6]-C[2];
        if(B[5]){
            if(C[1])    C[3]=B[5]-C[1];
            else    C[1]=B[5]-C[3];
        }
        if(checkIf())   ++ans,st.insert(make_pair(C[1],make_pair(C[2],C[3])));
        return;
    }
    if(B[3]){
        C[3]=B[3];
        if(B[5])    C[1]=B[5]-C[3];
        if(B[6])    C[2]=B[6]-C[3];
        if(B[4]){
            if(C[1])    C[2]=B[4]-C[1];
            else    C[1]=B[4]-C[2];
        }
        if(checkIf())   ++ans,st.insert(make_pair(C[1],make_pair(C[2],C[3])));
        return;
    }
    int p=1ll*(B[4]+B[5]+B[6])/2;
    C[1]=p-B[6];
    C[2]=p-B[5];
    C[3]=p-B[4];
    if(checkIf())   ++ans,st.insert(make_pair(C[1],make_pair(C[2],C[3])));
}
void dfs(int x,int k){
    if(x==8 && k!=N+1)  return;
    if(k==N+1){
        Overall();
        swap(B[3],B[4]);
        Overall();
        swap(B[3],B[4]);
        return;
    }
    dfs(x+1,k);
    B[x]=A[k];
    dfs(x+1,k+1);
    B[x]=0;
}
int main(){
    scanf("%d",&T);
    while(T--){
        scanf("%d",&N);
        for(int i=1;i<=N;i++)
            scanf("%d",&A[i]);
        sort(A+1,A+N+1);
        dfs(1,1);
        printf("%d\n",ans);
        ans=0;st.clear();
    }
    return 0;
}
```

## Silver T3

### 题意简述

有一个序列 $a$，你可以操作 $K$ 次，每次将不超过 $L$ 个位置上的数字加上 $1$，求出最大的 $h$，使得有至少 $h$ 个 $a_i \geq h$。

### 分析

这一题是铜组 T1 的加强版。我们还是使用二分的方法，但是这一次我们将 $[mid-K,mid-1]$ 范围中的数字取出，问题转换为可以在这些数字中总共加上 $K*L$，求出最多的到达 $mid$ 的数字数量。此时直接从小到大加即可。

关于正确性：我们并不可以保证这样加是正确的，下面提供一种证法。将 $K$ 次的选择排成 $K*L$ 的表格，然后从左到右从上到下填入选择的数字：



```
---L---
| 1 2
| 1 |
K 2 v
| 2
| 2
```


由于一个数字被填进去的次数不超过 $K$ 次，所以没有两个数字出现在同一行内，证明完毕。

关于方法：可以使用 `map` 记录差距，每次取出差距为 $i$ 的有 $j$ 个后，直接进行判断即可（具体来讲就是判断 $curr$ 和 $i*j$ 的大小，详见代码）。由于最劣方案就是 `1,2,3,...`，但是总数不超过 $\sqrt K$，所以速度是相当可观的。

```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
#include <cmath>
#include <map>

using namespace std;
int N,K,L;
int C[100010];
map<int,int> mp;
bool check(int m){
    int x=0,y=0;
    for(int i=1;i<=N;i++)
        if(C[i]>=m) ++x;
        else if(C[i]>=m-K)  mp[m-C[i]]++;
    long long cnt=1ll*K*L;
    for(map<int,int>::iterator it=mp.begin();it!=mp.end();it++){
        if(cnt<=1ll*(it->first)*(it->second)){
            y+=cnt/(it->first);
            break;
        }
        cnt-=1ll*(it->first)*(it->second);
        y+=(it->second);
    }
    mp.clear();
    return x+y>=m;
}
int main(){
    scanf("%d%d%d",&N,&K,&L);
    for(int i=1;i<=N;i++)   scanf("%d",&C[i]);
    int l=0,r=N+1,m;
    while(l<r-1){
        m=(l+r)>>1;
        if(check(m))    l=m;
        else    r=m;
    }
    printf("%d",l);
    return 0;
}
```

## Gold T1

### 题意简述

给定一个序列 $a_i$，求出区间个数 $[l,r]\ (l < r)$，使得 $a_l$ 不等于其他的数字，$a_r$ 不等于其他的数字。

### 分析

根据第一个限制，我们求出在 $i$ 后面第一个和 $a_i$ 一样的位置 $\operatorname{nxt}[i]$，同理定义 $\operatorname{prv}[i]$。那么对于每一个左端点，右端点的取值范围就在 $(l,\operatorname{nxt}[l])$ 中间。

考虑到对于一个右端点 $r$ 的限制就是 $\operatorname{prv}[r] \leq l$，那么我们只需要求出在这个范围中满足这个条件的数字个数就行。

解决方法有很多。你可以将 $(i,\operatorname{prv}[i])$ 作为一个点进行二维数点，使用 CDQ 分治或者树状数组解决，也可以直接用可持久化线段树维护 $\operatorname{prv}$ 数组直接求出答案。

```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
#include <cmath>

using namespace std;
int tr[4000010];
int c[4000010][2],nn;
int ad(int o,int l,int r,int p){
    int ret=++nn;
    c[ret][0]=c[o][0];
    c[ret][1]=c[o][1];
    tr[ret]=tr[o]+1;
    if(l==r)    return ret;
    int m=(l+r)>>1;
    if(p<=m)    c[ret][0]=ad(c[o][0],l,m,p);
    else    c[ret][1]=ad(c[o][1],m+1,r,p);
    return ret;
}
int que(int o1,int o2,int l,int r,int ll,int rr){
    if(ll<=l && r<=rr)  return tr[o2]-tr[o1];
    int m=(l+r)>>1;
    int ret=0;
    if(ll<=m)   ret+=que(c[o1][0],c[o2][0],l,m,ll,rr);
    if(rr>m)    ret+=que(c[o1][1],c[o2][1],m+1,r,ll,rr);
    return ret;
}
int N,A[200010],B[200010];
int prv[200010],nxt[200010],rt[200010];
int main(){
    scanf("%d",&N);
    for(int i=1;i<=N;i++)   scanf("%d",&A[i]);
    for(int i=1;i<=N;i++)   B[i]=0;
    for(int i=1;i<=N;i++){
        if(B[A[i]]==0)  prv[i]=1;
        else    prv[i]=B[A[i]];
        B[A[i]]=i;
    }
    for(int i=1;i<=N;i++)   B[i]=0;
    for(int i=N;i;i--){
        if(B[A[i]]==0)  nxt[i]=N+1;
        else    nxt[i]=B[A[i]];
        B[A[i]]=i;
    }
    for(int i=1;i<=N;i++)
        rt[i]=ad(rt[i-1],1,N,prv[i]);
    long long ans=0;
    for(int i=1;i<=N;i++)
        ans+=que(rt[i],rt[nxt[i]-1],1,N,1,i);
    printf("%lld",ans);
    return 0;
}
```

## Gold T2

请认真都清楚题面后继续往下看。这道题的题面比较难以进行抽象化，所以只能读题面了 qwq

我们考虑到一个状态就是位置加上传送门，但是考虑到对于连接 $u$ 和 $v$ 的传送门 $i$，状态 $(u,i)$ 和 $(v,i)$ 可以互相到达，所以只需要记录传送门作为状态就行，也就是把传送门当作点。

根据题目要求，我们把每一个点第一个传送门和第二个传送门连起来，第三个和第四个连起来。不难发现在 $2N$ 个传送门中连接了 $2N$ 条边，并且一个传送门在两个端点分别连接了一次，度数一定是 $2$。很显然，最后构成的图形就是一些环的集合。

我们考虑修改一个点的传送门顺序，实际上就是把这个图中两条边断开，然后交换起始点拼起来。在两个环上进行考虑，就是把两个环拆成两条线，然后接在一起成为新的环。这实际上将两个连通块连在了一起。

想到了什么？对，我们可以使用最小生成树解决这个问题。我们按照花费从小到大考虑每一个点，如果四个传送门全部连在了一起，那么跳过，否则将它们直接连结在一起。由于前两个和后两个一定在同一个连通块中，这么做就是把两个连通块合并，最后使用并查集维护一下就行了。

具体实现请参考 Kruskal 算法。

```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
#include <cmath>
#include <vector>

using namespace std;
int N;
int C[100010],A[100010][4];
int fa[200010];
int getF(int x){
    return x==fa[x]?x:fa[x]=getF(fa[x]);
}
inline void merg(int x,int y){
    x=getF(x);y=getF(y);
    fa[x]=y;
}
vector<pair<int,int> > vec;
int main(){
    scanf("%d",&N);
    for(int i=1;i<=2*N;i++)
        fa[i]=i;
    for(int i=1;i<=N;i++){
        scanf("%d%d%d%d%d",&C[i],&A[i][0],&A[i][1],&A[i][2],&A[i][3]);
        merg(A[i][0],A[i][1]),merg(A[i][2],A[i][3]);
    }
    for(int i=1;i<=N;i++)
        vec.push_back(make_pair(C[i],i));
    sort(vec.begin(),vec.end());
    int ans=0;
    for(int i=0,p,x,y;i<N;i++){
        p=vec[i].second;
        x=getF(A[p][0]),y=getF(A[p][2]);
        if(x!=y)    fa[x]=y,ans+=vec[i].first;
    }
    printf("%d",ans);
    return 0;
}
```

## Gold T3

### 题意简述

给定 $N$ 个点，确定排列 $p$ 数量，满足将前三个点连在一起后，在之后的点中，向在排列中在它前面的点连边，有且只有三个不会和之前的线段相交，随后只保留这三条边。数据保证三点不共线。

### 分析

这道题的限制实际上只会有两种情况。我们考虑第四个点加入的情况：

第一种是第四个点在一开始的三角形内侧，此时这个点会向三个点连边，并且将三角形分成更小的三角形。在之后的点中，但凡有一个点在大三角形中间，就会落在一个小三角形内，然后分成三个更小的三角形，以此类推。

第二种是在三角形的外侧。此时这个点一定会满足一个性质：和三角形中两个点组成一个更大的三角形，其中包含了原三角形中的一个点。此时可以理解成大三角形被分割成三个小三角形，之后的情况同上。

我们发现，无论怎么样，最后的轮廓一定是一个三角形，里面被大大小小的三角形填满。考虑记录下外围三角形三个点的位置。

记录 $\operatorname{dp}[i][j][k][l]$ 表示以 $i,j,k$ 三个点作为外围，已经计算了 $l$ 个点的排列数量。考虑转移。一种转移指内部转移。预处理出 $i,j,k$ 围着的三角形包含的点数量，就相当于在去除了 $l$ 个后任意取一个。一种是向外扩张。枚举三角形内部的一个点，并且假设之前是这个点和另外两个点围出了三角形，但是被剩下的点扩大了，这个时候直接把答案加上小三角形对应的答案即可。

具体的 $\operatorname{dp}$ 方程式不妨自己试着推一下。

注意：将 $i,j,k$ 按照有序的方式进行储存，可以将常数压缩到 $\dfrac 1 6$。如果你的代码超时了可以试着更换方式。

```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
#include <cmath>

using namespace std;
struct Point{
    double x,y;
    void init(){
        scanf("%lf%lf",&x,&y);
    }
    Point(double x=0.0,double y=0.0):x(x),y(y){}
    Point operator - (const Point p){
        return Point(x-p.x,y-p.y);
    }
    double operator * (const Point p){
        return fabs(x*p.y-y*p.x);
    }
}A[45];
inline double getArea(int i,int j,int k){
    return (A[i]-A[j])*(A[j]-A[k]);
}
inline bool inTriangle(int i,int j,int k,int x){
    return fabs(getArea(i,j,x)+getArea(j,k,x)+getArea(i,k,x)-getArea(i,j,k))<=1e-6;
}
inline void sort3(int& a,int& b,int& c){
    if(a>=b)    swap(a,b);
    if(a>=c)    swap(a,c);
    if(b>=c)    swap(b,c);
}
int N;
int hav[45][45][45];
long long dp[45][45][45][45];
const long long Md = 1e9 + 7;
int main(){
    scanf("%d",&N);
    for(int i=1;i<=N;i++)   A[i].init();
    for(int i=1;i<=N;i++)
        for(int j=i+1;j<=N;j++)
            for(int k=j+1;k<=N;k++)
                for(int l=1;l<=N;l++)
                    if(l!=i && l!=j && l!=k)
                        hav[i][j][k]+=inTriangle(i,j,k,l);
    for(int i=1;i<=N;i++)
        for(int j=i+1;j<=N;j++)
            for(int k=j+1;k<=N;k++)
                dp[3][i][j][k]=6;
    for(int s=4;s<=N;s++)
        for(int i=1;i<=N;i++)
            for(int j=i+1;j<=N;j++)
                for(int k=j+1;k<=N;k++){
                    if(hav[i][j][k]+4>=s)
                        dp[s][i][j][k]=(dp[s-1][i][j][k]*(hav[i][j][k]+4-s))%Md;
                    for(int l=1;l<=N;l++)
                        if(l!=i && l!=j && l!=k && inTriangle(i,j,k,l)){
                            int x,y,z;
                            // i j l
                            x=i,y=j,z=l;
                            sort3(x,y,z);
                            (dp[s][i][j][k]+=dp[s-1][x][y][z])%=Md;
                            // j k l
                            x=j,y=k,z=l;
                            sort3(x,y,z);
                            (dp[s][i][j][k]+=dp[s-1][x][y][z])%=Md;
                            // i k l
                            x=i,y=k,z=l;
                            sort3(x,y,z);
                            (dp[s][i][j][k]+=dp[s-1][x][y][z])%=Md;
                        }
                }
    long long ans=0;
    for(int i=1;i<=N;i++)
        for(int j=i+1;j<=N;j++)
            for(int k=j+1;k<=N;k++)
                (ans+=dp[N][i][j][k])%=Md;
    printf("%lld",ans);
    return 0;
}
```

## Platinum T1

使得右端点往右边移动, 每次分别统计答案。

则右端点已经被固定住, 可以考虑每个左端点会有多少个答案, 即每个点到右端点的仅出现过一次的数的数量。

这个可以通过线段树维护, 维护区间加(前驱的前驱和前驱-1, 前驱到当前端点+1), 单点永久清空(因为如果左边有两个一样的数字, 那么偏左的那一个是不能被选择的, 永远就无法被选择了, 所以这个位置需要被清空)。

询问时做区间和, 询问端点到前驱在线段树上的和即可。

$O(n\log n)$

```cpp
#include<iostream>
#define int long long
#define lson p+p
#define rson p+p+1
using namespace std;

const int maxn = 2e5+5;
struct Node {
	int l;
	int r;
	int zero;
	int tag;
	int sum;
};
Node t[maxn*4+5];

void pushdown(int p) {
	if (!t[p].tag) return;
	int tag = t[p].tag;
	t[p].tag = 0;
	t[lson].sum += (t[lson].r-t[lson].l+1-t[lson].zero)*tag;
	t[rson].sum += (t[rson].r-t[rson].l+1-t[rson].zero)*tag;
	t[lson].tag += tag;
	t[rson].tag += tag;
}

void pushup(int p) {
	t[p].sum = t[lson].sum+t[rson].sum;
	t[p].zero = t[lson].zero+t[rson].zero;
}

void build(int p, int l, int r) {
	t[p].l = l;
	t[p].r = r;
	if (l==r) {
		return;
	}
	int mid = (l+r)>>1;
	build(lson,l,mid);
	build(rson,mid+1,r);
}

int query(int p, int l, int r) {
	if (l<=t[p].l&&t[p].r<=r) {
		cout<<t[p].l<<" "<<t[p].r<<" ";
		cout<<t[p].sum<<endl;
		return t[p].sum;
	}
	pushdown(p);
	int mid = (t[p].l+t[p].r)>>1;
	int ans = 0;
	if (l<=mid) ans += query(lson,l,r);
	if (mid<r) ans += query(rson,l,r);
	pushup(p);
	return ans;
}

void add(int p, int l, int r, int v) {
	if (l<=t[p].l&&t[p].r<=r) {
		t[p].sum += (t[p].r-t[p].l-t[p].zero+1)*v;
		t[p].tag += v;
		return;
	}
	pushdown(p);
	int mid = (t[p].l+t[p].r)>>1;
	if (l<=mid) add(lson,l,r,v);
	if (mid<r) add(rson,l,r,v);
	pushup(p);
}

void zero(int p, int pos) {
	if (t[p].l==t[p].r) {
		t[p].sum = 0;
		t[p].zero = true;
		return;
	}
	pushdown(p);
	int mid = (t[p].l+t[p].r)>>1;
	if (pos<=mid) zero(lson,pos);
	else zero(rson,pos);
	pushup(p);
}

int a[maxn];
int pre[maxn];
int tmp[maxn];
int ans = 0;

signed main() {
	int n;cin>>n;
	for (int i=1;i<=n;i++) cin>>a[i];
	build(1,1,n);
	for (int i=1;i<=n;i++) {
		pre[i] = tmp[a[i]];
		tmp[a[i]] = i;
	}

	cout<<ans<<endl;
	for (int i=2;i<n;i++) {
		int l = pre[i]+1;
		int r = i-1;
		if (l<=r) add(1,l,r,1);
		l = pre[pre[i]]+1;
		r = pre[i]-1;
		if (l<=r) add(1,l,r,-1);
		if (pre[i]) zero(1,pre[i]);
		cout<<"query: "<<i+1<<endl;
		if (pre[i+1]!=i) ans += query(1,pre[i+1]+1,i-1);
	}
	// for (int i=1;i<n;i++) cout<<query(1,i,i)<<endl;
	cout<<"ans = ";
	cout<<ans<<endl;
}
```
## Platinum T2

**本题存在通解 (无视k≤2的限制, 同时可以有任意多的重边的做法) :**

如果建立超级汇点, 然后建立超级源点, 使得这两个点重合, 可以发现答案可以被转化为欧拉回路的数量。每一条S到R的路径可以经过汇点, 然后回到源点。本质不同的欧拉回路数就是答案。

这个可以使用 Matrix-Tree 定理配合 BEST 算法解决。

BEST 算法为: 
$$
\text{number of euler loops} = t(G) \prod_{v\in G} (\deg(v)-1)!
$$


G为原图的 Laplace 矩阵, t(G)为这张图的内向树的数量 (可以使用Matrix-Tree定理计算)。

$O(n^3)$

```cpp
#include<iostream>
#define int long long
using namespace std;

const int maxn = 105;
const int MOD = 1e9+7;
 
int graph[maxn][maxn];
int deg[maxn];
int fac[maxn];
 
int det(int n) {
	int f = 1;
	int res = 1;
	for (int i=1;i<=n;i++) {
		for(int j=1;j<=n;j++) {
			graph[i][j] += MOD;
			graph[i][j] %= MOD;
		}
	}
	for (int i=1;i<=n;i++) {
		for(int j=i+1;j<=n;j++) {
			int x = graph[i][i];
			int y = graph[j][i];
			while (y) {
				int tmp = x/y;
				x %= y;
				swap(x,y);
				for (int k=i;k<=n;k++) {
					graph[i][k] = (graph[i][k]-tmp*graph[j][k])%MOD;
					graph[i][k] += MOD;
					graph[i][k] %= MOD;
				}
				for (int k=i;k<=n;k++) swap(graph[i][k],graph[j][k]);
				f *= -1;
			}
		}
		if (!graph[i][i]) return 0;
		res *= graph[i][i];
		res %= MOD;
	} 
	if (f==-1) res = MOD-res;
	res %= MOD;
	res += MOD;
	return res;
}
 
signed main() {
	fac[0] = 1;
	for(int i=1;i<maxn;i++) {
		fac[i] = fac[i-1]*i;
		fac[i] %= MOD;	
	}
	int T;cin>>T;
	while(T-->0) {
		memset(graph,0,sizeof(graph));
		memset(deg,0,sizeof(deg));
		int ans = 1;
		int n;cin>>n;
		int k;cin>>k;
		string s;cin>>s;
		s = "#"+s;
		for (int i=1;i<=n;i++) for (int j=1;j<=n;j++) {
			char v;cin>>v;
			if (v=='1') {
				graph[i][i]++;
				graph[i][j]--;
				deg[i]++;
			}
		}
		for (int i=1;i<=n;i++) {
			if (s[i]=='S') {
				graph[n+1][n+1]++;
				graph[n+1][i]--;
				deg[n+1]++;
			}
		}
		for (int i=1;i<=n;i++) {
			if (s[i]=='R') {
				graph[i][i]++;
				graph[i][n+1]--;
				deg[i]++;
			}
		}
		for (int i=1;i<=n;i++) {
			if (!graph[i][i]) {
				graph[i][i]++;
				graph[i][n+1]--;
				deg[i]++;
				graph[n+1][n+1]++;
				graph[n+1][i]--;
				deg[n+1]++;
			}
		}
		/*
		This is called the "BEST"(literally, the abriv of the inventors) algorithm, 
		it is implemented based on the Matrix-Tree algorithm.
		This can solve the problem in any K hahahahhahahaa 
		*/
		for(int i=1;i<=n;i++) {
			ans *= fac[deg[i]-1];
			ans %= MOD;
		}
		ans *= det(n);
		ans %= MOD;
		cout<<ans<<endl;
	}
	return 0;
}

```

## Platinum T3

逐行考虑答案, 发现每一行的选择都是连续的, 令每一行选择的是[L[i],R[i]], 可以发现L和R是凸函数, 存在单调性。 

利用动态规划维护单调性即可, 朴素的实现是 O(n^4^), 可以使用二维前缀和做到 O(n^3^)。

令 $dp[i][l][r][st1][st2]$ 为考虑到第 i 行, 目前选择区间 [l,r], st1表示左边的递增是否还存在, st2 表示表示右边的递增是否还存在。

如果[l,r] 这一段不能取, continue掉即可。

可以得到转移方程为: 

$$
dp[i][l][r][0][0] = 
$$

$$
\sum dp[i-1][l'][r'][0][0] (l ≤ l' \text{ and } r' ≤ r)
$$

$$
dp[i][l][r][0][1] = 
$$

$$
\sum dp[i-1][l'][r'][0][1] (l ≤ l' \text{ and } r ≤ r')
$$

$$
\sum dp[i-1][l'][r'][0][0] (l ≤ l' \text{ and } r < r')
$$

$$dp[i][l][r][1][0] = $$

$$
\sum dp[i-1][l'][r'][1][0] (l' ≤ l \text{ and } r' ≤ r)
$$

$$
\sum dp[i-1][l'][r'][0][0] (l'< l \text{ and } r' ≤ r)
$$


$$
dp[i][l][r][1][1] = 
$$

$$
\sum dp[i-1][l'][r'][0][0] (l' < l \text{ and } r < r')
$$

$$
\sum dp[i-1][l'][r'][1][0] (l' ≤ l \text{ and } r < r')
$$

$$
\sum dp[i-1][l'][r'][0][1] (l' < l \text{ and } r ≤ r')
$$

$$
\sum dp[i-1][l'][r'][1][1] (l' ≤ l \text{ and } r ≤ r')
$$

如果做二维前缀和使得 

$$
s[i][l][r][st1][st2] = \sum_{x=1}^l\sum_{x=1}^r dp[i][l][r][st1][st2]
$$


那么转移就是 O(1), 的, 一共有 O(n^3) 个状态, 那么时间复杂度就是 O(n^3)

$O(n^3)$

```cpp
#include<iostream>
#define int long long
using namespace std;

const int maxn = 155;
const int MOD = 1e9+7;

int dp[maxn][maxn][maxn][2][2];
int f[maxn][maxn][maxn];
int prx[maxn];
int a[maxn][maxn];
int s[2][2][maxn][maxn];
int ans = 0;

int sum(int id1, int id2, int l1, int r1, int l2, int r2) {
	int temp = s[id1][id2][l2][r2]+s[id1][id2][l1-1][r1-1]-s[id1][id2][l1-1][r2]-s[id1][id2][l2][r1-1];
	temp += MOD;
	temp %= MOD;
	return temp;
}
signed main() {
	int n;cin>>n;
	for (int i=1;i<=n;i++) for (int j=1;j<=n;j++) {
		char c;cin>>c;
		if (c=='G') a[i][j] = 1;
	}
	for (int i=1;i<=n;i++) {
		for (int j=1;j<=n;j++) prx[j] = prx[j-1]+a[i][j];
		for (int l=1;l<=n;l++) {
			for (int r=l;r<=n;r++) {
				if (prx[r]-prx[l-1]==r-l+1) f[i][l][r] = 1;
			}
		}
	}
	for (int i=1;i<=n;i++) {
		for (int l=1;l<=n;l++) {
			for (int r=l;r<=n;r++) {
				if (f[i][l][r]) {
					dp[i][l][r][0][0] = 1;	
				}
			}
		}
	}
	for (int i=2;i<=n;i++) {
		memset(s,0,sizeof(s));
		for (int l=1;l<=n+1;l++) {
			for (int r=1;r<=n+1;r++) {
				s[0][0][l][r] = s[0][0][l][r-1]+s[0][0][l-1][r]-s[0][0][l-1][r-1];
				s[0][0][l][r] += dp[i-1][l][r][0][0];
				s[0][0][l][r] += MOD;
				s[0][0][l][r] %= MOD;
				
				s[1][0][l][r] = s[1][0][l][r-1]+s[1][0][l-1][r]-s[1][0][l-1][r-1];
				s[1][0][l][r] += dp[i-1][l][r][1][0];
				s[1][0][l][r] += MOD;
				s[1][0][l][r] %= MOD;
				
				s[0][1][l][r] = s[0][1][l][r-1]+s[0][1][l-1][r]-s[0][1][l-1][r-1];
				s[0][1][l][r] += dp[i-1][l][r][0][1];
				s[0][1][l][r] += MOD;
				s[0][1][l][r] %= MOD;
				
				s[1][1][l][r] = s[1][1][l][r-1]+s[1][1][l-1][r]-s[1][1][l-1][r-1];
				s[1][1][l][r] += dp[i-1][l][r][1][1];
				s[1][1][l][r] += MOD;
				s[1][1][l][r] %= MOD;
			}
		}
		for (int l=1;l<=n;l++) {
			for (int r=l;r<=n;r++) {
				if (!f[i][l][r]) continue;
				dp[i][l][r][0][0] += sum(0,0,l,1,n+1,r);
				dp[i][l][r][0][0] %= MOD;
				
				dp[i][l][r][0][1] += sum(0,1,l,r,r,n+1);
				dp[i][l][r][0][1] += sum(0,0,l,r+1,r,n+1);
				dp[i][l][r][0][1] %= MOD;
				
				dp[i][l][r][1][0] += sum(1,0,1,l,l,r);
				if (l!=1) dp[i][l][r][1][0] += sum(0,0,1,l,l-1,r);
				dp[i][l][r][1][0] %= MOD;
				
				if (l!=1) dp[i][l][r][1][1] += sum(0,0,1,r+1,l-1,n+1);
				if (l!=1) dp[i][l][r][1][1] += sum(0,1,1,r,l-1,n+1);
				dp[i][l][r][1][1] += sum(1,0,1,r+1,l,n+1);
				dp[i][l][r][1][1] += sum(1,1,1,r,l,n+1);
				dp[i][l][r][1][1] %= MOD;
			}
		}
	}
	for (int i=1;i<=n;i++) {
		for (int l=1;l<=n;l++) {
			for (int r=l;r<=n;r++) {
				ans += dp[i][l][r][0][0];
				ans += dp[i][l][r][0][1];
				ans += dp[i][l][r][1][0];
				ans += dp[i][l][r][1][1];
				ans %= MOD;
			}
		}
	}
	cout<<ans<<endl;
}
```