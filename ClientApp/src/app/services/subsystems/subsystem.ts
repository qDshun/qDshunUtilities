import { GameApplication } from "@models/business";

export interface ISubsystem {
  register(app: GameApplication): void;

  isRequired(): boolean;

  //TODO: change it to have easy dependency tracking and validation
  getDependencies(): string[];
}

export interface IPerMapSubsystem extends ISubsystem {

  onAfterMapInit(): void;

  onBeforeMapDestroy(): void;
}
