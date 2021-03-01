## hash
  · Hash是整个项目的hash值，其根据每次编译内容计算得到，每次项目中任一模块发生改变，编译之后都会生成新的hash，即修改任何
    文件都会导致`所有文件`的hash值发生改变，也就是一个项目中的所有chunk和文件公用一个项目hash。

## chunkhash
  · 如果我们采用hash计算的话，每一次构建后生成的hash值都不一样，即使文件的内容压根没改变。这样子是没办法实现缓存效果，我们
    需要换另一种hash值计算方式，即chunkhash
  · chunkhash和hash不一样，他根据不同的入口文件(Entry)进行依赖文件解析，构建对应的chunk，生成对应的hash值，我们再生产环境里
    把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用chunkhash的方式生成hash值，那么只要我们不改动公共库的代码，
    就可以保证其hash值不受影响。

## contenthash
 · 使用chunkhash存在一个问题，就是当在一个JS文件中引入CSS文件，编译后他们的hash值是相同的，而且只要JS文件发生改变，关联的css
   文件hash值也会改变，这个时候可以使用`mini-css-extract-plugin`里的contenthash值，保证即使css文件所处的模块里就算其他文件内
   容改变，只要css文件内容不变，那么不会重复构建

## hash值在模块内容不变的情况下不会发生改变

## 实战推荐
  - 如果内容变化非常快，建议使用`hash`，因为hash计算生成最快，单入口应用就用`hash`
  - 如果是多入口，建议使用`chunkhash`
  - 如果需要长期缓存，而且确实变化不大，就是用`contenthash`