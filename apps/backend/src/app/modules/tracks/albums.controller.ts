import { Controller, Get, Param } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { Album } from '../../entities/album';

@Controller('albums')
export class AlbumsController {

  constructor(
    private readonly albumsService: AlbumsService,
  ) {
  }

  @Get(':id')
  async get(
    @Param('id') spotifyId: string,
  ): Promise<Album> {
    return this.albumsService.getById(spotifyId);
  }
}
