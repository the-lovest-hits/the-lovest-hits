import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { Track } from '../../entities/track';
import { TracksService } from './tracks.service';
import { Response } from 'express';

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

  @Get(':id/mint')
  async getMintExtrinsic(
    @Param('id') id: string,
    @Param('address') address: string,
  ): Promise<any> {

  }

  @Post(':id/mint')
  async mint(
    @Param('id') id: string,
    @Body('extrinsic') extrinsic: any,
    @Body('fields') trackFields: {
      image: string;
      description: string;
    },
    @Res() res: Response,
  ): Promise<any> {

    const { address } = extrinsic.signerPayloadJSON;

    this.tracksService.create(
      id,
      address,
      trackFields,
    ).then(console.log);

    res.status(201).send({ hello: 'chuvak' });
  }

}
