import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToString'
})
export class EnumToStringPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 31:
        return 'Morning';
      case 32:
        return 'MidDay';
      case 33:
        return 'Evening';
      case 34:
        return 'Night';
      default:
        return 'Unknown';
    }
  }
}
