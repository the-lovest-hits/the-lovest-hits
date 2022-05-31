import { Body, Controller, Get, NotFoundException, Param, Post, Query, Res } from '@nestjs/common';
import { Artist } from '../../entities/artist';
import { ArtistsService } from './artists.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { Response } from 'express';

export enum ArtistMintingStatus {
  ValidatePayment,
  MintingArtistCollection,
  MintingArtistToken,
  SaveInfo,
  TransferToken,
  Complete,
}

@Controller('artists')
export class ArtistsController {

  // todo cache
  private mintingStatus = new Map<Artist['id'], ArtistMintingStatus>();

  constructor(
    private readonly artistsService: ArtistsService,
    private readonly blockchainService: BlockchainService,
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

  @Get(':id/mint')
  async getMintPaymentExtrinsic(
    @Param('id') id: string,
    @Query('address') address: string,
  ): Promise<any> {
    return this.blockchainService.createMintExtrinsic(
      id,
      address,
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

    // todo transaction mining
    console.log('ex', extrinsic, artistFields);

    this.mintingStatus.set(id, ArtistMintingStatus.ValidatePayment);
    // todo payment transaction mining
    this.mintingStatus.set(id, ArtistMintingStatus.MintingArtistCollection);
    this.blockchainService.mintArtistCollection({
      id: String(id),
      collectionCover: 'QmQFUZmza4hpwLFdwfLZCRsb8u6tLgFTkJx3Fxeazm4CDJ', // todo request
      ... artistFields,
    }).then((collectionId) => {
      console.log('collection id ', collectionId);
      this.mintingStatus.set(id, ArtistMintingStatus.MintingArtistToken);

      this.blockchainService.mintArtistToken(
        String(id),
        'QmQFUZmza4hpwLFdwfLZCRsb8u6tLgFTkJx3Fxeazm4CDJ',
        extrinsic.signerPayloadJSON.address,
        collectionId,
      ).then((tokenInfo) => {
        console.log('tokenInfo', tokenInfo);

        this.mintingStatus.set(id, ArtistMintingStatus.SaveInfo);

        this.artistsService.updateMintingInfo(
          id,
          collectionId,
          tokenInfo.tokenId,
        ).then(() => {
          this.mintingStatus.set(id, ArtistMintingStatus.TransferToken);

          // todo on sdk by minting
          this.blockchainService.transferArtistToken(
            tokenInfo.tokenId,
            extrinsic.signerPayloadJSON.address,
          ).then(() => {
            this.mintingStatus.set(id, ArtistMintingStatus.Complete);

            this.blockchainService.addAddressToWhiteList(
              extrinsic.signerPayloadJSON.address,
              collectionId,
            ).then(console.log);
          });
        });

      });
    });

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
