1、使用git获取开源代码。项目地址：https://github.com/TryGhost/Ghost；



2、安装配置项目
   npm install --python=python2.7
   npm install -g grunt
   npm install -g knex-migrator
   npm install
   git submodule update --init
   cd core/client
   npm install
   bower install
3、grunt init   此命令需要git环境运行
4、grunt dev
5、knex-migrator init



安装过程出现问题：
1、Error: Can't find Python executable "python", you can set the PYTHON env variable.
    解决： npm install --python=python2.7
2、Warning: Command failed: C:\WINDOWS\system32\cmd.exe /s /c "bower install"
    解决：npm install -g bower
3、run build
    解决：npm install -g build
4、knex-migrator(安装数据库)



扩展部分说明：

一、服务端修改
1、数据库模型  D:\document\git\ghostplus\core\server\data\schema\schema.js
2、模型接口添加  D:\document\git\ghostplus\core\server\models\comment.js
3、数据筛选添加函数  D:\document\git\ghostplus\core\server\models\plugins\filter.js
3、模型base/index.js添加findWhere函数  D:\document\git\ghostplus\core\server\models\base\index.js
4、增加api接口   D:\document\git\ghostplus\core\server\api\comments.js
5、api/posts.js添加unAuthBrowse函数   D:\document\git\ghostplus\core\server\api\posts.js
6、增加扩展app文件   D:\document\git\ghostplus\core\server\api\exapp.js
6、api/index.js增加comment   D:\document\git\ghostplus\core\server\api\index.js
6、model/index.js增加comment   D:\document\git\ghostplus\core\server\models\index.js
7、修改全局app文件   D:\document\git\ghostplus\core\server\app.js
8、增加extend文件夹   D:\document\git\ghostplus\core\server\extend
9、配置静态文件路径znextendAssets/extendViews   D:\document\git\ghostplus\core\server\config\overrides.json
10、静态文件helper/asset设置   D:\document\git\ghostplus\core\server\helpers\asset.js
11、静态文件地址设置    D:\document\git\ghostplus\core\server\data\meta\asset_url.js

二、扩展用户端功能
1、添加extend文件夹

三、前端blog修改
1、前端js文件   D:\document\git\ghostplus\content\themes\casper\assets\js\extend.js
2、前端css文件    D:\document\git\ghostplus\content\themes\casper\assets\css\zn.js
2、修改前端页面post.hbs/navigation.hbs添加iframe  
3、修改前端页面增加css、js  D:\document\git\ghostplus\content\themes\casper\default.hbs
5、修改screen.css/body样式  body { margin: 0;padding-top: 56px; }    D:\document\git\ghostplus\content\themes\casper\assets\css\screen.css

四、自动化作业修改
1、文件迁移    D:\document\git\ghostplus\gruntfile.js