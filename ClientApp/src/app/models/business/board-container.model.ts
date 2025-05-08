import { UnrecoverableError } from "@services";
import { ContainerChild, Container, Graphics } from "pixi.js";
import { ContainerType } from ".";

export class BoardContainer<T extends ContainerChild = ContainerChild> extends Container<T> {

  getOrCreateBoardChild(this: Container, containerType: ContainerType, id: string) {
    let target = this.getChildByLabel(containerType + id);
    if (target) {
      return target;
    }
    target = new Container({ width: this.width, height: this.height, label: containerType + id });
    this.addChild(target);
    return target;
  }

  getExistingBoardChild(this: Container, containerType: ContainerType, id: string) {
    const child = this.getChildByLabel(containerType + id);
    if (!child){
      throw new UnrecoverableError(`Missing container with id ${containerType + id} that should exist`);
    }
    return child;
  }

  getBoardChild(this: Container, containerType: ContainerType, id: string) {
    return this.getChildByLabel(containerType + id);
  }

  createBoardChild(this: Container, containerType: ContainerType, id: string) {
    const parentWidth = this.width;
    const parentHeight = this.height;

    const background = new Graphics({ alpha: 0 }).rect(0, 0, this.width, this.height).fill(0xFFFFFF);
    const child = this.addChild(new Container({
      width: parentWidth,
      height: parentHeight,
      label: containerType + id
    }));

    //Add opaque background to make container full-size instead of child size and be able to track events;
    child.addChild(background);
    return child;
  }
}
