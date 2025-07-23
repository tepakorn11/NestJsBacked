// src/common/pipes/buddhist-date.pipe.ts

import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class BuddhistDatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value && typeof value === 'object') {
      const fieldsToConvert = ['start_working', 'end_working'];

      for (const field of fieldsToConvert) {
        if (value[field] && this.isBuddhistYear(value[field])) {
          value[field] = this.convertBEtoAD(value[field]);
        }
      }
    }
    return value;
  }

  private isBuddhistYear(dateStr: string): boolean {
    const [year] = dateStr.split('-');
    return parseInt(year) >= 2400;
  }

  private convertBEtoAD(dateStr: string): string {
    const [year, month, day] = dateStr.split('-');
    const adYear = parseInt(year) - 543;
    return `${adYear}-${month}-${day}`;
  }
}
