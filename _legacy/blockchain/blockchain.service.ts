import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ArtistsService } from '../artists/artists.service';
import { Config } from '../config/config.module';
import { ConfigService } from '@nestjs/config';
import { Registry } from '@polkadot/types/types';
import { Keyring } from '@polkadot/keyring';
import { UniqueGatekeeper } from './gatekeeper/unique.gatekeeper';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from '../../entities/genre';
import { Repository } from 'typeorm';
import { KusamaGatekeeper } from './gatekeeper/kusama.gatekeeper';
import { pluck } from 'rxjs/operators';
import { Artist } from '../../entities/artist';
import { Observable } from 'rxjs';
import { SubmittableResult } from '@polkadot/api';
import { Track } from '../../entities/track';
import { UniqueSdk } from '../../unique-sdk-provider';
import { KusamaSdk } from '../../kusama-sdk-provider';
import { SubmitTxArguments, UnsignedTxPayload } from '@unique-nft/sdk/types';

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



@Injectable()
export class BlockchainService {

  constructor(
    private readonly configService: ConfigService<Config>,
    public readonly uniqueGatekeeper: UniqueGatekeeper,
    public readonly kusamaGatekeeper: KusamaGatekeeper,
    @InjectRepository(Genre) private readonly genreRepository: Repository<Genre>,
    public readonly uniqueSdk: UniqueSdk,
    public readonly kusamaSdk: KusamaSdk,
  ) {
  }

  async createInitialPurchaseExtrinsic(
    id: string,
    address: string,
    amount: number,
  ): Promise<UnsignedTxPayload> {
    return this.kusamaSdk.balance.transfer({
      address,
      destination: this.kusamaGatekeeper.keyPair.address, // todo ksm
      amount,
    });
  }

  async createRootCollection(): Promise<number> {
    return this.uniqueGatekeeper.createCollection(
      this.uniqueGatekeeper.getCreateCollectionArguments({
        name: 'Root Collection',
        description: 'My Root coll',
        tokenPrefix: 'ROOT',
        variableOnChainSchema: {
          collectionCover: 'QmQFUZmza4hpwLFdwfLZCRsb8u6tLgFTkJx3Fxeazm4CDJ',
        },
        constOnChainSchema: {
          NFTMeta: {
            fields: {
              ipfsJson: {
                id: 1,
                rule: "required",
                type: "string",
              },
              Name: {
                id: 2,
                rule: "required",
                type: "string",
              },
              Genres: {
                id: 3,
                rule: "repeated",
                type: "Genre",
              },
              SpotifyUri: {
                id: 4,
                rule: "required",
                type: "string",
              },
              MintedBy: {
                id: 5,
                rule: "required",
                type: "string",
              },
              TracksCollectionId: {
                id: 6,
                rule: "required",
                type: "string",
              },
            },
          },
          Genre: await this.getGenreOptions(),
        },
        limits: {},
        owner: this.uniqueGatekeeper.keyPair.address,
      }),
    );
  }

  async getGenreOptions() {
    const genres: Genre[] = await this.genreRepository.find();
    return {
      options: Object.fromEntries(genres.map(({id, beautyName}) => {
        return [`field${id}`, {en: beautyName}];
      })),
      values: Object.fromEntries(genres.map(({id}) => {
        return [`field${id}`, id];
      })),
    }
  }

  transferArtistToken(
    tokenId: number,
    to: string,
    from = this.uniqueGatekeeper.keyPair.address,
  ): Promise<any> {

    return new Promise((resolve, reject) => {
      const tx = this.uniqueGatekeeper.tx.unique.transfer(
        {Substrate: to},
        +this.configService.get<Config['unique']>('unique').collectionId,
        tokenId,
        1,
      );
      tx.signAndSend(this.uniqueGatekeeper.keyPair, (result) => {
        const { events, status } = result;
        if (status.isReady || status.isBroadcast) {
          // resolve(result);
        } else if (status.isInBlock || status.isFinalized) {
          const errors = events.filter(e => e.event.data.method === 'ExtrinsicFailed');
          if (errors.length > 0) {
            reject(result);
          }
          if (events.filter(e => e.event.data.method === 'ExtrinsicSuccess').length > 0) {
            resolve(result);
          }
        } else {
          reject(result);
        }


      });
    });
  }

  async mintArtistToken(
    artist: Artist,
    cover: string,
    owner: string,
  ): Promise<{
    collectionId: number;
    tokenId: number;
    owner: string;
  }> {

    return this.uniqueGatekeeper.createToken({
      owner,
      collectionId: +this.configService.get<Config['unique']>('unique').collectionId,
      constData: {
        ipfsJson: JSON.stringify({
          ipfs: cover,
          type: "image",
        }),
        Name: artist.name,
        Genres: artist.genres.map(({ id }) => id),
        SpotifyUri: artist.spotifyUri,
        MintedBy: owner,
        TracksCollectionId: artist.collectionId,
      },
      address: this.uniqueGatekeeper.keyPair.address,
    });
  }

