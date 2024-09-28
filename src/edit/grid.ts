import { Color, GridHelper } from "three";
import SceneManager from "./sceneManager";
interface IGridParams {
  size: number;
  divisions: number;
  colorCenterLine?: Color;
  colorGrid?: Color;
}
export default class Grid {
  private gridHelper: GridHelper;
  constructor(_options: IGridParams) {
    const { size, divisions } = _options;
    this.gridHelper = new GridHelper(size, divisions);
    SceneManager.scene.add(this.gridHelper);
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
