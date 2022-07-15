import { Injectable } from '@nestjs/common';
import { Config } from '../config/config.module';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import {
  CreateCollectionNewRequest, ExtrinsicResultEvent,
  ExtrinsicResultResponse, SubmitResponse,
  SubmitTxBody,
  UnsignedTxPayloadResponse,
} from './types/api';
import { Keyring } from '@polkadot/keyring';
import {
  BehaviorSubject, delay, interval,
  last,
  Observable,
  of,
  pluck, repeat,
  repeatWhen,
  Subject,
  switchMap, takeUntil,
  takeWhile,
  tap, timer,
} from 'rxjs';
import { SubmittableResult } from '@polkadot/api';
import { map } from 'rxjs/operators';
import { extrinsics } from '@polkadot/types/interfaces/definitions';
import { u8aToHex } from '@polkadot/util';
import { waitReady } from '@polkadot/wasm-crypto';



@Injectable()
export class BlockchainService {

  private keyRing = new Keyring({
    ss58Format: 42, // todo get from bc
    // type: 'sr25519',
  });
  private keyPair = this.keyRing.addFromMnemonic(
    this.configService.get<Config['unique']>('unique').seed,
  );

  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly httpService: HttpService,
  ) {
  }

  signSubmitAndWatch(extrinsic: UnsignedTxPayloadResponse):
    Observable<ExtrinsicResultEvent[]>
  {
    const signature = u8aToHex(this.keyPair.sign(extrinsic.signerPayloadHex, { withType: true}));
    const signed: SubmitTxBody = {
      signature,
      ... extrinsic,
    }

    return this.httpService.post<SubmitResponse>(
      'extrinsic/submit',
      signed,
    ).pipe(
      pluck('data', 'hash'),
      switchMap((hash) => {
        return this.httpService.get<ExtrinsicResultResponse>('extrinsic/status', {
          params: { hash },
        }).pipe(
          pluck('data'),
          repeatWhen(() => {
            return interval(3000).pipe(delay(3000));
          }),
          takeWhile(({ isCompleted }) => !isCompleted, true),
          last(),
          pluck('events'),
        );
      }),
    );
  }

  async createRootCollection(): Promise<number> {
    const request: CreateCollectionNewRequest = {
      mode: 'Nft',
      name: 'My',
      tokenPrefix: 'OWN',
      description: 'collection',
      address: this.keyPair.address,
      schema: {
        "coverPicture": {
          "urlInfix": "https://ipfs.uniquenetwork.dev/ipfs/QmetcHKzG44kDCut4f2hEybeQbxjiLAwcLmGpQaYnLk8ZR/{infix}.png",
          "hash": "image206"
        },
        "image": {
          "urlTemplate": "https://ipfs.uniquenetwork.dev/ipfs/{infix}"
        },
        "schemaName": "unique",
        "schemaVersion": "1.0.0",
        attributesSchemaVersion: '1.0.0',
        attributesSchema: {
          "0": {
            name: {
              en: "name",
            },
            optional: false,
            type: "string",
            kind: "freeValue",
          },
        },
      },
    }

    return this.httpService.post<UnsignedTxPayloadResponse>(
      'collection-new',
      request,
    ).pipe(
      pluck('data'),
      switchMap((extrinsic: UnsignedTxPayloadResponse) => {
        return this.signSubmitAndWatch(extrinsic).pipe(
          map((events) => {
            const { data } = events.find(e => e.section === 'common' && e.method === 'CollectionCreated');
            return parseInt(data[0], 10);
          }),
        );
      }),
    ).toPromise();
  }


}
