# 项目脚手架
> 代号：theta(θ)  
> 作者：jwong

theta是基于命令行的脚手架，用于创建基于Vue + Webpack的pc项目，可使用主站的现有模块  

# 安装
```bash
npm install -g theta
```

# 帮助
安装完毕后，打开命令终端，输入：
```bash
theta -h
```
即可看到所有theta命令。

# 用法
```bash
// default template demo  repository-url： https://github.com/FE-Mars/theta-template
theta init <project-name>

//use your github template
theta init <project-name> <repository-url>
```

# 在theta-tempalte创建新的模板
想要新建新的template时，只需要在[theat-template](http://git.firstshare.cn/fe-tools/theta-template)中新建一个空分支即可，分支名称即为template名称

## 怎么使用新模板
```bash
theta init demo -t new_tempalte
```