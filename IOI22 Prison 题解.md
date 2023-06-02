# IOI 2021 D1T2 Prisons 题解

题目链接: https://ioi2022.id/tasks/

通过人数：8/357

题目难度：CF2600?

---

首先，能使用的数字很少，因此需要尽量每次传递一点信息。

尽然要传递信息，就最好选择交替询问A，B。

### 56pts (m=26)

观察到一个数字写成 2 进制形式是唯一的。因此，不妨在 2 进制形式下一位一位的作比较。传递一个 `(bit,0/1)` 的值，来让下一个囚犯知道另一个袋子中数字的 2 进制下的 bit 位是 0 还是 1. 递归即可。由于 $2^{12} = 4096$ 得到需要 26 个位置。

### 70pts (m=24)

为什么一定要 2 进制呢？观察到三进制的情况下 $3^7 = 2187$， 也就是意味着三进制情况下只需要 $8 \times 3$ 种值就可以完成传递信息。

### 90pts (m=21) 

为什么一定要拆成进制呢？可以不可以二分或者三分答案呢？固然是可以的。有没有什么本质区别？有的。三分的时候，可以注意到在段落中会有一个 +1/-1 的微调。而如果我们单纯的选择使用进制的话，这个+1/-1的优势就被浪费掉了。例如如果看到袋子里的数是 $1$. 固然直接就会选择当前的袋子（因为另外一个必然会更大）, $n$ 同理。

那么这种情况下 $m$ 怎么计算呢？可以发现，最大迭代次数满足：

$$
f(x) = \lceil \frac{x-2}{3} \rceil 
$$

若干次后 $f(x) = 1$, 最坏情况需要迭代 $7$ 次，然后剩一个 $2$，特殊处理就可以。所以是 $3 \times 7 + 1 = 22$. 为什么 $m=21$ 这里就不得而知了。可能大小是 $2$ 可以直接处理掉。

### 100pts （m=20)

为什么一定要三分呢？为什么不二分呢？如果二分的话，迭代的形式大概是：

$$
f(x) = \lceil \frac{x-2}{2} \rceil 
$$

虽然函数下降的速度变慢了，但是二分情况下只需要 0/1 就可以表达。注意到如果三分，变化形式是：
```
5000 -3-> 1666 -3-> 555 -3-> 185 -3-> 61 -3-> 20 -3-> 6 -3-> 2
```

最后几个如果改成二分，会变成
```
5000 -3-> 1666 -3-> 555 -3-> 185 -3-> 61 -3-> 20 -3-> 6 -2-> 2
```

那这个时候需要的数字数量就变成了 $3\times6 + 2 = 20$, 刚考卡住。

```cpp
#include"bits/stdc++.h"
#include"vector"
#include"prison.h"
using namespace std;

vector< vector<int> > ans;

void calculate (int pid, int rep, int c, int loth, int roth, int l, int r) {
    int cid = rep+rep+rep+c;
    for (int i=l;i<=r;i++) ans[pid][i] = cid; 
    for (int i=loth;i<=l;i++) ans[cid][i] = -1-ans[cid][0];
    for (int i=r;i<=roth;i++) ans[cid][i] = -2+ans[cid][0];
    if (l+1>r-1) return;
    if (l+1+2>r-1) {
        calculate(cid,rep+1,1,l,r,l+1,r-1);
        return;
    }
    if (l+1+4>r-1) {
        calculate(cid,rep+1,1,l,r,l+1,(l+r)/2);
        calculate(cid,rep+1,2,l,r,(l+r)/2+1,r-1);
        return;
    }
    int m1 = (l+l+r+1+1-1)/3;
    int m2 = (l+r+r+1-1-1)/3;
    calculate(cid,rep+1,1,l,r,l+1,m1);
    calculate(cid,rep+1,2,l,r,m1+1,m2);
    calculate(cid,rep+1,3,l,r,m2+1,r-1);
}
 
void initialize (int len, int n) {
    for (int i=0;i<=len;i++) ans.push_back(vector<int>(n+1,0));
    for (int i=0;i<=len;i++) {
        if ((i+2)%6<3) ans[i][0] = 1;
    }
}
vector< vector<int> > devise_strategy(int n) {
    initialize(20,n);
    calculate(0,-1,3,1,n,1,n);
    return ans;
}
```
