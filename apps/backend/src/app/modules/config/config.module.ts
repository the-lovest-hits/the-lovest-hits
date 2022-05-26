import { ConfigModule } from '@nestjs/config';
import * as process from 'process';

export type Config = {
  port: number;
  prefix: string;
  spotifyApiEndpoint: string;
  spotifyAccountsEndpoint: string;
  spotifyClientId: string;
  spotifyClientSecret: string;
  postgres: {
    port: number;
    host: string;
    username: string;
    password: string;
    database: string;
  };
};

const loadConfig = (): Config => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  prefix: process.env.PREFIX || '',
  spotifyApiEndpoint: process.env.SPOTIFY_API_ENDPOINT,
  spotifyAccountsEndpoint: process.env.SPOTIFY_ACCOUNTS_ENDPOINT,
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  postgres: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  }
});

export const GlobalConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [loadConfig],
});
