# 25/01/12 @石灰
- feat 增加 `Tree` 组件的跨层级移动
- feat 优化重命名面板样式
- fix 修复重命名功能的过滤问题

# 25/01/09 @阿肋
- feat 增加简单的`viewHelper`

# 25/01/09 @石灰
- fix 修复 `ace editor viewer` 的同步更新
- feat 部分完善编辑场景下 `Camera target` 的同步更新

# 25/01/08 @石灰
- feat 支持 `Runtime` 运行时挂载 `OrbitControls` 相机控制器

# 25/01/07 @石灰
- feat 增加场景对 `SceneObject.MESH` 类型的加载（对应 `Material` 的设置）
- fix 修复 `Scene Sky` 背景的切换

# 25/01/04 @石灰
- feat 增加 `Camera` 的 `target` & `up` 属性更新
- feat 测试运行时挂载脚本的能力

# 25/01/03 @石灰
- feat 完善 `SceneTypeSwitch` 的场景设置和相机设置

# 25/01/02 @石灰
- feat 完善 `SceneTypeSwitch` 的场景设置和相机设置

# 2024/12/31 @石灰
- feat 增加 `Camera` 的可视化 `Sprite` 精灵

# 2024/12/29 @石灰
- feat 完善 `Camera` 类型的加载和 `CameraHelper` 的设置

# 2024/12/28 @石灰
- feat 增加场景切换组件 `SceneSwitch` & 部分样式更新
- feat 调整 `Grid` 中 x 轴 和 z 轴的宽度 调整网格效果
- feat 增加 `CameraHelper`
- fix 修复 `Gizmo` 频繁更新导致的错误

# 2024/11/3 @阿肋
- feat 增加resources类，后续用于存储资源以及处理progress相关逻辑

# 2024/10/27 @石灰
- feat 支持 `Tree Component` 动态修改名字 & 属性面板同步

# 2024/10/17 @石灰
- feat 补充 `light` 的 `info`
- feat 设置 `SceneManager` 导出 `info`

# 2024/10/16 @阿肋
- fix 修复`Toolbar` key 报错
- feat 优化`Gizmo`更新`outline`的逻辑

# 2024/10/16 @石灰
- feat 初步添加 ace edit 用来显示 json，后续用来作为导出数据的预览

# 2024/10/15 @YILI ZHANG
- fix 修复 `Gizmo`中emit时未使用 `SceneEvents`，导致`Property`属性未更新的问题  
- feat update `GiamoManger` 同步变换`Sprite` 的outline元素
- feat 新增`Toolbar`工具栏，添加了`Transform``Rotate``Scale`切换按钮

# 2024/10/15 @石灰
- feat `Property` 面板支持展示 `Transform` 属性更新

# 2024/10/14 @石灰
- feat `Property` 面板支持展示 `GLTF` 动画 & 支持动画切换 & 动画速度调整

# 2024/10/13 @石灰
- fix 修复 `Gizmo` 更新 `Property` 面板数据
- feat 优化 `Property` 面板并新增不同对象的展示内容

# 2024/10/12 @YILI ZHANG
- feat update `GizmoManager` 添加切换`Controls.space`的逻辑,移动、缩放操作可以在世界坐标和局部坐标中进行切换
- feat updae `GiazmoManager` `layout.tsx` 添加更新属性面板的逻辑
- todo `Gizmo`热区优化

# 2024/10/11 @石灰
- feat 增加场景中的 PrimitiveLight 类型对象，支持选中
- fix 修复 Display Panel Tree Component 的更新错误处理

# 2024/10/10 @石灰
- feat 增加场景对象选中关联 Display 面板的 tree 组件
- feat 增加场景 sky 背景的设置

# 2024/10/10 @YILI ZHANG
- feat update `GizmoManager` 物体拖拽移动后的逻辑进行补充，修复物体移动后，gizmo 解绑物体的问题
- Bug：Gizmo热更后，只触发dragged状态变成true，mouseup 时，不会变成false的问题

# 2024/10/09 @石灰
-feat display plane tree component add select 

# 2024/10/09 @YILI ZHANG
- fix hot reload error 
- feat add simple Gizmo (Bug： transform物体之后，会失去选中项导致Gizmo 解绑物体。) 已解决

# 2024/10/08 @石灰
- feat add tree component

# 2024/10/07 @石灰
- refactor 修改 `sprite` 的选中效果，修复选中准确性
- chore 优化 `sprite` 的选中效果（采用 outline renderpass）
- doc 展示面板的树形控件 

# 2024/10/06 @YILI ZHANG
- feat `Grid`新增x轴、z轴颜色
- feat 增加`Grid`显示隐藏

# 2024/10/02 @石灰
- feat 完善属性面板展示选中对象的信息
- feat 增加 `gltf` 动画播放

# 2024/10/01 @石灰
- fix reload error
- feat 新增 `Selector` 的事件通知

# 2024/09/30 @石灰
- feat 新增 `Objects` 模块

# 2024/09/29 @石灰
- fix 修复 `Sprite` 透明时候的 `outline` 效果
- feat 新增 `Layout` 布局组件

# 2024/09/28 @石灰
- refactor 抽离 `Selector` 模块
- fix 修复 `Selector` 选中模型子物体
- feat 抽离 `Loader` 模块
- feat 增加 `Sprite` 的加载 & 拾取计算
- feat 增加 `Sprite` 的 `outline` 实现（待优化）

# 2024/09/24 10.27 @YILI ZHANG 基于React重构项目 

# 2024/09/12 12.09 @石灰 编辑器再次起航！
