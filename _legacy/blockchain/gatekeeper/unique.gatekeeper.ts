import { Gatekeeper } from './gatekeeper';
import { Injectable, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '../../config/config.module';
import { SubmittableResult, WsProvider } from '@polkadot/api';
import { unique } from '@unique-nft/types/definitions';
import { Observable, OperatorFunction } from 'rxjs';
import { GenericEventData } from '@polkadot/types/generic/Event';
import { filter, map, mergeAll, pluck } from 'rxjs/operators';
import {
  CollectionMode,
  CollectionSchemaVersion,
  CreateCollectionArguments,
  CreateTokenArguments,
  MetaUpdatePermission,
} from './unique.types';
import { IField, INamespace } from 'protobufjs';


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

interface NFTMetaRequired<T> {
  NFTMeta: {
    fields: {
      [key in keyof T]: IField;
    };
  },
}

interface NFTAttributesValues<T> {
  [k: string]: {
    options: {
      [k: string]: {
        en: string;
        ru?: string;
      }; // "{\"en\":\"five\"}",
    },
    values: {
      [k: string]: number;
    },
  };
}

type NFTMeta<T> = NFTMetaRequired<T> | NFTMetaRequired<T> & NFTAttributesValues<T>;

@Injectable()
export class UniqueGatekeeper extends Gatekeeper {

  public getCreateCollectionArguments<T= any>({
                                        name,
                                        description,
                                        tokenPrefix,
                                        variableOnChainSchema,
                                        constOnChainSchema,
                                        limits,
                                        owner,
                                        mintMode,
                                      }: {
                                        name: string;
                                        description: string;
                                        tokenPrefix: string;
                                        variableOnChainSchema: {
                                          collectionCover: string;
                                        },
                                        constOnChainSchema: NFTMeta<T>;
                                        limits: CreateCollectionArguments['limits'];
                                        owner?: string;
                                        mintMode?: boolean;
                                      },
  ): CreateCollectionArguments {
    return {
      name,
      description,
      tokenPrefix,
      constOnChainSchema: {
        "nested": {
          "onChainMetaData": {
            "nested": {
              NFTMeta: constOnChainSchema.NFTMeta,
              ... Object.keys(constOnChainSchema)
                        .filter(k => k !== 'NFTMeta')
                        .reduce((acc, k) => {
                          return {
                            ... acc,
                            [k]: {
                              options: Object.keys(constOnChainSchema[k].options)
                                             .reduce((optAcc, optK) => {
                                return {
                                  ... optAcc,
                                  [optK]: JSON.stringify(constOnChainSchema[k].options[optK]),
                                };
                              }, {}),
                              values: constOnChainSchema[k].values,
                            },
                          }
                        }, {})
            }
          }
        },
      },
      owner,
      limits: {
        ownerCanDestroy: true,
        ownerCanTransfer: true,
        transfersEnabled: true,
        // accountTokenOwnershipLimit: 1, // todo add to root collection
        ...limits,
      },
      offchainSchema: "",
      sponsorship: {
        address: this.keyPair.address,
        isConfirmed: false,
      },
      schemaVersion: CollectionSchemaVersion.Unique,
      address: this.keyPair.address,
      variableOnChainSchema: JSON.stringify(variableOnChainSchema),
      mode: CollectionMode.Nft,
      transfersEnabled: true,
      metaUpdatePermission: MetaUpdatePermission.Admin, // token updates
      mintMode: mintMode === undefined ? false : mintMode, // set true if allowList can mint
    }
  }

  public async createCollection(
    collectionJson: CreateCollectionArguments,
  ): Promise<number> {
    return this.createAndSubmitExtrinsic(
      'post',
      'collection',
      collectionJson,
    ).pipe(
      getDataFromCommonEvent('CollectionCreated'),
      map((data) => {
        return parseInt(data[0].toString(), 10);
      }),
    ).toPromise();
  }

  public async createToken(
    tokenJson: CreateTokenArguments,
  ): Promise<{
    collectionId: number;
    tokenId: number;
    owner: string;
  }> {
    return this.createAndSubmitExtrinsic(
      'post',
      'token',
      tokenJson,
    ).pipe(
      getDataFromCommonEvent('ItemCreated'),
      map((data) => {
        return {
          collectionId: parseInt(data[0].toString(), 10),
          tokenId: parseInt(data[1].toString(), 10),
          owner: (data[2].toJSON() as { substrate: string }).substrate,
        };
      }),
    ).toPromise()
  }

}


@Module({
  imports: [
    Gatekeeper.HttpModule((configService: ConfigService<Config>) => ({
      baseURL: configService.get<Config['unique']>('unique').webGate,
      headers: {
        Authorization: 'Seed ' + configService.get<Config['unique']>('unique').seed,
      },
    })),
  ],
  providers: [
    Gatekeeper.Connect<UniqueGatekeeper>(
      UniqueGatekeeper,
      (configService) => {
        const { wss } = configService.get<Config['unique']>('unique');
        const provider = new WsProvider(wss);
        return {
          provider,
          rpc: {
            unique: unique.rpc,
          },
        };
      },
      (configService) => {
        return configService.get<Config['unique']>('unique').seed;
      },
    ),
  ],
  exports: [
    UniqueGatekeeper,
  ],
})
export class UniqueGatekeeperModule {}
