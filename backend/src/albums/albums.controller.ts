import { Controller, Get } from '@nestjs/common';
import { AlbumsService } from './albums.service.js';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  findAll() {
    return this.albumsService.findAll();
  }
}