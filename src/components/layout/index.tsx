
import './index.less';
import { useEffect, useRef } from 'react';
import { preventTouchMove, preventWheel } from '@/utils/event/dom';
import ViewPort from '../viewport';
import EditManager from '@/edit/core';
import SceneManager from '@/edit/sceneManager/sceneManager';
import { LoaderResourceType } from '@/edit/loader';
import { GLTF } from 'three/examples/jsm/Addons.js';
import { SceneObjectType } from '@/edit/sceneManager/interface';
import { GLTFObject, PrimitiveMesh, PrimitiveMeshType, Sprite } from '@/edit/objects';
import { Texture } from 'three';
const Layout = () => {
    const ref = useRef<EditManager>();
    useEffect(() => {
        // 关闭页面的上拉、下拉
        console.log(ref)
        window.addEventListener('wheel', preventWheel, { passive: false });
        window.addEventListener('touchmove', preventTouchMove)
        return () => {
            window.removeEventListener('wheel', preventWheel);
            window.removeEventListener('touchmove', preventTouchMove);
        }
    })
    const onLoad = async () => {
        console.log('load')
        // mock: 模拟外侧添加
        const gltfResource = await SceneManager.loader.load({
            type: LoaderResourceType.GLTF,
            url: "https://gw.alipayobjects.com/os/bmw-prod/5e3c1e4e-496e-45f8-8e05-f89f2bd5e4a4.glb",
          }) as GLTF;
          const gltf = new GLTFObject({
            gltf: gltfResource,
          });
          gltf.setScale(5);
          SceneManager.add({
            type: SceneObjectType.GLTF,
            node: gltf.node,
          })
          const box = new PrimitiveMesh({
            type: PrimitiveMeshType.BOX,
            size: 5,
          })
          SceneManager.add({
            type: SceneObjectType.MESH,
            node: box.node,
          });
  
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
            type: SceneObjectType.SPRITE,
            node: sprite.node,
          });
    }
    return (
        <div className="layout">
            <div className='panel display'></div>
            <div className='center'>
                <div className='panel viewport'>
                    <ViewPort onLoad={onLoad} />
                </div>
                <div className='panel assets'></div>
            </div>
            <div className='panel properties'></div>
        </div>
    )
}
export default Layout;