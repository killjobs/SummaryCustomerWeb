import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency',
  standalone: true
})
export class CustomNumberPipe implements PipeTransform {

  transform(value: number): string  {
     if (isNaN(value)) return '$ 0';
    const formatted = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `$ ${formatted}`;
  }

}
