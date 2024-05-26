/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormArray, FormControl, FormGroup } from '@angular/forms';

type IsEnum<T> = T extends { [key: string]: infer U } ? U extends T[keyof T] ? true : false : false;

export type ControlsOf<T> = {
  [K in keyof T]: T[K] extends Record<any, any>
    ? T[K] extends any[]
      ? FormArray
      : T[K] extends Date | number | boolean | IsEnum<T[K]>
        ? FormControl<T[K]>
        : FormGroup<ControlsOf<T[K]>>
    : FormControl<T[K]>;
};
