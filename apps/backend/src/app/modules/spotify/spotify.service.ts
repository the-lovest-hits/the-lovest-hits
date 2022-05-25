import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config/config.module';
import { Observable, pluck, repeatWhen, Subject, switchMap, first } from 'rxjs';
import { AxiosRequestHeaders, AxiosResponse, HeadersDefaults } from 'axios';

@Injectable()
export class SpotifyService {

  private logger = new Logger('Spotify');

  private readonly tokenExpired$: Subject<void> = new Subject();
  private readonly token$: Observable<string> = this.auth().pipe(
    pluck('data', 'access_token'),
    repeatWhen(() => this.tokenExpired$),
  );

  constructor(
    public readonly http: HttpService,
    private readonly config: ConfigService<Config>,
  ) {
    this.http.axiosRef.interceptors.response.use(
      (response) => response,
      (error) => {
        const { response, config } = error;
        if (response.status === 401) {

          this.logger.warn(`Token has expired, or wrong`);

          this.tokenExpired$.next();
          return this.token$.pipe(
            first(),
            switchMap((token: string) => {
              this.augmentHeadersByAuth(config.headers, token);
              return this.http.axiosRef.request(config);
            }),
          ).toPromise();
        }
        return Promise.reject(error);
      }
    );
    this.token$.subscribe((token: string) => {
      this.logger.log(`Set new auth token ${token}`);
      this.augmentHeadersByAuth(
        this.http.axiosRef.defaults.headers,
        token,
      );
    });
  }

  private augmentHeadersByAuth(headers: AxiosRequestHeaders | HeadersDefaults, token: string) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  private auth(): Observable<AxiosResponse<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }>> {

    const form = new URLSearchParams();
    form.append('grant_type', 'client_credentials');

    return this.http.post('token', form, {
      headers: {
        ContentType: 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' +
          (
            new Buffer(this.config.get('spotifyClientId')
            + ':' +
            this.config.get('spotifyClientSecret')
          ).toString('base64')),
      },
      baseURL: this.config.get('spotifyAccountsEndpoint'),
    });
  }
}
