import { Injectable } from '@nestjs/common';

@Injectable()
export class AlbumsService {

  findAll() {
    return [
      {
        id: 'canada-irlande',
        title: 'Canada vs Irlande',
        date: '2026-08-19',
        location: 'Montréal, Québec',
        competition: 'International',
      },
    ];
  }

}