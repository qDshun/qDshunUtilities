import { Injectable } from '@angular/core';
import { WorldObjectResponse } from '../models/world-object-response';

@Injectable({
  providedIn: 'root'
})
export class TreeService<T extends WorldObjectResponse>  {
  constructor( ) { }

  toTree(objects: T[]): NamedTreeNode<T>[] {
    this.formatPaths(objects);
    const root: NamedTreeNode<T>[] = [];

    objects.forEach(object => {
      const parts = object.path.split('/');
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

  private formatPaths(objects: T[]): void {
    objects.forEach(o => o.path = this.removeLeadingSlash(o.path))
  }

  private removeLeadingSlash(str: string): string {
    if (str.startsWith('/')) {
      return str.substring(1);
    }
    return str;
  }
}

export interface NamedTreeNode<T> {
  name: string;
  value: T | null;
  children: NamedTreeNode<T>[];
}
