import { Icon } from '@/components/icon';
import './index.less';
import { ConfigProvider, Tree } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import { useEffect, useState } from 'react';
import { Key } from 'antd/es/table/interface';
import { EventSystem } from '@/utils/event/EventSystem';
export interface IDisplayProps {
    treeData: TreeDataNode[];
    onTreeDrapUpdate: (treeData: TreeDataNode[]) => void;
}

const Display = (props: IDisplayProps) => {
    const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
    const [gData, setGData] = useState(props.treeData);

    const expandedKeys: string[] = [];

    useEffect(() => {
        EventSystem.subscribe('SetTreeNodes', (treeNodes: TreeDataNode[]) => {
            console.log('SetTreeNodes', treeNodes)
            setGData(treeNodes);
        })
        EventSystem.subscribe('SelectNode', (keys: string[]) => {
            setSelectedKeys(keys);
        })       
        return () => {
            EventSystem.unsubscribe('SelectNode');
        }
    }, [])
    

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
        const data = [...gData];
    
        // Find dragObject
        let dragObj: TreeDataNode;
        loop(data, dragKey, (item, index, arr) => {
          arr.splice(index, 1);
          dragObj = item;
        });
    
        if (!info.dropToGap) {
          // Drop on the content
          loop(data, dropKey, (item) => {
            item.children = item.children || [];
            // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
            item.children.unshift(dragObj);
          });
        } else {
          let ar: TreeDataNode[] = [];
          let i: number;
          loop(data, dropKey, (_item, index, arr) => {
            ar = arr;
            i = index;
          });
          if (dropPosition === -1) {
            // Drop on the top of the drop node
            ar.splice(i!, 0, dragObj!);
          } else {
            // Drop on the bottom of the drop node
            ar.splice(i! + 1, 0, dragObj!);
          }
        }
        setGData(data);
        props.onTreeDrapUpdate(data);
    };
    return <div className="display_content">
        <div className='title'>Display</div>
        <ConfigProvider
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
            selectedKeys={selectedKeys}
            expandedKeys={expandedKeys}
            showIcon={true}
            icon={<Icon/>}
            onDrop={onDrop}
            onSelect={(e: Key[]) => {
                setSelectedKeys(e);
            }}
            onRightClick={(e) => {
                console.log('onRightClick', e.node)
            }}
            treeData={gData}
        />
        </ConfigProvider>
       
    </div>
}
export default Display;