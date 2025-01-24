import { AdditiveBlending, BufferGeometry, Points, PointsMaterial, Sprite, SpriteMaterial, TextureLoader } from "three";
import { SceneObjectType } from "../sceneManager/interface";
import { BaseObject } from "./baseObject";
// import * as THREE from 'three';
// @ts-ignore
// import Proton from 'three.proton.js';
// import { Proton } from '../../particle/core/'

import SceneManager from "../sceneManager/sceneManager";
import { getRandomRange } from "@/utils/util";

export class Particle extends BaseObject {
    public type = SceneObjectType.Particle;

    
    constructor() {
        super();
   
        this.init();
    }

    init() {
        // const proton = new Proton();
        // // 创建发射器
        // const emitter = new Proton.Emitter();
        // // 设置发射器的发射速率
        // emitter.rate = new Proton.Rate(getRandomRange(40, 60), getRandomRange(0.1, 0.2));
        // // 设置粒子的初始位置
        // emitter.addInitialize(new Proton.Position(new Proton.SphereZone(1)));
        // // 设置粒子的初始速度
        // emitter.addInitialize(new Proton.Velocity(3, new Proton.Vector3D(0, 1, 0), 'sphere'));
        // // 设置粒子的生命周期
        // emitter.addInitialize(new Proton.Life(2, 4));
        // // 设置粒子的颜色
        // emitter.addBehaviour(new Proton.Color(['#ff0000', '#00ff00']));
        // // 设置粒子的缩放
        // emitter.addBehaviour(new Proton.Scale(1, 0.1));
        // // 设置粒子的重力
        // emitter.addBehaviour(new Proton.Gravity(1));
        // emitter.addInitialize(new Proton.Body(this.createSprite()));

        // // 启动发射器
        // emitter.emit();
        // // 将发射器添加到 Proton 实例中
        // proton.addEmitter(emitter);

        // // // 创建材质和几何体
        // // const material = new PointsMaterial({ size: 0.1, vertexColors: true });
        // // const geometry = new BufferGeometry();
        // // const particles = new Points(geometry, material);
        // // // scene.current.add(particles);
        // // SceneManager.scene.add(particles);

        // setInterval(() => {
        //     proton.update();
        // }, 400)
    }

    createSprite() {
         // var map = new THREE.TextureLoader().load("./img/dot.png");
         var map = new TextureLoader().load("https://drawcall.github.io/three.proton/engine/example/img/dot.png");
         var material = new SpriteMaterial({
             map: map,
             color: 0xff0000,
             blending: AdditiveBlending,
             fog: true,
             transparent: true,
             depthWrite: false,
         });
         return new Sprite(material);
    }

    update() {
        // this.animateEmitter();
        // proton.update();
        // this.protonInstance.update();
    }

   
}