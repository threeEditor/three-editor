import { Icon } from '@/components/icon';
import './index.less';
import { Button, ConfigProvider, Tree } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { Key } from 'antd/es/table/interface';
import { EventSystem } from '@/utils/event/EventSystem';
import { DisplayEvents, SceneEvents, SceneType, SystemEvents } from '@/common/constant';
import { SkyCard } from './skyCard';
import { titleRender, TreeMenuEvent } from './treeMenu';
import { InputTextModal } from '@/components/modal';
import { filterNode, updateNodeName } from './utils';
import { SceneSwitch } from '@/components/sceneSwitch';
import SceneManager from '@/edit/sceneManager/sceneManager';
export interface IDisplayProps {
    treeData: TreeDataNode[];
    onTreeDropUpdate: (treeData: TreeDataNode[]) => void;
}

let editNode: any = null;

const Display = (props: IDisplayProps) => {
    const [jsonEditVis, setJsonEditVis] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
    const [inputVis, setInputVis] = useState(false);
    const [inputV, setInputV] = useState('');
    const [gData, setGData] = useState(props.treeData);
    const expandedKeys: string[] = [];

    useEffect(() => {
        // 添加场景对象的时候 触发 tree 节点更新
        EventSystem.subscribe(DisplayEvents.SetTreeNodes, (treeNodes: TreeDataNode[]) => {
          setTimeout(() => {
            setGData(treeNodes);
          }, 100 )
        })
        // 触发 tree 节点的选中 keys => uuid[]
        EventSystem.subscribe(DisplayEvents.SelectTreeNode, (keys: string[]) => {
          setSelectedKeys(keys);
        })       
        return () => {
          EventSystem.unsubscribe(DisplayEvents.SetTreeNodes);
          EventSystem.unsubscribe(DisplayEvents.SelectTreeNode);
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
        props.onTreeDropUpdate(data);
    };

    const addNode = () => {

    }

    const deleteNode = () => {

    }

    const handleTreeMenuClick = (e: TreeMenuEvent) => {
      // console.log('handleTreeMenuClick', e)
      // setSelectedKeys([]);
      switch(e.type) {
        case 'rename':
          const node = filterNode(gData, e.nodeKey) as TreeDataNode;
          editNode = node;
          setInputV(node.title as string);
          setInputVis(true);
          break;
      }
      // console.log('handleClick', e, gData)
    }

    const InputTextModalCancel = useCallback(() => {
      setInputVis(false);
      setInputV('');
    }, [])

    const InputTextModalOK = useCallback((newName: string) => {
      const nextData = updateNodeName(gData, editNode.key, newName);
      EventSystem.broadcast(SceneEvents.ObjectRename, newName);
      editNode = null;
      setGData(nextData);
      setInputV('');
      setInputVis(false);
    }, [gData, editNode])

    return <div className="display_content">
        <SceneSwitch defaultSceneType={SceneType.Edit} onSwitch={(type: SceneType) => {
          console.log('SceneSwitch', type);
          SceneManager.switchSceneMode(type);
          EventSystem.broadcast(SceneEvents.ChangeSceneType, type);
        }} />
        <SkyCard />
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
                EventSystem.broadcast(DisplayEvents.TreeSelectNode, e);
            }}
            titleRender={(e) => titleRender(e, handleTreeMenuClick)}
            treeData={gData}
        />
        </ConfigProvider>
        {/* InputTextModal for rename */}
        <InputTextModal
          value={inputV}
          isModalOpen={inputVis} 
          handleCancel={InputTextModalCancel}
          handleOk={InputTextModalOK}
          />
        <Button onClick={() => {
          setJsonEditVis(!jsonEditVis)
          EventSystem.broadcast(jsonEditVis ? SystemEvents.HideAceEdit:SystemEvents.ViewAceEdit);
        }}>{jsonEditVis ? 'Hide Scene Config' : 'View Scene Config'}</Button>
    </div>
}
export default Display;