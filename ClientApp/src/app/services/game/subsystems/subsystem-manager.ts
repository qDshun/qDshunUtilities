import { DestroyRef, Injector, runInInjectionContext } from "@angular/core";
import { StateService } from "../../state.service";
import { GameApplication } from "./game-application";
import { IPerMapSubsystem, ISubsystem } from "./subsystem";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

export class SusbsystemManager {
  private globalSubsystems: ISubsystem[] = [];
  private perMapSubsystems: IPerMapSubsystem[] = [];

  constructor(private gameApplication: GameApplication, private stateService: StateService, private destroyRef: DestroyRef, private injectionContext: Injector) {
    runInInjectionContext(injectionContext, () => {
      this.stateService.onBeforeMapDestroyed$
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.perMapSubsystems.forEach(perMapSubsystem => perMapSubsystem.onBeforeMapDestroy());
      });

      this.stateService.onAfterMapInit$
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.perMapSubsystems.forEach(perMapSubsystem => perMapSubsystem.onAfterMapInit());
      });

    });
  }

  public registerGlobalSubsystem(subsystem: ISubsystem){
    subsystem.register(this.gameApplication);
  }

  public registerPerMapSubsystem(perMapSubsystem: IPerMapSubsystem){
    perMapSubsystem.register(this.gameApplication);
    this.perMapSubsystems.push(perMapSubsystem);
  }
}
