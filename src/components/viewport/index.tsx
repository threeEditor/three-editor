import React, { useEffect, useRef } from "react";
import './index.css';
import EditManager from '../../edit/core';
import { Cube } from "../../factory/";

const ViewPort = () => {
    const view = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const editManager = new EditManager(view.current!);
        editManager.setUp();

        setTimeout(() => {
            if(editManager) {
                console.log('***')
              // mock: 模拟外侧添加
              const sceneManager = editManager.sceneManager;
              sceneManager.addModel({
                type: 'gltf',
                url: 'https://gw.alipayobjects.com/os/bmw-prod/5e3c1e4e-496e-45f8-8e05-f89f2bd5e4a4.glb'
              }, model => {
                // Tip test
                model.scale.set(5, 5, 5)
              })
              const cube = Cube({ size: 5, color: '#ff0' });
              sceneManager.add({
                type: 'mesh',
                object: cube
              })
              
            }
          }, 1000);
    }, []);
    return (<div id="viewport_container" ref={view}/>)
}

export default ViewPort;