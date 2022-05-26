import { Controller, Get, Param } from '@nestjs/common';
import { Artist } from '../../entities/artist';
import { ArtistsService } from './artists.service';

@Controller('artists')
export class ArtistsController {

  constructor(
    private artistsService: ArtistsService,
  ) {
  }

  @Get(':id')
  async get(
    @Param('id') spotifyId: string,
  ): Promise<Artist> {
    return this.artistsService.getById(spotifyId);
  }
}
