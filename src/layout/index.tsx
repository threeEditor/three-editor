import './index.less';
import { useEffect, useState } from 'react';
import ViewPort from '../components/viewport';
import SceneManager from '@/edit/sceneManager/sceneManager';
import { GLTFObject, Sprite } from '@/edit/objects';
import PropertyPanel, { ViewType } from '../components/panel/property';
import { BaseObject } from '@/edit/objects/baseObject';
import HierarchyPanel from '../components/panel/hierarchyPanel';
import { TreeDataNode } from 'antd';
import { SceneEvents, SceneSelectorEvents, TreeEvents } from '@/common/constant';
import Toolbar from '../components/toolbar';
import { EventSystem } from '@/utils/event/EventSystem';
import { LayoutSize } from '@/common/layout';
import EditManager from '@/edit/core';

interface INodeInfo {
  viewType: ViewType;
  uuid?: string;
  name?: string;
}

let editManagerInstance: EditManager | null = null;
const Layout = () => {
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
  const [nodeInfo, setNodeInfo] = useState<INodeInfo>({
    viewType: ViewType.None,
  });
  const [centerPanelWidth, setCenterPanelWidth] = useState(LayoutSize.CenterPanelWidth);

  const onLoad = async (edit: EditManager) => {
    editManagerInstance = edit;
    // cacheTreeNodes
    // mock: 模拟外侧添加
    const gltfResource = SceneManager.resources.items['https://gw.alipayobjects.com/os/bmw-prod/5e3c1e4e-496e-45f8-8e05-f89f2bd5e4a4.glb'];
    const gltf = new GLTFObject({
      gltf: gltfResource,
    });
    gltf.setScale(5);

    const texture = SceneManager.resources.items['https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/unnamed.png'];
    const sprite = new Sprite({
      texture,
      opacity: 0.8,
    });
    sprite.setPosition(6);
    sprite.setScale(4);
    // name: 'man',
    SceneManager.add(gltf);
    SceneManager.add(sprite);
  };

  useEffect(() => {
    SceneManager.selector.on(SceneSelectorEvents.Select, (node: BaseObject) => {
      setNodeInfo({
        viewType: ViewType.Node,
        ...node.info,
      });
    });
    SceneManager.selector.on(SceneSelectorEvents.UnSelect, () => {
      setNodeInfo({
        viewType: ViewType.None,
      });
    });
    SceneManager.GizmoManager.on(
      SceneEvents.GizmoTransform,
      (node: BaseObject) => {
        //创建新的引用对象
        setNodeInfo({
          viewType: ViewType.Node,
          ...node.info,
        });
      }
    );
    const handleLayoutUpdate = () => {
      // console.log('handleLayoutUpdate', LayoutSize.PropertyPanelWidth)
      setCenterPanelWidth(LayoutSize.CenterPanelWidth);
      editManagerInstance?.resize();
    }
    EventSystem.subscribe(SceneEvents.LayoutUpdate, handleLayoutUpdate);
    return () => {
      EventSystem.unsubscribe(SceneEvents.LayoutUpdate, handleLayoutUpdate);
    };
  }, []);

  useEffect(() => {
    const { viewType } = nodeInfo;
    if (viewType === 'None') return;
    const handleRename = ({newName}: { newName: string }) => {
      setNodeInfo({
        ...nodeInfo,
        name: newName,
      });
    };
    EventSystem.subscribe(TreeEvents.ObjectRename, handleRename);
    return () => {
      EventSystem.unsubscribe(TreeEvents.ObjectRename, handleRename);
    }
  }, [nodeInfo]);
  return (
    <div className="layout">
      <div className="panel hierarchyPanel">
        {/* 场景树面板 */}
        <HierarchyPanel treeData={treeData} />
      </div>
      <div className="panel_center" style={{
        width: `${centerPanelWidth}px`
      }}>
        <div className="panel viewport">
          <ViewPort onLoad={onLoad} />
          {/* 编辑视窗左上角的工具栏 */}
          <Toolbar />
        </div>
        <div className="panel_assets"></div>
      </div>
      <PropertyPanel {...nodeInfo} />
    </div>
  );
};
export default Layout;
