**写在前面:** 我记得曾经@ETK问过我一个矩阵形式的图的生成树有没有数学的表达方式, 我说是Matrix Tree, 但我只知道有个$O(n^3)$ 的做法, 现在仔细想了想其实是个矩阵行列式, 还是很神奇的

**算法名字:** Matrix Tree

**对应难度:** 省选+/USACO Platinum+

**算法优势:** 

1. 建立了生成树和数学的表达关系

2. 非常暴力, 可以在很多巧妙的题目当中像推土机一样直接对其进行降维打击

3. 非常优雅, elegance!

4. 非常好记, 求 $\text{Laplace}$ 矩阵的行列式!

5. 曾经的省选的知识点!

**算法劣势:**

1. 非常容易写炸, 即逆元, 行列式的处理不好就完蛋



**算法描述:** 


度数矩阵

$D[i][j] = 0$

$D[i][i] = i\space\text{的度数}$

邻接矩阵

$A[i][j] = \text{边权} \space i \to j$

Laplace 矩阵 = 度数矩阵 - 邻接矩阵, 记为 $L = D-A$

$\text{det}(L,x)$, 即图的Laplace矩阵的行列式, 去掉 $x$ 行和 $x$ 列, 为图的生成树个数

存在拓展, 若图为带权图, 则 $\text{det}(L,x)$ 为所有生成树边权之积, 证明留作习题

在有向图当中, 对于外向生成树和内向生成树, 类似定义入度矩阵和出度矩阵 $D$ 即可, 此时, 被去掉的 $x$ 行和 $x$ 列为生成树的根

最后, 存在 $\text{BEST}$ 定理, 可以统计欧拉回路, 即

$$\text{det}(L,x)\prod_{v \in E}(\text{deg}(v)-1)!$$

值得注意的是 $$\text{det}(L,x)=\text{det}(L,y)$$

在欧拉图当中成立

**如果你喜欢这个算法, 下面是扩展阅读资料:**

https://oi-wiki.org/graph/matrix-tree/

https://www.luogu.com.cn/blog/command-block/ju-zhen-shu-ding-li-xing-lie-shi-post

**如果你想练习, 下面是一些练习题:**

[洛谷] P6178 【模板】Matrix-Tree 定理

[洛谷] P3317 [SDOI2014]重建

[洛谷] P4455 [CQOI2018]社交网络

[洛谷] P4336 [SHOI2016]黑暗前的幻想乡

[USACO] Platinum 2021 US Open Routing Schemes

**行列式模版:(完全不保证正确, 已知至少存在一个问题)** 

```cpp
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
```

**彩蛋:** 

![](https://files.mdnice.com/user/13035/4d26e066-bf29-4b55-a4ad-d54625971379.png)

