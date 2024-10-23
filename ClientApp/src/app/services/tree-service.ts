import { Injectable } from '@angular/core';
import { WorldObject, WorldObjectFolder, WorldObjectItem } from '../models/world-object.model';

@Injectable({
  providedIn: 'root'
})
export class TreeService {
  constructor() { }

  toTree(worldObjects: AnyWorldObject[]): TreeNode<AnyWorldObject>[] {
    const folders = worldObjects.filter(wo => wo.type == 'folder').map(wo => ({ worldObject: wo, pathFragments: wo.path().split('/') })).sort(wo => wo.pathFragments.length);
    const items = worldObjects.filter(wo => wo.type == 'item').map(wo => ({ worldObject: wo, pathFragments: wo.path().split('/') })).sort(wo => wo.pathFragments.length);
    const objectsWithDepth = [...folders, ...items];

    const result: TreeNode<AnyWorldObject>[] = [];
    const pathMap = new Map<string, TreeNode<AnyWorldObject>>();

    objectsWithDepth.forEach(({ worldObject, pathFragments }) => {
      var parent = pathMap.get(worldObject.path());

      const node = { children: [], value: worldObject, name: worldObject.name() };

      pathMap.set(worldObject.fullPath, node);
      (parent?.children ?? result).push(node);
    });
    return result;
  }
}

export type AnyWorldObject = WorldObjectFolder | WorldObjectItem;
export interface TreeNode<T extends WorldObject> {
  name: string;
  children: TreeNode<T>[];
  value: T;
}
