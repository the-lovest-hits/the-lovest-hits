import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { Artist } from '../../entities/artist';
import { ArtistsService } from './artists.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config/config.module';
import { EventsService } from '../events/events.service';
import { EventType } from '../../entities/event';
import { SubmitTxArguments } from '@unique-nft/sdk/types';


@Controller('artists')
export class ArtistsController {

  constructor(
    private readonly artistsService: ArtistsService,
    private readonly configService: ConfigService,
    private readonly eventsService: EventsService,
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
  async getInitialPurchaseExtrinsic(
    @Param('id') id: string,
    @Query('address') address: string,
  ): Promise<any> {
    // return this.blockchainService.createInitialPurchaseExtrinsic(
    //   id,
    //   address,
    //   (await this.artistsService.getArtistPrice(id)).price,
    // );
  }

  @Post(':id/mint')
  async mintPayment(
    @Param('id') id: Artist['id'],
    @Body('extrinsic') extrinsic: SubmitTxArguments,
    @Body('fields') artistFields: {
      tokenPrefix: string;
      description: string;
      collectionCover: string;
    },
    @Res() res: Response,
  ): Promise<any> {

    console.log('extrinsic', extrinsic);

    // const { address } = extrinsic.signerPayloadJSON
    //
    // this.eventsService.createAndSave({
    //   type: EventType.InitialPurchaseRequest,
    //   from: address,
    //   to: address,
    //   artist: id,
    // }).then();
    //
    // try {
    //   await this.blockchainService.kusamaGatekeeper.submitExternalExtrinsic(extrinsic).toPromise();
    //
    //   this.eventsService.createAndSave({
    //     type: EventType.PurchaseApproved,
    //     from: address,
    //     to: address,
    //     artist: id,
    //   }).then();
    //
    //   this.artistsService.create(id,
    //     address,
    //     {
    //       collectionCover: 'QmQFUZmza4hpwLFdwfLZCRsb8u6tLgFTkJx3Fxeazm4CDJ', // todo request
    //       ... artistFields,
    //     }).then();
    //
    // } catch (e) {
    //   console.error(e);
    //
    //   this.eventsService.createAndSave({
    //     type: EventType.PurchaseFailed,
    //     from: address,
    //     to: address,
    //     artist: id,
    //   }).then();
    // }
    //
    // res.status(201).send({});

  }
}
