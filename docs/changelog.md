# 2024/09/12 12.09 @石灰 编辑器再次起航！

# 2024/09/24 10.27 @YILI ZHANG 基于React重构项目 

# 2024/09/28 @石灰
- refactor 抽离 `Selector` 模块
- fix 修复 `Selector` 选中模型子物体
- feat 抽离 `Loader` 模块
- feat 增加 `Sprite` 的加载 & 拾取计算
- feat 增加 `Sprite` 的 `outline` 实现（待优化）

# 2024/09/29 @石灰
- fix 修复 `Sprite` 透明时候的 `outline` 效果
- feat 新增 `Layout` 布局组件

# 2024/09/30 @石灰
- feat 新增 `Objects` 模块

# 2024/10/01 @石灰
- fix reload error
- feat 新增 `Selector` 的事件通知

# 2024/10/02 @石灰
- feat 完善属性面板展示选中对象的信息
- feat 增加 `gltf` 动画播放

# 2024/10/06 @YILI ZHANG
- feat `Grid`新增x轴、z轴颜色
- feat 增加`Grid`显示隐藏

# 2024/10/07 @石灰
- refactor 修改 `sprite` 的选中效果，修复选中准确性
- chore 优化 `sprite` 的选中效果（采用 outline renderpass）
- doc 展示面板的树形控件  

# 2024/10/08 @石灰
- feat add tree component

# 2024/10/09 @YILI ZHANG
- fix hot reload error 
- feat add simple Gizmo (Bug： transform物体之后，会失去选中项导致Gizmo 解绑物体。) 已解决

# 2024/10/09 @石灰
-feat display plane tree component add select 

# 2024/10/10 @YILI ZHANG
- feat update `GizmoManager` 物体拖拽移动后的逻辑进行补充，修复物体移动后，gizmo 解绑物体的问题
- Bug：Gizmo热更后，只触发dragged状态变成true，mouseup时，不会变成false的问题

# 2024/10/10 @石灰
- feat 增加场景对象选中关联 Display 面板的 tree 组件