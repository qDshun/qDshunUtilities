import { Injectable } from '@angular/core';
import { WorldObject } from '../models/world-object.model';

@Injectable({
  providedIn: 'root'
})
export class TreeService<T extends WorldObject>  {
  constructor( ) { }

  toTree(objects: T[]): NamedTreeNode<T>[] {
    const root: NamedTreeNode<T>[] = [];

    objects.forEach(object => {
      const parts = object.path().split('/');
      let currentLevel = root;

      parts.forEach((part, index) => {
        // Check if this part of the path already exists at the current level
        let existingNode = currentLevel.find(node => node.name === part);

        if (!existingNode) {
          // If it doesn't exist, create a new node (folder or item)
          existingNode = { name: part, children: [], value: null };
          currentLevel.push(existingNode);
        }

        // If this is the last part, it's an item, not a folder
        if (index === parts.length - 1) {
          existingNode.children = [];  // Item node won't have children
          existingNode.value = object;
        } else {
          // Move to the next level (folder)
          currentLevel = existingNode.children!;
        }
      });
    });

    return root;
  }

}

export interface NamedTreeNode<T> {
  name: string;
  value: T | null;
  children: NamedTreeNode<T>[];
}
