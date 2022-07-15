import { Module } from '@nestjs/common';
import { Config, GlobalConfigModule } from './modules/config/config.module';
import { SpotifyModule } from './modules/spotify/spotify.module';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistsModule } from './modules/artists/artists.module';
import { Artist } from './entities/artist';
import { Genre } from './entities/genre';
import { TracksModule } from './modules/tracks/tracks.module';
import { Track } from './entities/track';
import { Album } from './entities/album';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { Event } from './entities/event';
import { Account } from './entities/account';

@Module({
  imports: [
    GlobalConfigModule,
    BlockchainModule,
    SpotifyModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<Config>) => ({
        type: 'postgres',
        entities: [
          Artist,
          Genre,
          Track,
          Album,
          Event,
          Account,
        ],
        synchronize: true,
        ... configService.get<Config['postgres']>('postgres'),
      }),
      inject: [ConfigService],
    }),
    ArtistsModule,
    TracksModule,
  ],
  providers: [
    // uniqueSdkProvider,
    // kusamaSdkProvider,
  ],
})
export class AppModule {}
