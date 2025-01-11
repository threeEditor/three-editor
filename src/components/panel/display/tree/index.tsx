import React, { Key, useEffect, useState } from "react"
import { DisplayEvents, TreeEvents } from "@/common/constant";
import { EventSystem } from "@/utils/event/EventSystem";
import { ConfigProvider, Tree, TreeDataNode, TreeProps } from "antd";
import { titleRender } from "../treeMenu";
import { IconCube } from "@/common/resource";
import { Icon } from "@/components/icon";

export interface ITreeProps {
    treeData: TreeDataNode[];
    setGData: (data: any) => void;
    handleTreeMenuClick(e: any): void;
}

export const TreeComponent = (props: ITreeProps) => {
    const { treeData } = props;
    const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
    useEffect(() => {
        // 触发 tree 节点的选中 keys => uuid[]
        EventSystem.subscribe(DisplayEvents.SelectTreeNode, (keys: string[]) => {
            setSelectedKeys(keys);
        }) 
        return () => {
            EventSystem.unsubscribe(DisplayEvents.SelectTreeNode);
        }
    })
    const [expandedKeys, setExpandedKeys] = useState<Key[]>([]); // （受控）展开指定的树节点
    
    const onExpand = (expandedKeys: Key[]) => {
      // 更新展开的节点的 keys
      setExpandedKeys(expandedKeys);
    };
    const onDragEmit = (dragObj: TreeDataNode, originParent?: TreeDataNode | null, targetParent?: TreeDataNode | null) => {
        if(!originParent && !targetParent) {
          // 调整顺序 无需更新场景结构
          console.log('onDragEmit 调整顺序 无需更新场景结构')
        } else {
          console.log('onDragEmit 调整节点顺序 => 更新场景结构', originParent, targetParent, dragObj)
          // 调整节点顺序 => 更新场景结构
          // TODO 待完善
          EventSystem.broadcast(TreeEvents.TreeDropUpdate, {
            originParent,
            targetParent: null,
            dragObj: dragObj!,
          });
         
        }
      }
      const onDrop: TreeProps['onDrop'] = (info) => {
          const dropKey = info.node.key;
          const dragKey = info.dragNode.key;
          const dropPos = info.node.pos.split('-');
          const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]); // the drop position relative to the drop node, inside 0, top -1, bottom 1
          const loop = (
            data: TreeDataNode[],
            key: React.Key,
            callback: (node: TreeDataNode, i: number, data: TreeDataNode[]) => void,
          ) => {
            for (let i = 0; i < data.length; i++) {
              if (data[i].key === key) {
                return callback(data[i], i, data);
              }
              if (data[i].children) {
                loop(data[i].children!, key, callback);
              }
            }
          };
          const data = [...treeData];
      
          // Find dragObject 查找拖放的节点
          let dragObj: TreeDataNode;
          loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
          });
      
        
          if (!info.dropToGap) {
            // Drop on the content 拖放到目标节点上
            loop(data, dropKey, (item) => {
              item.children = item.children || [];
              // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
              item.children.unshift(dragObj);
              // @ts-ignore
              const originParent = dragObj?.parent || null;
              // @ts-ignore
              dragObj.parent = item;
              onDragEmit(dragObj, originParent, item);
            });
          } else {
            // 调整顺序
            let ar: TreeDataNode[] = [];
            let i: number;
            loop(data, dropKey, (_item, index, arr) => {
              ar = arr;
              i = index;
  
              // @ts-ignore
              const originParent = dragObj.parent || null;
              // @ts-ignore
              dragObj.parent = null;
              onDragEmit(dragObj, originParent, null);
            });
           
            if (dropPosition === -1) {
              // Drop on the top of the drop node 拖放到目标节点左侧
              ar.splice(i!, 0, dragObj!);
            } else {
              // Drop on the bottom of the drop node
              ar.splice(i! + 1, 0, dragObj!);
            }
          }
          props.setGData(data);
  
          console.log('tree data', data)
  
      };
  
      const addNode = () => {}
      const deleteNode = () => {}
      
    return <ConfigProvider
    theme={{
        components: {
            Tree: {
                directoryNodeSelectedBg: '#f00',
                nodeHoverBg: 'rgba(65, 65, 65, 0.5)',
                nodeSelectedBg: 'rgba(100, 100, 100, 0.5)',
                colorBgContainer: 'rgba(100, 100, 100, 0.2)',
            },
        },
    }}
>
 <Tree
    className="draggable-tree"
    draggable
    blockNode
    defaultExpandAll
    selectedKeys={selectedKeys}
    onExpand={onExpand} // 设置支持点击展开事件
    expandedKeys={expandedKeys} // 展开节点的 keys
    showIcon={true}
    icon={<Icon src={IconCube} />}
    onDrop={onDrop} // 实现拖拽
    onSelect={(e: Key[]) => {
        EventSystem.broadcast(DisplayEvents.TreeSelectNode, e);
        setSelectedKeys(e);
    }}
    titleRender={(e) => titleRender(e, props.handleTreeMenuClick)}
    treeData={props.treeData}
/>
</ConfigProvider>
}