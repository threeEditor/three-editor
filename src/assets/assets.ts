import { LoaderResourceType } from '@/edit/loader';

export default [
  {
    name: 'base',
    data: {},
    items: [
      {
        name: 'spriteTexture',
        source:
          'https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/unnamed.png',
        type: LoaderResourceType.Texture2D,
      },
      {
        name: 'defaultModel',
        source:
          'https://gw.alipayobjects.com/os/bmw-prod/5e3c1e4e-496e-45f8-8e05-f89f2bd5e4a4.glb',
        type: LoaderResourceType.GLTF,
      },
    ],
  },
];
