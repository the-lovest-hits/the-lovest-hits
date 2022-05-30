import { Controller, Get, Param, Post } from '@nestjs/common';
import { Artist } from '../../entities/artist';
import { ArtistsService } from './artists.service';
import { BlockchainService } from '../blockchain/blockchain.service';

@Controller('artists')
export class ArtistsController {

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

  @Get(':id/mint')
  async mint(
    @Param('id') id: string,
  ): Promise<any> {
    // return await this.blockchainService.mintArtistCollection(id);
    // return await this.blockchainService.mintArtist(id);

  }
}
