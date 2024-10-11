
import './index.less';
import { useEffect, useState } from 'react';
import ViewPort from '../viewport';
import SceneManager from '@/edit/sceneManager/sceneManager';
import { LoaderResourceType } from '@/edit/loader';
import { GLTF } from 'three/examples/jsm/Addons.js';
import { SceneObjectType } from '@/edit/sceneManager/interface';
import { GLTFObject, PrimitiveMesh, PrimitiveMeshType, Sprite } from '@/edit/objects';
import { Texture } from 'three';
import PropertyPanel, { ViewType } from '../panel/property';
import { BaseObject } from '@/edit/objects/baseObject';
import Display from '../panel/display';
import { TreeDataNode } from 'antd';
import { SceneSelectorEvents } from '@/common/constant';

const Layout = () => {
    const [selectedNode, setSelectedNode] = useState<BaseObject|null>(null);
    const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
  
    const onLoad = async () => {
        console.log('load')
        // console.log(SceneManager.scene)
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
        SceneManager.add({
          name: 'man',
          type: SceneObjectType.GLTF,
          object: gltf,
        })
        SceneManager.add({
          type: SceneObjectType.MESH,
          object: box,
        });
        SceneManager.add({
          type: SceneObjectType.SPRITE,
          object: sprite,
        });
    }

    useEffect(() => {
        SceneManager.selector.on(SceneSelectorEvents.Select, (node) => {
          console.log('SceneSelectorEvents', node)
          setSelectedNode(node);
        })
        SceneManager.selector.on(SceneSelectorEvents.UnSelect, () => {
          setSelectedNode(null);
        })
    }, [])

    const propertyProps = {
        viewType: selectedNode ? ViewType.Node : ViewType.None,
        node: selectedNode ? selectedNode : undefined,
    }

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
                </div>
                <div className='panel assets'></div>
            </div>
            <PropertyPanel {...propertyProps} />
        </div>
    )
}
export default Layout;