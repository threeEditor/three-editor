import {
  CylinderGeometry,
  MeshBasicMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  Mesh,
  Group,
  Color,
  CanvasTexture,
  SRGBColorSpace,
  SpriteMaterial,
  Sprite,
  Raycaster,
  Vector2,
} from 'three';

// 右上角的视角帮助器 用于展示当前场景的视角
export default class ViewHelper {
  private camera: PerspectiveCamera;
  private viewHelperScene: Scene;
  private viewHelperCamera: OrthographicCamera;
  private viewHelperRenderer: WebGLRenderer;

  constructor(camera: PerspectiveCamera) {
    this.camera = camera;

    const interactiveObjects = [];
    const raycaster = new Raycaster();
    const mouse = new Vector2();

    const color1 = new Color('#ff4466');
    const color2 = new Color('#88ff44');
    const color3 = new Color('#4488ff');
    const color4 = new Color('#000000');

    // 初始化视角帮助器
    this.viewHelperScene = new Scene();
    this.viewHelperCamera = new OrthographicCamera(-2, 2, 2, -2, 0, 4);
    this.viewHelperCamera.position.set(1, 1, 1);
    this.viewHelperCamera.lookAt(new Vector3(0, 0, 0));

    const AxisGroup = new Group();

    const geometry = new CylinderGeometry(0.04, 0.04, 0.8, 5)
      .rotateZ(-Math.PI / 2)
      .translate(0.4, 0, 0);
    const xAxis = new Mesh(geometry, this.getAxisMaterial(color1));
    const yAxis = new Mesh(geometry, this.getAxisMaterial(color2));
    const zAxis = new Mesh(geometry, this.getAxisMaterial(color3));

    yAxis.rotation.z = Math.PI / 2;
    zAxis.rotation.y = -Math.PI / 2;

    this.viewHelperScene.add(xAxis);
    this.viewHelperScene.add(zAxis);
    this.viewHelperScene.add(yAxis);

    const spriteMaterial1 = this.getSpriteMaterial(color1, 'X');
    const spriteMaterial2 = this.getSpriteMaterial(color2, 'Y');
    const spriteMaterial3 = this.getSpriteMaterial(color3, 'Z');
    const spriteMaterial4 = this.getSpriteMaterial(color4);

    const posXAxisHelper = new Sprite(spriteMaterial1);
    const posYAxisHelper = new Sprite(spriteMaterial2);
    const posZAxisHelper = new Sprite(spriteMaterial3);
    const negXAxisHelper = new Sprite(spriteMaterial4);
    const negYAxisHelper = new Sprite(spriteMaterial4);
    const negZAxisHelper = new Sprite(spriteMaterial4);

    posXAxisHelper.position.x = 1;
    posYAxisHelper.position.y = 1;
    posZAxisHelper.position.z = 1;
    negXAxisHelper.position.x = -1;
    negYAxisHelper.position.y = -1;
    negZAxisHelper.position.z = -1;

    negXAxisHelper.material.opacity = 0.2;
    negYAxisHelper.material.opacity = 0.2;
    negZAxisHelper.material.opacity = 0.2;

    posXAxisHelper.userData.type = 'posX';
    posYAxisHelper.userData.type = 'posY';
    posZAxisHelper.userData.type = 'posZ';
    negXAxisHelper.userData.type = 'negX';
    negYAxisHelper.userData.type = 'negY';
    negZAxisHelper.userData.type = 'negZ';

    this.viewHelperScene.add(posXAxisHelper);
    this.viewHelperScene.add(posYAxisHelper);
    this.viewHelperScene.add(posZAxisHelper);
    this.viewHelperScene.add(negXAxisHelper);
    this.viewHelperScene.add(negYAxisHelper);
    this.viewHelperScene.add(negZAxisHelper);

    // 初始化渲染器
    this.viewHelperRenderer = new WebGLRenderer({ alpha: true });
    this.viewHelperRenderer.setSize(120, 120); // 设置大小
    this.viewHelperRenderer.domElement.className = 'viewHelper';
    this.viewHelperRenderer.domElement.style.position = 'absolute';
    this.viewHelperRenderer.domElement.style.top = '24px'; // 放在屏幕左上角
    this.viewHelperRenderer.domElement.style.right = '24px';
    const viewportDom = document.getElementById('viewport_container');
    if (viewportDom) {
      viewportDom.appendChild(this.viewHelperRenderer.domElement);
    }
  }
  getAxisMaterial(color: Color) {
    return new MeshBasicMaterial({
      color: color,
      toneMapped: false,
    });
  }

  getSpriteMaterial(color: Color, text?: string) {
    const font = '24px Arial';
    const labelColor = '#000000';
    const radius = 14;

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;

    const context = canvas.getContext('2d');
    if (!context) return;
    context.beginPath();
    context.arc(32, 32, radius, 0, 2 * Math.PI);
    context.closePath();
    context.fillStyle = color.getStyle();
    context.fill();

    if (text) {
      context.font = font;
      context.textAlign = 'center';
      context.fillStyle = labelColor;
      context.fillText(text, 32, 41);
    }

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;

    return new SpriteMaterial({ map: texture, toneMapped: false });
  }

  // 更新视角帮助器的渲染
  public update() {
    // copy editor camera position
    // Look at the editor camera target
    // keep up direction 0, 1, 0
    this.viewHelperCamera.position.copy(
      this.camera.position.clone().normalize()
    );
    this.viewHelperCamera.lookAt(new Vector3(0, 0, 0));
    this.viewHelperRenderer.render(this.viewHelperScene, this.viewHelperCamera);
  }
}
