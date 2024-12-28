// https://www.yuque.com/yiqianyao/vcv10s/uahoo3iq1trz4zyn
export const defaultSceneConfig = {
    name: 'scene1',
    cameras: [
        {
            position: {
                x: 10,
                y: 10,
                z: 10,
            },
            target: {
                x: 0,
                y: 0,
                z: 0,
            },
            up: {
                x: 0,
                y: 1,
                z: 0,
            }
        }
    ],
    lights: [],
    helpers: [],
    objects: [],
}

export interface ISceneConfig {
    name?: string;
    lights?: ILight[];
    helpers?: IHelper[];
    objects?: IObject[];
    cameras?: ICamera[];
}

export interface IScene {
    name: string;
    cameras: ICamera[];
    lights: ILight[];
    helpers: IHelper[];
    objects: IObject[];
}

export interface ICamera {
    name?: string;
    position?: {
        x: number;
        y: number;
        z: number;
    };
    target?: {
        x: number;
        y: number;
        z: number;
    };
    up?: {
        x: number;
        y: number;
        z: number;
    };
}

export interface ILight {
    name?: string;
}
export interface IHelper {
    name?: string;
}
export interface IObject {
    name?: string;
}