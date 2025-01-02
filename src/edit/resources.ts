import EventEmitter from 'eventemitter3';
import SceneManager from './sceneManager/sceneManager';
import { ILoaderResource, LoaderManager } from './loader';

export interface Asset extends ILoaderResource {};
class Resources extends EventEmitter {
  public loader: LoaderManager;
  private toLoad: number;
  private loaded: number;
  public progress: number;
  public items: { [key: string]: any };
  constructor() {
    super();
    this.loader = SceneManager.loader;
    this.loaded = 0;
    this.toLoad = 0;
    this.progress = 0;
    this.items = {};
  }

  loadAssets(assets: Asset[]) {
    this.loaded = 0;
    this.toLoad = assets.length;
    assets.forEach(async (asset) => {
      const item = await this.loader.load(asset);
      this.loaded++;
      this.items[asset.url] = item;
      this.progress = this.loaded / this.toLoad;
      if (this.loaded === this.toLoad) {
        this.emit('loaded');
      }
    });
  }

  async loadAsset(asset: Asset) {
    if(this.items[asset.url]) {
      return this.items[asset.url];
    }
    
    const item = await this.loader.load(asset);
    if(item) {
      this.items[asset.url] = item;
    }
    return item;
  }

  destroy() {}
}

export default Resources;
