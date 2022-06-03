import { Body, Controller, Get, NotFoundException, Param, Post, Query, Res } from '@nestjs/common';
import { Artist } from '../../entities/artist';
import { ArtistsService } from './artists.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config/config.module';

export enum ArtistMintingStatus {
  ValidatePayment,
  MintingArtistCollection,
  MintingArtistToken,
  SaveInfo,
  AddingToWhiteList,
  Complete,
}

@Controller('artists')
export class ArtistsController {

  // todo cache
  private mintingStatus = new Map<Artist['id'], ArtistMintingStatus>();

  constructor(
    private readonly artistsService: ArtistsService,
    private readonly blockchainService: BlockchainService,
    private readonly configService: ConfigService,
  ) {
  }

  @Get(':id')
  async get(
    @Param('id') id: string,
  ): Promise<Artist> {
    return this.artistsService.getById(id);
  }

  @Get(':id/price')
  async getPrice(
    @Param('id') id: string,
  ): Promise<{ price: number, commission: number }> {
    return this.artistsService.getArtistPrice(id);
  }

  @Get('mint-settings')
  async getMintSettings(): Promise<any> {
    return {
      descriptionLength: 256 - this.configService.get<Config['market']>('market').collectionDescPostfix.length,
      collectionId: +this.configService.get<Config['unique']>('unuque').collectionId,
    }
  }

  @Get(':id/mint')
  async getMintPaymentExtrinsic(
    @Param('id') id: string,
    @Query('address') address: string,
  ): Promise<any> {
    return this.blockchainService.createMintExtrinsic(
      id,
      address,
      (await this.artistsService.getArtistPrice(id)).price,
    );
  }

  @Post(':id/mint')
  async mintPayment(
    @Param('id') id: Artist['id'],
    @Body('extrinsic') extrinsic: any,
    @Body('fields') artistFields: {
      tokenPrefix: string;
      description: string;
    },
    @Res() res: Response,
  ): Promise<any> {

    this.artistsService.create(id,
      extrinsic.signerPayloadJSON.address,
      {
      collectionCover: 'QmQFUZmza4hpwLFdwfLZCRsb8u6tLgFTkJx3Fxeazm4CDJ', // todo request
      ... artistFields,
    }).then();

    res.status(201).send({ hello: 'chuvak' });

  }

  @Get(':id/mint_status')
  async mintStatus(
    @Param('id') id: Artist['id'],
  ): Promise<ArtistMintingStatus> {
    if (!this.mintingStatus.has(id)) {
      throw new NotFoundException();
    }
    return this.mintingStatus.get(id);
  }
}
