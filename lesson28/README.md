# 1、loader

  · 所谓的loader知识一个导出为函数的JavaScript模块，它接收上一个loader产生的结果或者资源文件(resource file)
    作为参数，也可以用多个loader函数组成loader chain
  · compiler需要得到最后一个loader产生的处理结果，这个处理结果应该是String或者Buffer(被转换为一个String)

  ## 1.1 loader-runner
  
    · loader-runner是一个执行loader链条的模块

    ### 1.2.1 loader的类型
      · loader的叠加顺序 = post(后置) + inline(内联) + normal(正常) + pre(前置)

    ### 1.2.2 特殊配置
      · loaders/#configuration[https://webpack.js.org/concepts/loaders/]

      > -!   noPreAutoLoaders      不要前置和普通loader
        !   noAutoLoaders         不要普通loader
        !!   noPrePostAutoLoaders  不要前后置和普通loader，只要内联loader

    ### 1.2.3 pitch
      · 比如a!b!c!modules，正常调用顺序应该是a/b/c，但是真正调用顺序是a(pitch)/b(pitch)/c(pitch)/c/b/a，
        如果其中任何一个pitching loader返回了值就相当于在它以及它右边的loader已经执行完毕。

      · 比如如果b返回了字符串"result b"，接下来只有a会被系统执行，且a的loader收到的参数是result b

      · loader根据返回值可以分为两种，一种是返回js代码(一个module的代码，含有类似于module.export语句)的loader,
        还有不能作为最左边loader的其他loader

      · 有时候我们想把两个第一种loader chain起来，比如style-loader!css-loader! 问题是 css-loader的返回值是一串
        js代码，如果按正常方式写style-loader的参数就是一串代码字符串
        
      · 为了解决这种问题，我们需要在style-loader里执行require(css-loader!resource)

    
  ## 问题
    - inline/normal的区别？
      答：loader本身是没差别的，差别在于执行的顺序，放的位置不一样，执行的顺序不一样，loader
          本身是一样的
    
    - 实际项目中，不同的loader在node_module里怎么找？
      答：找法和找node普通模块基本是一样的

    - webpack的配置里不会有inline loader？
      答：inline-loader是指我们在自己代码里写的行内loader let request = `inline-loader1!inline-loader2!${filePath}`;

    - 平时用loader不写enforce的，都是Normal吗？
      答：是的

    - !  !! -!这几个符号和inline loader什么关系？
      答：没关系，inline是配置在请求的时候，一种loader
          这几个符号决定如何组建loader
    
    - pitch是所有loader都要提供的方法吗？
      答：不是的，一般不提供

    - 在引入index.js的时候添加了行内loader符号，是不是只针对index.js?
      答：是的