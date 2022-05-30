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
    @Inject(forwardRef(() => ArtistsService)) private readonly artistsService: ArtistsService,
    private readonly configService: ConfigService<Config>,
    private readonly uniqueGatekeeper: UniqueGatekeeper,
    @InjectRepository(Genre) private readonly genreRepository: Repository<Genre>,
  ) {
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
