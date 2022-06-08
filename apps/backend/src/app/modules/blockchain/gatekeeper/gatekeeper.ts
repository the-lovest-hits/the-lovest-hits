import { ApiPromise, SubmittableResult } from '@polkadot/api';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Config } from '../../config/config.module';
import { DynamicModule, Provider } from '@nestjs/common';
import { HttpModuleOptions } from '@nestjs/axios/dist/interfaces';
import { ApiOptions } from '@polkadot/api/types';
import { Method } from 'axios';
import { catchError, Observable, Subscriber, TeardownLogic, throwError } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { SubmitTxArguments, UnsignedTxPayload } from '@unique-nft/sdk/types';

type GatekeeperProviderFactory<T> = (configService: ConfigService<Config>) => T;

interface GatekeeperClass<T extends Gatekeeper> {
  new(
    gate: HttpService,
    apiOptions: ApiOptions,
    mnemonic?: string,
  ): T;
}

export class Gatekeeper extends ApiPromise {

  static HttpModule(
    useFactory: GatekeeperProviderFactory<HttpModuleOptions>,
  ): DynamicModule {
    return HttpModule.registerAsync({
      useFactory,
      inject: [ConfigService],
    });
  }

  static Connect<T extends Gatekeeper>(
    ClassType: GatekeeperClass<T>,
    optionsFactory: GatekeeperProviderFactory<ApiOptions>,
    mnemonicFactory?: GatekeeperProviderFactory<string>,
  ): Provider<Promise<T>> {
    return {
      provide: ClassType,
      useFactory: async (configService: ConfigService<Config>, httpService) => {
        const options: ApiOptions = optionsFactory(configService);
        const gatekeeper = new ClassType(
          httpService,
          options,
          mnemonicFactory ? mnemonicFactory(configService) : undefined,
        );
        await gatekeeper.isReady;
        if (gatekeeper.mnemonic) {
          gatekeeper.keyPair = new Keyring({
            ss58Format: gatekeeper.registry.chainSS58,
            type: 'sr25519',
          }).addFromMnemonic(gatekeeper.mnemonic);
        }
        return gatekeeper;
      },
      inject: [
        ConfigService,
        HttpService,
      ]
    }
  }

  public keyPair: KeyringPair | undefined;

  constructor(
    public readonly gate: HttpService,
    apiOptions: ApiOptions,
    public readonly mnemonic?: string,
  ) {
    super(apiOptions);
  }

  public createAndSubmitExtrinsic(method: Method, url: string, data: any): Observable<SubmittableResult> {
    return this.gate.request({
      method,
      url,
      data,
    }).pipe(
      catchError(err => {
        console.error(JSON.stringify({ method, url }), err);
        return throwError(err);
      }),
      pluck('data'),
      switchMap((tx) => this.signAndSubmitExtrinsic(tx)),
    );
  }

  public submitExternalExtrinsic(signedExtrinsic: SubmitTxArguments): Observable<SubmittableResult> {
    return this.submitExtrinsic(
      this.createSubmittableExtrinsic(signedExtrinsic),
    );
  }

  public submitExtrinsic(submittable: SubmittableExtrinsic): Observable<SubmittableResult> {
    return new Observable<SubmittableResult>((subscriber: Subscriber<SubmittableResult>): TeardownLogic => {
      const unsub = submittable.send((result: SubmittableResult) => {
        const { events, status } = result;
        if (status.isReady || status.isBroadcast) {
          subscriber.next(result);
        } else if (status.isInBlock || status.isFinalized) {
          const errors = events.filter(e => e.event.data.method === 'ExtrinsicFailed');
          if (errors.length > 0) {
            subscriber.error(result);
          }
          if (events.filter(e => e.event.data.method === 'ExtrinsicSuccess').length > 0) {
            subscriber.next(result);
            subscriber.complete();
          }
        } else {
          subscriber.error(result);
        }
      });
      return () => unsub.then();
    });
  }

  public createSubmittableExtrinsic(signedExtrinsic: Partial<SubmitTxArguments>): SubmittableExtrinsic {

    const { signerPayloadJSON, signature } = signedExtrinsic;
    const { method, version, address } = signerPayloadJSON;

    const extrinsic = this.registry.createType('Extrinsic', {
      method,
      version,
    });

    const submittable = this.tx(extrinsic);

    if (signature) {
      submittable.addSignature(address, signature, signerPayloadJSON);
    }

    return submittable;
  }

  public signAndSubmitExtrinsic(unsignedExtrinsic: UnsignedTxPayload): Observable<SubmittableResult> {
    const submittable = this.createSubmittableExtrinsic(unsignedExtrinsic);
    // @ts-ignore
    submittable.sign(this.keyPair, unsignedExtrinsic.signerPayloadJSON);

    return this.submitExtrinsic(submittable);
  }

}
