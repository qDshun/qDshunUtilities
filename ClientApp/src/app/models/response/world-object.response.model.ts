export class WorldObjectResponse {
  type!: 'folder' | 'item';
  id!: string;
  name!: string;
  parentId?: string;
  previousId?: string;
}

export class WorldObjectFolderResponse extends WorldObjectResponse {

}

export class  WorldObjectItemResponse extends WorldObjectResponse {
  url!:string;
}
