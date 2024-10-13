import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'name',
  standalone: true,
})
export class PathToNamePipe implements PipeTransform {
  transform(value: string): string {
    const segments = value.split('/');
    return segments[segments.length - 1];
  }
}
