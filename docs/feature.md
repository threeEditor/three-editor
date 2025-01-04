## TODO LIST

### UI 部分
1. Layout 布局
- Assets 资源面板
- Properties 属性面板
- Display 节点面板
2. ToolBar 工具条

### Broswer Component
- FileInput 文件导入（JSON）
- FileDownload 文件下载（JSON）
- Code Editor（Script 脚本编辑）
- Cursor 鼠标光标           zhangyili

### Editor 编辑器部分

1. 场景搭建
- Data 数据结构设计（根据数据结构加载对应内容）
- Cache 场景内容存储 对象存储
- Loader 资源加载器
- Exporter 导出器（json）
- Skybox 天空盒

2. 编辑器组件
- Gizmo 拖拽组件（translate、scale、rotate）
- Grid 世界网格                             zhangyili
    补充坐标线（X 轴 红色 和 Z 轴 蓝色）
- Selector 拾取系统（单选、多选、框选）        yiqianyao
- Outline 选中高亮                          yiqianyao
- Camera 相机系统（透视、投影）
- World cursor世界游标
- Stats 性能检测

3. 渲染系统
- 后处理系统

4. 本地文件系统 OPFS
- 将一些编辑文件做本地存储 Chrome
- 浏览器插件 https://chromewebstore.google.com/detail/opfs-explorer/acndjpgkpaclldomagafnognkcgjignd?pli=1

### Player 运行时
- 内置的运行时功能
1. 可以在如相机、Entity 上挂载内置的功能，如相机跟随、相机控制器、角色控制器等，在切换到运行时自动打开

- 从编辑状态切换到运行时的时候，执行运行时的脚本
1. 读取存储在项目中的默认 ScriptComponent 脚本 or 用户自定义的，存储在 OPFS 的脚本
2. 执行挂载，将 Entity 的 ScriptComponent 挂载到 SceneManager（或者单独的控制器） 进行统一管理（参考 ECS）

- 从运行时切换回编辑状态，关闭运行时功能并卸载 ScriptComponent 脚本

### 部署发布