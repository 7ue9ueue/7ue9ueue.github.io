**算法名字:** 2—SAT

**对应难度:** 省选+/USACO Platinum

**算法优势:** 

1. 图论基本算法之一

{注: 在2001年以出现此知识点}

{注: 在2010年左右的欧洲算法竞赛中, 此知识点出现及其频繁}

{注: 作者认为2-SAT可以理解为是并查集在维护布尔变量时的一种拓展, 本质上维护的将并查集的双向联通的要求改成了单向联通}

**解决问题** [2-SAT](https://www.luogu.com.cn/problem/P4782)

给 n 个 0/1 变量, $x_i \space \{i\in[1,n]\}$

有 $m$ 需要满足的条件, 形式为: 若 $x_i = a$, 则 $x_j = b$


**算法描述:** 

拆点对于 $x_i$, 拆成 $a_i$ 和 $a_i'$

其中 $a_i$ 表示 $x_i$ 为 1, $a_i'$ 表示 $x_i$ 为 0

我们需要在此图中选取 $n$ 的点, 来代表 $x_i$ 的取值

对于一个条件, 可以建立一条有向边 <u,v>, 即若 $u$ 选择, $v$ 必须也选择  

则对于每个 $\text{SCC}$, 强连通分量进行 $\text{tarjan}$ 缩点, 每个强联通分量要么同时选或者不选

若 $a_i$ 和 $a_i'$ 处于一个强连通分量, 则无解 

若要求输出答案, 可以发现图为 $\text{DAG}$, 拓扑排序输出一种可行的答案即可

但是可以发现 $\text{tarjan}$ 后的 $\text{SCC}$ 自然满足拓扑序的要求, 则有下面这种简洁的输出方式:

```cpp
for (int i=1;i<=n;i++) {
    cout<<(SCC[i]>SCC[i+n])<<" ";
}
cout<<endl;
````

**板子附上:**

```cpp
int main () {
    cin>>n>>m;
    for (int i=1;i<=m;i++) {
        int a,b,c,d;
        cin>>a>>b>>c>>d;
        edges[a+n*b].push_back(c+n*(d^1));
        edges[c+n*d].push_back(a+n*(b^1));
    }
    //Tarjan缩点
    for (int i=1;i<=n+n;i++) {
        if (!dfn[i]) tarjan(i);
    }
    //判断无解
    for (int i=1;i<=n;i++) {
        if (belong[i]==belong[i+n]) {
            cout<<"IMPOSSIBLE"<<endl;
            return 0;
        }
    }
    cout<<"POSSIBLE"<<endl;
    //输出答案
    for (int i=1;i<=n;i++) {
        cout<<(belong[i]>belong[i+n])<<" ";
    }
    cout<<endl;
}
```

**题目练习:**

[P4782 【模板】2-SAT 问题]
(https://www.luogu.com.cn/problem/P4782)

[P5782 [POI2001] 和平委员会]
(https://www.luogu.com.cn/problem/P5782)

[P6378 [PA2010] Riddle]
(https://www.luogu.com.cn/problem/P6378)

[P3513 [POI2011]KON-Conspiracy]
(https://www.luogu.com.cn/problem/P3513)
