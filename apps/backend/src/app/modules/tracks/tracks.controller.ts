import { Controller, Get, Param } from '@nestjs/common';
import { Track } from '../../entities/track';
import { TracksService } from './tracks.service';

@Controller('tracks')
export class TracksController {

  constructor(
    private readonly tracksService: TracksService,
  ) {
  }

  @Get(':id')
  async get(
    @Param('id') spotifyId: string,
  ): Promise<Track> {
    return this.tracksService.getById(spotifyId);
  }
}
