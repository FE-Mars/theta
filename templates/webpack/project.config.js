/**
 * $XXX$标识需要自行配置的属性
 * 
 * $GROUP$  项目所属组   会根据此构造对应publicPath  以及  tpl_config中的key
 * $PROXYTARGET$ 用于webpack-dev-server作代理
 * 
 */
module.exports = {
  projectName: '$NAME$',        //项目名称
  projectGroup: '$GROUP$',         //项目所属组    base crm  app paas等
  moduleSeparator: '-',         //用于指定生成tpl_config的key时所用的模块分隔符，   目前paas采用”-“ 其他项目好像是”_“
  devDirectory: 'dev',          //开发目录
  prodDirectory: 'build',       //生产目录
  proxyTarget: '$PROXYTARGET$',                 //代理目标   （本地开发alpha的域名）
  webpackConfig: {     //webpack的相关配置
    entry: {},
  
    externals: {  //不需要打包模块（外部依赖）
      vue: 'base-vue'
    }
  }
}