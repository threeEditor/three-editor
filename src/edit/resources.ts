import EventEmitter from 'eventemitter3';
import SceneManager from './sceneManager/sceneManager';
import { LoaderManager } from './loader';
import { LoaderResourceType } from '@/edit/loader';
export interface assetType {
  name: string;
  url: string;
  type: LoaderResourceType;
}
class Resources extends EventEmitter {
  public loader: LoaderManager;
  private toLoad: number;
  private loaded: number;
  public progress: number;
  public items: { [key: string]: any };
  constructor(assets: assetType[]) {
    super();
    this.loader = SceneManager.loader;
    this.loaded = 0;
    this.toLoad = 0;
    this.progress = 0;
    this.items = {};

    // 加载资源
    this.loadAssets(assets);
  }

  loadAssets(assets: assetType[]) {
    this.loaded = 0;
    this.toLoad = assets.length;
    assets.forEach(async (asset) => {
      const item = await this.loader.load(asset);
      this.loaded++;
      this.items[asset.name] = item;
      this.progress = this.loaded / this.toLoad;
      if (this.loaded === this.toLoad) {
        this.emit('loaded');
      }
    });
  }

  destroy() {}
}

export default Resources;
