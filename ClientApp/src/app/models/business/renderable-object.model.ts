import { signal } from "@angular/core";
import { SnappingOptions } from "./snapping-options.model";

export class RenderableObject {
  public snap = signal(this._snap);
  constructor(
    public id: string,
    public name: string,
    public url: string,
    private _snap: SnappingOptions
  ) { }
}

export class Token extends RenderableObject {

}
