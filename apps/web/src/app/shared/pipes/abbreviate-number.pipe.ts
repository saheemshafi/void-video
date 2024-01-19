import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';

@Pipe({
  name: 'abbreviateNumber',
})
export class AbbreviateNumberPipe implements PipeTransform {
  
  decimalPipe: DecimalPipe = new DecimalPipe('en-us');

  transform(value: number): string | null {
    if (value >= 1000000) {
      return this.decimalPipe.transform(value / 1000000, '1.0-1') + 'm';
    } else if (value >= 1000) {
      return this.decimalPipe.transform(value / 1000, '1.0-0') + 'k';
    } else {
      return this.decimalPipe.transform(value, '1.0-0');
    }
  }
}