  async mintTrackToken(
    track: Track,
    cover: string,
    owner: string,
  ): Promise<any> {

    // @ts-ignore
    const allowList = await this.uniqueGatekeeper.rpc.unique.allowlist(track.artist.collectionId);

    const allowedToMint = !!allowList.toHuman().find(({ Substrate }) => Substrate === owner);

    if (!allowedToMint) {
      throw new Error(`Address ${owner} cannot mint token of this collections`);
    }

    return this.uniqueGatekeeper.createToken({
      // owner, // todo nesting
      collectionId: track.artist.collectionId,
      constData: {
        ipfsJson: JSON.stringify({
          ipfs: cover,
          type: "image",
        }),
        Name: track.name,
        SpotifyUri: track.spotifyUri,
        MintedBy: owner,
        Album: track.album.name,
        TrackNumber: String(track.trackNumber),
        ReleaseDate: track.album.releaseDate,
      },
      address: this.uniqueGatekeeper.keyPair.address,
    });
  }

  async addAddressToWhiteList(
    address: string,
    collectionId: number,
  ): Promise<any> {
    const tx = this.uniqueGatekeeper.tx.unique.addToAllowList(collectionId, {Substrate: address});
    tx.signAndSend(this.uniqueGatekeeper.keyPair, (result) => {
      // console.log('result', result);
    });

  }

  async removeAddressFromWhiteList(
    address: string,
    collectionId: number,
  ): Promise<any> {
    const tx = this.uniqueGatekeeper.tx.unique.removeFromAllowList(collectionId, {Substrate: address});
    tx.signAndSend(this.uniqueGatekeeper.keyPair, (result) => {
      // console.log('result', result);
    });
  }


  async mintArtistCollection({
    artist,
    tokenPrefix,
    description,
    collectionCover,
  }: {
    artist: Artist;
    description: string;
    tokenPrefix: string;
    collectionCover: string;
  }): Promise<number> {

    return this.uniqueGatekeeper.createCollection(
      this.uniqueGatekeeper.getCreateCollectionArguments({
        name: artist.name,
        tokenPrefix,
        description: description + this.configService.get<Config['market']>('market').collectionDescPostfix,
        variableOnChainSchema: {
          collectionCover,
        },
        constOnChainSchema: {
          NFTMeta: {
            fields: {
              ipfsJson: {
                id: 1,
                rule: "required",
                type: "string",
              },
              Name: {
                id: 2,
                rule: "required",
                type: "string",
              },
              SpotifyUri: {
                id: 3,
                rule: "required",
                type: "string",
              },
              MintedBy: {
                id: 4,
                rule: "required",
                type: "string",
              },
              Album: {
                id: 5,
                rule: "required",
                type: "string",
              },
              TrackNumber: {
                id: 6,
                rule: "required",
                type: "string",
              },
              ReleaseDate: {
                id: 7,
                rule: "required",
                type: "string",
              },
            },
          },
        },
        limits: {
          transfersEnabled: false,
        },
        mintMode: true,
        owner: this.uniqueGatekeeper.keyPair.address,
      }),
    );
  }

  // async mintArtistCollection(
  //   id: string,
  //   owner?: string,
  // ): Promise<number> {
  //   const artist = await this.artistsService.getById(id);
  //   const { address } = this.configService.get<Config['unique']>('unique');
  //
  //   return this.uniqueGatekeeper.createCollection(
  //     new ArtistCollectionSchema({
  //       address,
  //       sponsor: address,
  //       registry: this.uniqueGatekeeper.registry,
  //     }),
  //   );
  // }
  //
  // async mintArtist(
  //   id: string,
  // ): Promise<{
  //   collectionId: number;
  //   tokenId: number;
  //   owner: string;
  // }> {
  //
  //   const artist = await this.artistsService.getById(id);
  //   const { collectionId, address }: Config['unique'] = this.configService.get<Config['unique']>('unique');
  //
  //   const mintRequest = {
  //     address,
  //     collectionId,
  //     constData: {
  //       ipfsJson: "{\"ipfs\":\"QmQFUZmza4hpwLFdwfLZCRsb8u6tLgFTkJx3Fxeazm4CDJ\",\"type\":\"image\"}",
  //       name: artist.name,
  //       id: artist.id,
  //       coll_id: String(artist.collectionId),
  //       Genres: [ 1,2 ], // todo genres
  //     },
  //   };
  //
  //   return this.uniqueGatekeeper.createToken(
  //     mintRequest
  //   );

  // }



}
