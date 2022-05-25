import { Module } from '@nestjs/common';
import { SpotifyController } from './spotify.controller';
import { SpotifyService } from './spotify.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config/config.module';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService<Config>) => ({
        baseURL: configService.get('spotifyApiEndpoint'),
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [
    SpotifyController,
  ],
  providers: [
    SpotifyService,
  ],
})
export class SpotifyModule {}
