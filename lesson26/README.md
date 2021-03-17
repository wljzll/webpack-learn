## tapable.js
  · tapable是一个类似于Node.js中的EvnetEmitter的库，但更专注于自定义事件的触发和处理
  · webpack通过tapable将实现与流程解耦，所有具体实现通过插件的形式存在

## Webpack编译流程
  1、初始化参数：从配置文件和Shell语句中读取并合并参数，得出最终的配置对象
  2、用上一步得到的参数初始化Compiler对象
  3、加载所有配置的插件
  4、执行对象的run方法开始执行编译
  5、根据配置中的`entry`找出入口文件
  6、从入口文件出发，调用所有配置的`loader`对模块进行编译
  7、再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过本步骤的处理
  8、根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk
  9、再把每个Chunk转换成一个单独的文件加入到输出列表
  10、在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

  > 在以上的过程中，webpack会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事
  件后会执行特定的逻辑，并且插件可以调用Webpack提供的API改变Webpack的运行结果

  ### 插件有顺序吗？
    使用同一个插件，是有顺序的
    使用非同一个插件，是无序的
    挂载的顺序只能决定 webpack先执行那个插件的apply方法
    而触发apply方法中注册的钩子，则是webpack制定的钩子的执行顺序



## 问题
  
  - webpack内部也是使用babel去生成、遍历语法树的吗？
    答：webpack内部是使用acorn

  - parse函数的第二个参数 sourceType: 'module'是什么意思？
    答：表示源代码是一个模块，除了模块类型还有脚本类型 script

  - path.posix的posix是干啥的？
    答：为了全部统一成 unix 格式的分割符 => \; 如果不加的话可能是 /，也可能是 \，五花八门

  - moduleId和chunkId
    答：模块的绝对路径相对于根目录的路径就是moduleId
    例如：根目录：E:\2021架构\wepacklearn\lesson26\
          绝对路径：E:\2021架构\wepacklearn\lesson26\src\index.js
    所以，moduleId就是 ./scr/index.js

    chunkId：代码块id，一般是代码分割产生的，比如：import('./title.js')
    代码块的名字：./src/title.js
    chunkId就是将 . 去掉， /替换成_  => src_title_js