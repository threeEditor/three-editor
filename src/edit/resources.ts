import EventEmitter from 'eventemitter3';
import { Texture } from 'three';
interface assetType {
  name: string;
  data: {};
  items: {
    name: string;
    source: string;
    type: string;
  }[];
  toLoad?: number;
  loaded?: number;
}

interface GroupsType {
  assets: assetType[];
  loaded: assetType[];
  current: assetType | null;
}
class Resources extends EventEmitter {
  public items: {
    [key: string]: any;
  } = {};

  public groups: GroupsType = {
    assets: [],
    loaded: [],
    current: null,
  };
  constructor(_assets: assetType[]) {
    super();

    // TODO 实例化Loader类，加载资源，并将加载的资源存储到items中
    // this.loader = new Loader();

    this.groups.assets = [..._assets];
    this.groups.loaded = [];
    this.groups.current = null;

    this.loadNextGroup();
  }

  loadNextGroup() {
    const nextGroup = this.groups.assets.shift();
    if (nextGroup !== undefined) {
      this.groups.current = nextGroup;
      this.groups.current.toLoad = this.groups.current.items.length;
      this.groups.current.loaded = 0;
    }
  }

  destroy() {
    for (const _itemKey in this.items) {
      const item = this.items[_itemKey];
      if (item instanceof Texture) {
        item.dispose();
      }
    }
  }
}

export default Resources;
