import { Controller, Get, Param, Query } from '@nestjs/common';
import { Track } from '../../entities/track';
import { TracksService } from './tracks.service';

@Controller('tracks')
export class TracksController {

  constructor(
    private readonly tracksService: TracksService,
  ) {
  }

  @Get('releases')
  async getReleases(
    @Query('page') page: number,
    @Query('take') take: number = 10,
  ): Promise<{
    items: Track[],
    pages: number,
  }> {
    const [items, count] = await this.tracksService.getReleases({
      take,
      skip: (page - 1) * take,
    });
    return {
      items,
      pages: Math.ceil(count / take),
    };
  }

  @Get(':id')
  async get(
    @Param('id') spotifyId: string,
  ): Promise<Track> {
    return this.tracksService.getById(spotifyId);
  }

}
