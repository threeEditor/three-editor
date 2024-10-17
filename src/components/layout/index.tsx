
import './index.less';
import { useEffect, useState } from 'react';
import ViewPort from '../viewport';
import SceneManager from '@/edit/sceneManager/sceneManager';
import { LoaderResourceType } from '@/edit/loader';
import { GLTF } from 'three/examples/jsm/Addons.js';
import { GLTFObject, PrimitiveMesh, PrimitiveMeshType, Sprite } from '@/edit/objects';
import { Texture } from 'three';
import PropertyPanel, { ViewType } from '../panel/property';
import { BaseObject } from '@/edit/objects/baseObject';
import Display from '../panel/display';
import { TreeDataNode } from 'antd';
import { SceneEvents, SceneSelectorEvents } from '@/common/constant';
import Toolbar from '../toolbar';
const Layout = () => {
    const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
    const [nodeInfo, setNodeInfo] = useState({ viewType: ViewType.None });
  
    const onLoad = async () => {
        console.log('load')
        // cacheTreeNodes
        // EventSystem.broadcast('SetTreeNodes', [
        //   {
        //     key: '1',
        //     title: 'title',
        //   }
        // ])
        // mock: 模拟外侧添加
        const gltfResource = await SceneManager.loader.load({
            type: LoaderResourceType.GLTF,
            url: "https://gw.alipayobjects.com/os/bmw-prod/5e3c1e4e-496e-45f8-8e05-f89f2bd5e4a4.glb",
        }) as GLTF;
        const gltf = new GLTFObject({
          gltf: gltfResource,
        });
        gltf.setScale(5);
       
        const box = new PrimitiveMesh({
          type: PrimitiveMeshType.BOX,
          size: 5,
        })
        const texture = await SceneManager.loader.load({
          type: LoaderResourceType.Texture2D,
          url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/unnamed.png',
        }) as Texture;        
        const sprite = new Sprite({
          texture,
          opacity: 0.8,
        });
        sprite.setPosition(6);
        sprite.setScale(4);
        // name: 'man',
        SceneManager.add(gltf)
        SceneManager.add(box);
        SceneManager.add(sprite);
    }

    useEffect(() => {
        SceneManager.selector.on(SceneSelectorEvents.Select, (node: BaseObject) => {
          setNodeInfo({
            viewType: ViewType.Node,
            ...node.info
          });
        })
        SceneManager.selector.on(SceneSelectorEvents.UnSelect, () => {
          setNodeInfo({
            viewType: ViewType.None,
          });
        })
        SceneManager.GizmoManager.on(SceneEvents.GizmoTransform, (node: BaseObject) => {
          //创建新的引用对象
          setNodeInfo({
            viewType: ViewType.Node,
            ...node.info
          });
      });
    }, [])
    return (
        <div className="layout">
            <div className='panel display'>
              <Display treeData={treeData} onTreeDropUpdate={(data) => {
                console.log('onTreeDropUpdate', data)
              }} />
            </div>
            <div className='center'>
                <div className='panel viewport'>
                    <ViewPort onLoad={onLoad} />
                    <Toolbar {...nodeInfo}/>
                </div>
                <div className='panel assets'></div>
            </div>
            <PropertyPanel {...nodeInfo} />
        </div>
    )
}
export default Layout;