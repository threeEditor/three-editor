import { useEffect, useRef } from "react";
import "./index.css";
import EditManager from "../../edit/core";
import { Cube } from "../../factory/";
import SceneManager from "@/edit/sceneManager/sceneManager";
import { LoaderResourceType } from "@/edit/loader";
import { GLTF } from "three/examples/jsm/Addons.js";
import { SceneObjectType } from "@/edit/sceneManager/interface";
import Sprite from "@/factory/sprite";
import { Texture } from "three";


const ViewPort = () => {
  const view = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if(!view.current) return;
    const editManager = new EditManager(view.current);
    editManager.setUp();

    // mock event
    setTimeout(async () => {
      if (editManager) {
        // mock: 模拟外侧添加
        const { scene } = await SceneManager.loader.load({
          type: LoaderResourceType.GLTF,
          url: "https://gw.alipayobjects.com/os/bmw-prod/5e3c1e4e-496e-45f8-8e05-f89f2bd5e4a4.glb",
        }) as GLTF;
        scene.scale.set(5, 5, 5);
        SceneManager.add({
          type: SceneObjectType.GLTF,
          node: scene,
        })

        const cube = Cube({ size: 5, color: "#ff0" });
        SceneManager.add({
          type: SceneObjectType.MESH,
          node: cube,
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
    }, 1000);
    return () => {
      editManager.destroy();
    }
  }, []);
  return <div id="viewport_container" ref={view} />;
};

export default ViewPort;
