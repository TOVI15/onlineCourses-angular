import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date',
  standalone: true
})
export class DatePipe implements PipeTransform {

  transform(value: string, format: string = 'dd/MM/yyyy'): string {
    return formatDate(value, format, 'en-US');
  }

}
