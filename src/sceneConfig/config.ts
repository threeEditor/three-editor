// https://www.yuque.com/yiqianyao/vcv10s/uahoo3iq1trz4zyn
export const defaultSceneConfig = {
    name: 'scene1',
    defaultScene: 0,
    scenes: [ // 一个
        {
            name: 'scene1',
            cameras: [],
            lights: [],
            helpers: [],
            objects: [],
        }
    ]
}

export interface ISceneConfig {
    name: string;
    defaultScene: number;
    scenes: IScene[];
}

export interface IScene {
    name: string;
    cameras: ICamera[];
    lights: ILight[];
    helpers: IHelper[];
    objects: IObject[];
}

export interface ICamera {
    name: string;
}

export interface ILight {
    name: string;
}
export interface IHelper {
    name: string;
}
export interface IObject {
    name: string;
}