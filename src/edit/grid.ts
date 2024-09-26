import { Color, Scene, GridHelper } from "three";
interface IGridParams {
  size: number;
  divisions: number;
  colorCenterLine?: Color;
  colorGrid?: Color;
  scene: Scene;
}
export default class Grid {
  private gridHelper: GridHelper;
  constructor(_options: IGridParams) {
    const { size, divisions, scene } = _options;
    this.gridHelper = new GridHelper(size, divisions);
    scene.add(this.gridHelper);
  }

  show() {
    this.gridHelper.visible = true;
  }

  hide() {
    this.gridHelper.visible = false;
  }

  update(size: number, divisions: number) {
    this.gridHelper.dispose();
    this.gridHelper = new GridHelper(size, divisions);
    this.gridHelper.visible = true;
  }

  destory() {
    this.gridHelper.dispose();
  }
}
