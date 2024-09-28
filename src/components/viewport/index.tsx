import React, { useEffect, useRef } from "react";
import "./index.css";
import EditManager from "../../edit/core";
import { Cube } from "../../factory/";
import SceneManager from "@/edit/sceneManager";

const ViewPort = () => {
  const view = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if(!view.current) return;
    const editManager = new EditManager(view.current);
    editManager.setUp();
    // mock event
    setTimeout(() => {
      if (editManager) {
        // mock: 模拟外侧添加
        SceneManager.addModel(
          {
            type: "gltf",
            url: "https://gw.alipayobjects.com/os/bmw-prod/5e3c1e4e-496e-45f8-8e05-f89f2bd5e4a4.glb",
          },
          (model) => {
            // Tip test
            model.scale.set(5, 5, 5);
          }
        );
        const cube = Cube({ size: 5, color: "#ff0" });
        SceneManager.add({
          type: "mesh",
          object: cube,
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
