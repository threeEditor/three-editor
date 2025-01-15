import { PrimitiveMeshType } from "@/edit/objects";

// https://www.yuque.com/yiqianyao/vcv10s/uahoo3iq1trz4zyn
export const defaultSceneConfig = {
    name: 'scene1',
    cameras: [ // SceneObjectType.CAMERA
        {
            name: 'MainCamera',
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
    lights: [], // SceneObjectType.LIGHT
    helpers: [], // SceneObjectType.HELPER
    objects: [ // SceneObjectType.MESH
        {
            name: 'GrayBox',
            type: PrimitiveMeshType.BOX,
            position: {
                x: -2.5, 
                y: 2.5,
                z: -5,
            },
            size: 5,
        },
        {
            name: 'Ground',
            type: PrimitiveMeshType.PLANE,
            rotation: {
                x: -Math.PI / 2,
                y: 0,
                z: 0,
            },
            size: 100,
            material: {
                color: 0xddaa00,
            }
        },
        {
            name: 'ball',
            type: PrimitiveMeshType.SPHERE,
            position: {
                x: 2.5,
                y: 2.5,
                z: -5,
            },
            size: 1,
            material: {
                color: 0x00ddaa,
            }
        }
    ],
}

export const defaultPosition = {
    x: 0,
    y: 0,
    z: 0,
}

export const defaultRotation = {
    x: 0,
    y: 0,
    z: 0,
}


