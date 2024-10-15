// Display Event
export enum DisplayEvents {
    TreeSelectNode = 'TreeSelectNode', // Display 面板 tree 选中对象
    SelectTreeNode = 'SelectTreeNode', // 添加场景对象的时候 触发 tree 节点更新
    SetTreeNodes = 'SetTreeNodes', // 触发 tree 节点的选中
}

// Scene Events
// SelectorEvents 
export enum SceneSelectorEvents {
    Select = 'Select',
    UnSelect = 'UnSelect',
}

export enum SceneEvents {
    GizmoTransform = 'GizmoTransform', // Gizmo 触发 Transform 更新
    PropertyTransform = 'PropertyTransform', // Property 控制面板触发 Transform 更新
}

export enum ModelAniUpdate {
    UpdateAni = 'UpdateAni',
    UpdateAniSpeed = 'UpdateAniSpeed',
}

// SkyModeUpdate
export const SceneSkyModeUpdate = 'SceneSkyModeUpdate';