import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { SpotifyService } from './spotify.service';
import { catchError, of, pluck, throwError } from 'rxjs';

const prefix = 'spotify';

@Controller(prefix)
export class SpotifyController {

  constructor(
    private spotifyService: SpotifyService,
  ) {
  }

  @Get('*')
  async everything(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: Record<string, string>,
  ) {

    const url = req.url.split('/').filter(p => !!p && p !== prefix).join('/');

    this.spotifyService.http.get(
      url,
      {
        params: query || undefined,
      },
    ).pipe(
      pluck('data'),
    ).subscribe((response) => {
      res.send(response);
    }, (error) => {
      res.status(error.response.status).send(error.response.data);
    });
  }
}
