import { signal } from "@angular/core";
import { SnappingOptions } from "./snapping-options.model";
import { Assets, Texture } from "pixi.js";
import { from, map, Observable, tap } from "rxjs";
import { Guid } from "app/helpers/guid.type";
import { RenderableObjectType } from "../response/map.response.model";

export class RenderableObject {
  public snap = signal(this._snap);
  public texture!: Texture;
  constructor(
    public id: Guid,
    public url: string,
    public type: RenderableObjectType,
    private _snap: SnappingOptions
  ) { }

  public loadTexture(): Observable<void>{
    return from(Assets.load<Texture>(this.url)).pipe(
      tap(texture => this.texture = texture),
      map(_ => void 0)
    );
  }
}
