## 关于output和devServer中的path和publicPath的总结：

  ### 1、output中的path：
    - 1) 指定输出到硬盘上的绝对路径。

  ### 2、output中的publicPath：
    - 1) 表示的时打包生成的index.html文件里面引用资源的前缀，打包时会自动添加。

  ### 3、devServer中的publicPath:
    - 1) 表示的是打包生成的静态文件所在的位置，如果devServer中的publicPath没有设置，则会认为是output中设置的
    publicPath的值，如果output中也没设置，则默认是 / 

  ### 4、devServer中的contentBase:
    - 1) 用于配置提供额外静态文件内容的目录


## 1、devServer中的contentBase和output中的path：
    - 1) devServer启动HTTP服务器时，默认读取的是output中的path路径，也就是以output中的path作为服务器的根目录。
    - 2) 如果devServer配置了contentBase，根目录还是不变，首先默认还是读取output中的path作为服务器的根目录，当在根目录中查找资源找不到时，会读取devServer中contentBase的路径，再去查找资源，如果找不到，404

    - 2、publicPath可以看作是devServer对生成目录 `dist` 设置的虚拟目录，devServer首先从devServer.publicPath中
         取值，如果它没有设置，就取 `output.publicPath`的值作为虚拟目录，如果再没有设置，就取默认值 `/`

    - output.publicPath不仅可以影响虚拟目录的取值，也影响利用`html-webpack-plugin`插件生成的index.html中引用的js/css/img等资源的引
      用路径。会自动在资源路径前面追加设置output.publicPath

    - 一般情况下要保证`devServer`中的`publicPath`与`output.publicPath`保持一致