export class WorldObjectResponse {
  type!: 'folder' | 'item';
  path!: string;
  id!: string;
  name!: string;
}

export class WorldObjectFolderResponse extends WorldObjectResponse {

}

export class  WorldObjectItemResponse extends WorldObjectResponse {
  url!:string;
}
