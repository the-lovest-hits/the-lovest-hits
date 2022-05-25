import { Module } from '@nestjs/common';
import { GlobalConfigModule } from './modules/config/config.module';
import { SpotifyModule } from './modules/spotify/spotify.module';

@Module({
  imports: [
    GlobalConfigModule,
    SpotifyModule,
  ],
})
export class AppModule {}
