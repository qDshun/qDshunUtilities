import { Injectable, inject, EffectRef } from "@angular/core";
import { GameComponent } from "@components/game/game/game.component";
import { SubsystemRootContainerType, GameApplication, GameMap, IGridConfiguration } from "@models/business";
import { StateService } from "app/services/state.service";
import { Container, Graphics, Size } from "pixi.js";
import { Observable, of } from "rxjs";
import { IPerMapSubsystem } from "./subsystem";


@Injectable({
  providedIn: GameComponent
})
export class BackgroundRenderingSubsystem implements IPerMapSubsystem {
  public static readonly DependencyName = 'BackgroundRenderingSubsystem';
  private readonly rootContainerType = SubsystemRootContainerType.BackgroundColorContainer;
  private readonly stateService = inject(StateService);
  private appRef!: GameApplication;

  private perMapEffectRefs: EffectRef[] = [];

  public register(app: GameApplication): void {
    this.appRef = app;
  }

  public isRequired(): boolean {
    return true;
  }

  public getDependencies(): string[] {
    return [];
  }

  public onBeforeMapDestroy(): Observable<void> {
    let currentMap = this.stateService.currentMap();
    let rootContainer = this.appRef.board.getBoardChild(this.rootContainerType, currentMap.id)!;
    this.destroyRootContainer(rootContainer);
    this.perMapEffectRefs.forEach(mapEffect => mapEffect.destroy());
    return of();
  }

  public onAfterMapInit(): Observable<void> {
    let currentMap = this.stateService.currentMap();

    let rootContainer = this.createOrEnableRootContainer();

    let mapResizeEffectRef = this.appRef.effectWithRender(() => this.resizeRootContainer(rootContainer, currentMap.mapTileConfiguration()));
    this.perMapEffectRefs.push(mapResizeEffectRef);
    // Container size does not have any meaning, containers always have size as their children
    // But it resizes masks and background, so it will actually change the size of map container as well

    let mapBackgroundColorChangeEffectRef = this.appRef.effectWithRender(() => this.changeBackgroundColor(rootContainer, currentMap.backgroundColor()));
    this.perMapEffectRefs.push(mapBackgroundColorChangeEffectRef);

    return of();
  }

  private createOrEnableRootContainer(): Container {
    var currentMap = this.stateService.currentMap();
    let rootContainer = this.appRef.board.getBoardChild(this.rootContainerType, currentMap.id);
    if (rootContainer) {
      rootContainer.visible = true;
    } else {
      rootContainer = this.createRootContainer(currentMap);
    }
    return rootContainer;
  }


  private createRootContainer(map: GameMap): Container {
    let rootContainer = this.appRef.board.createBoardChild(this.rootContainerType, map.id);
    const mapSize = {height: map.mapTileConfiguration().mapHeight, width: map.mapTileConfiguration().mapWidth};

    const background = new Graphics({ label: BackgroundColorInternalContainers.Background })
      .rect(0, 0, mapSize.width, mapSize.height)
      .fill(map.backgroundColor());
    rootContainer.addChild(background);

    return rootContainer;
  }

  private resizeRootContainer(rootContainer: Container, mapTileConfiguration: IGridConfiguration){
    const size: Size = { height: mapTileConfiguration.mapHeight, width: mapTileConfiguration.mapWidth };

    let backgroundContainer = rootContainer.getChildByLabel(BackgroundColorInternalContainers.Background)!;
    backgroundContainer.setSize(size);
  }

  private changeBackgroundColor(rootContainer: Container, backgroundColor: string): void {
    let background = rootContainer.getChildByLabel(BackgroundColorInternalContainers.Background)! as Graphics;
    background.fill(backgroundColor);
  }

  private destroyRootContainer(rootContainer: Container){
    rootContainer.destroy();
  }

}

enum BackgroundColorInternalContainers {
  Background = 'Background-color-background',
}
