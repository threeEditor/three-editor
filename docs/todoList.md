- `three.proton` 例子模块的引入
1. 使用参考：https://juejin.cn/post/7063282795174428679
    https://drawcall.github.io/three.proton/
    https://three-nebula.org/

- `Scene` 初始化的加载
1. `Storage` 获取本地数据
2.  [50%] `Cube Map` 背景天空的加载设置（完善组件 & 场景更新同步）


- `Edit` 编辑运行时
1. [30%] `Sprite outline` 效果完善
2. [20%] `SceneObject` 各种内置对象加载
    - `PrimitiveMesh`   : [`CUBE`, `SPHERE`, `PLANE`]
    - `PrimitiveLight`  : [`AMBIENT`, `POINT`, `DIRECTIONAL`]
    - `PrimitiveCamera` : [`PERSPECTIVE`, `ORTHOGRAPHIC`]
    - `Model`           : [`GLTF`]
    - [15%] `Material`        : [`PBRMaterial`, `Map`]
3. [30%] 在移动相机位置的同时，修改 `target` 的位置
4. 增加相机的 `target` & `up` 属性更新 & 拖拽更新
5. 在属性面板增加材质的属性设置
6. 完善 `Scene.Config` ，同步在 `ACE Editor` 中完整的展示
7. `ViewHelper` 视角辅助控制器的完善，运行时状态的切换、拖拽 & 点击同步场景相机
8. [25%] `ToolBar` 工具栏部分切换
    - `popover` 类型提示
    - `keyboard` 快捷键
    - `Icon` 图标替换优化
9. [25%] `Selector` 拾取对象功能类的完善
    - 单击选中 & 支持双击选中（双击选中的对象会让相机聚焦）
    - 物体的选中效果（绘制轮廓、使用新的方案代替 outline pass https://blog.csdn.net/arvin0/article/details/121613144）

- `Light`
1. [5%] 灯光的加载和设置
2. 阴影的设置

- `Runtime` 运行时
1. `GLTF` 动画在 `Edit` 编辑状态下默认不播放动画，在切换到 `Play` 状态下播放动画（编辑状态下也可以播放动画）
2. [10%] `SceneManager` 统一管理每个 `Entity` 的 `Script` (运行时脚本挂载)
3. [50%] 运行时加载 `OrbitControls` 相机控制器

- `Tree Node`
1. [Done] `Rename` 完善
2. [30%] 拖拽跨层级的实现、同时通知场景同步结构的更新
3. 可见性 `view` 的实现
4. 锁定、隐藏、删除等功能的实现
5. 新增右键功能菜单：新增节点

- `Layout` 布局
1. [20%] 各种面板支持可拖拽（新增拖拽的条组件）
2. 面板属性的持久化

- `Storage` 本地存储