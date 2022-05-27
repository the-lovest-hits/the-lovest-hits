import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ArtistsService } from '../artists/artists.service';
import { Config } from '../config/config.module';
import { filter, map, mergeAll, pluck, switchMap } from 'rxjs/operators';
import { catchError, Observable, of, OperatorFunction, Subscriber, TeardownLogic, throwError } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Method } from 'axios';
import { ApiPromise, SubmittableResult } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { GenericEventData } from '@polkadot/types/generic/Event';
import { stringToU8a } from '@polkadot/util';
import { Bytes } from '@polkadot/types-codec';
import { Registry } from '@polkadot/types/types';

class ArtistCollectionSchema {
  mode = 'Nft';
  access = 'Normal';
  schemaVersion: "Unique";
  name = "Sample collection name";
  description = "sample collection description";
  tokenPrefix = "TEST";
  mintMode = true;
  offchainSchema = "";
  sponsorship: null | {
    address: string;
    isConfirmed: boolean;
  } = null;
  limits = {
    accountTokenOwnershipLimit: null,
    sponsoredDataSize: null,
    sponsoredDataRateLimit: null,
    tokenLimit: null,
    sponsorTransferTimeout: null,
    sponsorApproveTimeout: null,
    ownerCanTransfer: null,
    ownerCanDestroy: null,
    transfersEnabled: null,
  };
  constOnChainSchema = {
    "nested": {
      "onChainMetaData": {
        "nested": {
          "NFTMeta": {
            "fields": {
              "ipfsJson": {
                "id": 1,
                "rule": "required",
                "type": "string"
              },
            }
          }
        }
      }
    }
  };
  variableOnChainSchema: string;
  metaUpdatePermission = "ItemOwner";
  address: string;

  constructor({ registry, sponsor, address }: ArtistCollectionOptions) {
    if (sponsor) {
      this.sponsorship = {
        address: sponsor,
        isConfirmed: true,
      }
    }

    this.address = address;

    // @ts-ignore
    this.variableOnChainSchema = JSON.stringify({
      collectionCover: "QmQFUZmza4hpwLFdwfLZCRsb8u6tLgFTkJx3Fxeazm4CDJ",
    }); // todo fix on sdk
  }
}

interface ArtistCollectionOptions {
  registry: Registry;
  sponsor?: string;
  address: string;
}

function getDataFromCommonEvent(filterMethod: string): OperatorFunction<SubmittableResult, GenericEventData> {
  return (source: Observable<SubmittableResult>) => {
    return source.pipe(
      pluck('events'),
      mergeAll(),
      pluck('event'),
      filter(({section, method}) => {
        return section === 'common' && method === filterMethod;
      }),
      pluck('data'),
    );
  }
}


@Injectable()
export class BlockchainService {

  constructor(
    @Inject(forwardRef(() => ArtistsService)) private readonly artistsService: ArtistsService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly api: ApiPromise,
  ) {
  }

  async mintArtistCollection(
    id: string,
    owner?: string,
  ): Promise<number> {
    const artist = await this.artistsService.getById(id);
    const { address } = this.configService.get<Config['unique']>('unique');

    return this.createAndSubmitExtrinsic(
      'post',
      'collection',
      new ArtistCollectionSchema({
        address,
        sponsor: address,
        registry: this.api.registry,
      }),
    ).pipe(
      getDataFromCommonEvent('CollectionCreated'),
      map((data) => {
        return parseInt(data[0].toString(), 10);
      }),
    ).toPromise();
  }

  async mintArtist(
    id: string,
  ): Promise<{
    collectionId: number;
    tokenId: number;
    owner: {
      substrate: string;
    };
  }> {

    const artist = await this.artistsService.getById(id);
    const { collectionId, address }: Config['unique'] = this.configService.get<Config['unique']>('unique');

    const mintRequest = {
      address,
      collectionId,
      constData: {
        ipfsJson: "{\"ipfs\":\"QmQFUZmza4hpwLFdwfLZCRsb8u6tLgFTkJx3Fxeazm4CDJ\",\"type\":\"image\"}",
        name: artist.name,
        id: artist.id,
        coll_id: String(artist.collectionId),
        Genres: [ 1,2 ], // todo genres
      },
    };

    return this.createAndSubmitExtrinsic(
      'post',
      'token',
      mintRequest,
    ).pipe(
      getDataFromCommonEvent('ItemCreated'),
      map((data) => {
        return {
          collectionId: parseInt(data[0].toString(), 10),
          tokenId: parseInt(data[1].toString(), 10),
          owner: data[2].toJSON() as { substrate: string },
        };
      }),
    ).toPromise();

  }

  private createExtrinsic(args: any): SubmittableExtrinsic {
    const { signerPayloadJSON, signature, signatureType } = args;
    const { method, version, address } = signerPayloadJSON;

    // todo 'ExtrinsicSignature' -> enum ExtrinsicTypes {} ?
    const signatureWithType = this.api.registry
                                  .createType('ExtrinsicSignature', { [signatureType]: signature })
                                  .toHex();

    // verifyTxSignatureOrThrow(this.sdk.api, signerPayloadJSON, signature);

    // todo 'Extrinsic' -> enum ExtrinsicTypes {} ? SubmittableExtrinsic
    const extrinsic = this.api.registry.createType('Extrinsic', {
      method,
      version,
    });

    extrinsic.addSignature(address, signatureWithType, signerPayloadJSON);

    return this.api.tx(extrinsic);
  }

  private createAndSubmitExtrinsic(method: Method, url: string, data: any): Observable<SubmittableResult> {
    return this.httpService.request({
      method,
      url,
      data,
    }).pipe(
      pluck('data'),
      switchMap((unsignedExtrinsic) => {
        return this.httpService.post(
          'extrinsic/sign',
          unsignedExtrinsic,
        ).pipe(
          pluck('data'),
          map((signature) => {
            return this.createExtrinsic({
              ... unsignedExtrinsic,
              ... signature,
            });
          }),
        );
      }),
      switchMap((extrinsic: SubmittableExtrinsic) => {
        return new Observable<SubmittableResult>((subscriber: Subscriber<SubmittableResult>): TeardownLogic => {
          const unsub = extrinsic.send((result: SubmittableResult) => {
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
      }),
    );
  }

}
