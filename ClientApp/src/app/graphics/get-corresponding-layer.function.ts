import { GameMap } from "../services/state.service";
import { ContainerType } from "./container-type.enum";


export function getCorrespondingLayer(map: GameMap, containerType: ContainerType) {
  switch (containerType) {
    case ContainerType.Background:
      return map.backgroundLayer;
    case ContainerType.Hidden:
      return map.hiddenLayer;
    case ContainerType.Interactable:
      return map.interactableLayer;
    default:
      throw new Error(`Container type ${containerType} not allowed`);
  }
}
