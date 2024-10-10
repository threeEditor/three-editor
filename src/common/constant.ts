// Display Event
export enum DisplayEvents {
    TreeSelectNode = 'TreeSelectNode', // Display 面板 tree 选中对象
    SelectTreeNode = 'SelectTreeNode', // 添加场景对象的时候 触发 tree 节点更新
    SetTreeNodes = 'SetTreeNodes', // 触发 tree 节点的选中
}

// Scene SelectorEvents 
export enum SceneSelectorEvents {
    Select = 'Select',
    UnSelect = 'UnSelect'
}