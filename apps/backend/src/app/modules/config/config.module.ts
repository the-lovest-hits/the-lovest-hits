import { ConfigModule } from '@nestjs/config';
import * as process from 'process';

export type Config = {
  port: number;
  prefix: string;
  spotifyApiEndpoint: string;
  spotifyAccountsEndpoint: string;
  spotifyClientId: string;
  spotifyClientSecret: string;
};

const loadConfig = (): Config => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  prefix: process.env.PREFIX || '',
  spotifyApiEndpoint: process.env.SPOTIFY_API_ENDPOINT,
  spotifyAccountsEndpoint: process.env.SPOTIFY_ACCOUNTS_ENDPOINT,
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export const GlobalConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [loadConfig],
});
