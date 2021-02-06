## sourcemap的使用：

- 1、sourcemap：是为了解决开发代码与实际运行代码不一致时帮助我们`debugger`到原始开发代码的技术。
- 2、webpack通过配置可以自动给我们`source map`文件，map文件是一种对应编译文件和源
- 文件的方法。

### 五个关键字的含义：
- eval：使用eval包裹模块代码。
- source-map：产生map文件。

- cheap：不包含列信息，也不包括loader的sourcemap
- 1、不包含列信息的意思是，完整的sourcemap映射，会精确的映射到对应的行和列，而
- cheap只映射到对应的行，不会精确到列。
- 2、不包括loader的sourcemap是指，webpack会先将高阶语法通过对应的loader转换成
- 低阶语法，这时候，sourcemap会映射到转换后的代码上，而不是最原始的文件。
- module：包含loader的sourcemap(比如jsx to js，babel的sourcemap)，否则无法定义
- 源文件。
- inline：将map作为DataUrl嵌入，不单独生成map文件。

### devtool的几种选项：
- source-map：原始代码，最好的sourcemap质量有完整的结果，但是会很慢。
- eval-source-map：原始代码，同样的道理，最高的sourcemap质量和最低的性能。
- cheap-module-eval-source-map：原始代码（只有行内），同样道理，但是更高的质量和更低的性能。
- cheap-eavl-source-map：转换代码（行内）每个模块被eval执行，并且sourcemap作为eval的一个dataurl。
- eval：生成代码，每个模块都被eval执行，并且存在@sourceURL，带eval的构建模式，能cache SourceMap。
- cheap-source-map：转换代码（行内）生成的sourcemap没有列映射，从loaders生成的sourcemap没有被使用。
- cheap-module-source-map：原始代码（只有行内），与上面一样除了每行特点的从loader中进行映射。

## 最佳实践
- 开发环境：我们在开发环境对sourcemap的要求是：快(eval)，全(module)，且由于此时代码未压缩，我们并不
- 那么在意列信息(cheap)，所以开发环境比较推荐的配置：`devtool:cheap-module-eval-source-map`
- 生产环境：一般情况下，我们并不希望任何人都可以在浏览器直接看到我们未编译的源码，所以我们不应该直接
- 提供sourcemap给浏览器，但是我们又需要sourcemap来定位我们的错误信息，这时我们可以设置`hidden-source-map`
- 一方面webpack会生成sourcemap文件以提供给错误收集工具，比如sentry，另一方面又不会为bundle添加引用注释，以
- 避免浏览器使用。
- SourceMapDevToolPlugin()，当我们设置`hidden-source-map`时，借助这个插件调试代码