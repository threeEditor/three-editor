import './index.less';
import { Button } from 'antd';
import type { TreeDataNode } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { EventSystem } from '@/utils/event/EventSystem';
import { DisplayEvents, SceneEvents, SceneType, SystemEvents, TreeEvents } from '@/common/constant';
import { SkyCard } from './skyCard';
import { InputTextModal } from '@/components/modal';
import { filterNode, updateNodeName } from './utils';
import { SceneSwitch } from '@/components/sceneSwitch';
// import { executeScript } from '../runtime/core';
import SceneManager from '@/edit/sceneManager/sceneManager';
import { TreeComponent } from './tree';
export interface IDisplayProps {
  treeData: TreeDataNode[];
}

let editNode: any = null;

const Display = (props: IDisplayProps) => {
    const [jsonEditVis, setJsonEditVis] = useState(false);
    const [inputVis, setInputVis] = useState(false);
    const [inputV, setInputV] = useState('');
    const [gData, setGData] = useState(props.treeData);

    useEffect(() => {
        // 添加场景对象的时候 触发 tree 节点更新
        EventSystem.subscribe(DisplayEvents.SetTreeNodes, (treeNodes: TreeDataNode[]) => {
          setTimeout(() => {
            setGData(treeNodes);
          }, 100 )
        })
        EventSystem.subscribe(SystemEvents.HideAceEdit, () => setJsonEditVis(false));
        return () => {
          EventSystem.unsubscribe(DisplayEvents.SetTreeNodes);
          EventSystem.unsubscribe(SystemEvents.HideAceEdit);
        }
    }, [])

    const InputTextModalOK = useCallback((newName: string) => {
      const nextData = updateNodeName(gData, editNode.key, newName);
      // TODO 待完善
      EventSystem.broadcast(TreeEvents.ObjectRename, {
        key: editNode.key,
        newName,
      });
      editNode = null;
      setGData(nextData);
      setInputV('');
      setInputVis(false);
    }, [gData, editNode])

    return <div className="display_content">
        <SceneSwitch defaultSceneType={SceneType.Edit} onSwitch={(type: SceneType) => {
          // TODO 测试为运行时单独添加脚本
          // executeScript();

          SceneManager.switchSceneMode(type);
          EventSystem.broadcast(SceneEvents.ChangeSceneType, type);
        }} />

        {/* 场景天空的编辑卡片 */}
        <SkyCard />

        <TreeComponent  
          treeData={gData} 
          setGData={(data) => setGData(data)}
          handleTreeMenuClick={(e) => {
            switch(e.type) {
              case 'rename':
                const node = filterNode(gData, e.nodeKey) as TreeDataNode;
                editNode = node;
                setInputV(node.title as string);
                setInputVis(true);
                break;
            }
          }} />
        
        {/* InputTextModal for rename */}
        <InputTextModal
          value={inputV}
          isModalOpen={inputVis} 
          handleCancel={() => {
            setInputVis(false);
            setInputV('');
          }}
          handleOk={InputTextModalOK}
          />

        <Button className='ace_json_btn' onClick={() => {
          setJsonEditVis(!jsonEditVis)
          EventSystem.broadcast(jsonEditVis ? SystemEvents.HideAceEdit:SystemEvents.ViewAceEdit);
        }}>{jsonEditVis ? '隐藏场景 json' : '场景 json'}</Button>
    </div>
}
export default Display;