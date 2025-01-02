import {
  Color,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Uniform,
  Plane,
  Vector3,
  DoubleSide,
} from "three";
import SceneManager from "./sceneManager/sceneManager";

export default class Grid {
  gridInstance: Mesh<PlaneGeometry, ShaderMaterial>;
  private plane: Plane;
  static upVector: Vector3 = new Vector3(0, 1, 0);
  static zeroVector: Vector3 = new Vector3(0, 0, 0);
  static gridVisible: boolean = true;
  constructor() {
    const geometry = new PlaneGeometry(5, 5); // 平面几何体
    const uniforms = {
      cellColor: new Uniform(new Color("#aaa")),
      cellSize: new Uniform(5),
      cellThickness: new Uniform(1),
      sectionColor: new Uniform(new Color("#ff0000")), // 默认 X 轴红色
      sectionSize: new Uniform(1),
      sectionThickness: new Uniform(0.5), // 添加 sectionThickness
      followCamera: new Uniform(false),
      infiniteGrid: new Uniform(true),
      fadeDistance: new Uniform(100),
      fadeStrength: new Uniform(1),
      fadeFrom: new Uniform(1),
      worldCamProjPosition: new Uniform(new Vector3()),
      worldPlanePosition: new Uniform(new Vector3()),
    };

    const material = new ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec3 localPosition;
        varying vec4 worldPosition;

        uniform float fadeDistance;
        uniform bool infiniteGrid;

        void main() {
          localPosition = position.xzy;
          if (infiniteGrid) localPosition *= 1.0 + fadeDistance;
          worldPosition = modelMatrix * vec4(localPosition, 1.0);
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        varying vec3 localPosition;

        uniform vec3 cellColor;        // 网格线颜色
        uniform vec3 sectionColor;     // 分段线颜色
        uniform float cellSize;        // 网格线大小
        uniform float sectionSize;     // 分段线大小
        uniform float cellThickness;   // 网格线粗细
        uniform float sectionThickness; // 分段线粗细

        // 计算网格线的位置
        float getGrid(float size, float thickness) {
          vec2 r = localPosition.xz / size;
          vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
          float line = min(grid.x, grid.y) + 1.0 - thickness;
          return 1.0 - min(line, 1.0);
        }

        void main() {
          // 获取网格线的强度
          float g1 = getGrid(cellSize, cellThickness);    // 普通网格线
          float g2 = getGrid(sectionSize, sectionThickness);  // 分段网格线

          // 初始化默认的颜色为普通网格线颜色
          vec3 color = cellColor;

          // float gridLineAlpha = (g1 + g2) * 0.75;
          float gridLineAlpha = (g1 + g2 * 0.15);
          gridLineAlpha = smoothstep(0., 0.2, gridLineAlpha);
          // 精确判断 X 轴和 Z 轴的线，并设定颜色
          // 当 localPosition.z 非常接近 0 时，认为是 X 轴的线

          float coordLineWidth = 0.025;
          float xStep = abs(localPosition.z);
          float zStep = abs(localPosition.x);
          if (xStep < coordLineWidth) {
            gridLineAlpha = 1.0;
            color = vec3(1.0, 0.0, 0.0);  // 红色代表 X 轴
          } else if (zStep < coordLineWidth) {
            gridLineAlpha = 1.0;
            color = vec3(0.0, 0.0, 1.0);  // 蓝色代表 Z 轴
          } else {
            gridLineAlpha *= 0.5;
           }

          // 根据网格线的强度来决定透明度
          gl_FragColor = vec4(color, gridLineAlpha);
          // 丢弃透明部分
          if (gl_FragColor.a <= 0.0) discard;
        }
      `,
      side: DoubleSide,
      transparent: true,
      depthWrite: false,
    });

    this.plane = new Plane();

    this.gridInstance = new Mesh(geometry, material);
    this.gridInstance.frustumCulled = false;
    SceneManager.scene.add(this.gridInstance);
  }

  update() {
    this.plane
      .setFromNormalAndCoplanarPoint(Grid.upVector, Grid.zeroVector)
      .applyMatrix4(this.gridInstance.matrixWorld);

    const gridMaterial = this.gridInstance.material as ShaderMaterial;
    const worldCamProjPosition = gridMaterial.uniforms.worldCamProjPosition;
    const worldPlanePosition = gridMaterial.uniforms.worldPlanePosition;

    const cameraPosition = SceneManager.cameraManager.instance.position;
    this.plane.projectPoint(cameraPosition, worldCamProjPosition.value);
    worldPlanePosition.value
      .set(0, 0, 0)
      .applyMatrix4(this.gridInstance.matrixWorld);
  }

  setEnabled(enable: boolean) {
    this.gridInstance.visible = enable;
  }
}
