工程化： 简化流程，提高开发效率

vue-cli:脚手架，辅助搭建开发环境

vue:UI框架

vue-cli:通过远端的官方模板根据配置的参数来生成新的开发环境

 1.命令行：基于文本来查看、处理、操作计算机上面的文件程序

 2.搭建vue项目的开发环境

​     (开发环境:webpack:打包css,编译：vue -> html\js, es9 -> es5,css  —工程化)

使用方法：

命令行工具： vue <command> [options]

​                      主命令 + （子命令）+（参数）

```
Options:
 -V, --version               output the version number
 -h, --help                 output usage information

Commands:
 create [options] <app-name>        create a new project powered by vue-cli-service
 
 add [options] <plugin> [pluginOptions]   install a plugin and invoke its generator in an already created project
 
 invoke [options] <plugin> [pluginOptions] invoke the generator of a plugin in an already created project
 
 inspect [options] [paths...]        inspect the webpack config in a project with vue-cli-service
```

vue-cli流程：

1.初始化：使用PATH环境里的全局vue变量

2.获取用户配置：交互的过程

3.解析配置信息：用户配置+默认配置=>真正的配置信息

4.生成项目文件：通过配置+模板（官方模板或者自己写的模板）

​	自己写模板必须包括下面两个：

​		1.template:模板文件

​		2.meta.js：

​			prompts：弹框信息

​			helpers：模板引擎的扩展

​           complete：钩子函数

​			metalsmith：站点生成器

5.清理工作



做脚手架需要几个工具：

1.commander.js：node.js命令行接口的解决方案

2.inquirer.js：弹框交互的工具

3.chalk：美化命令行样式

4.ora:加载状态，进度条等动画

5.execa:直接执行脚本命令



脚手架目录结构：

docs:文档

scripts:脚本

packages:lerna(管理多个项目打出来的包，可以单独发布并引用每个包)

lib:核心代码逻辑

test:测试

bin:

package.json:

​	bin:专门用来放置用户自定义命令的地方

​	npm link :命令的软链接，链接到全局或某一个空间下

   全局命令可以直接执行，因为添加到全局的环境变量里了（PATH）<-usr/local/lib/node_modules

npm run xx命令:运行命令，npm run的时候npm 把该命令添加到PATH中，运行完后删除 



做一个命令的步骤：

package.json->bin

在bin目录下写一个可执行文件

npm link



vue(主命令)  init/list(子命令)

list：拉取接口，可用模板展示

init:

​	1.初始化usage

​    2.help初始化

​    3.根据属性初始化配置

​    4.如果是本地，直接调用generate;如果非本地，调用download，再调用generate

​    5.generate







Metalsmith：从一个地方把文件生成到另一个地方

  use():集成插件，在生成的过程中可以做的事情

​       askQuestions:询问用户，可以做的事情

​       filterFiles:根据配置数据，忽略一些文件的传递

​		renderTemplateFiles： 



handlebars：一个模板引擎,对语法做扩展

consolidate: 模板引擎渲染器