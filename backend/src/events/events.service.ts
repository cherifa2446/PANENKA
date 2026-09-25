import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  getEvents() {
    return [
      {
        id: 1,
        title: 'Panenka FC vs Montréal',
        date: '2026-10-04',
      },
      {
        id: 2,
        title: 'Panenka FC vs Laval',
        date: '2026-10-11',
      },
    ];
  }
}