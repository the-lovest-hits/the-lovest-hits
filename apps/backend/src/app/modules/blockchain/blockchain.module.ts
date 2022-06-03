import { Global, Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { UniqueGatekeeperModule } from './gatekeeper/unique.gatekeeper';
import { KusamaGatekeeperModule } from './gatekeeper/kusama.gatekeeper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from '../../entities/genre';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Genre,
    ]),
    UniqueGatekeeperModule,
    KusamaGatekeeperModule,
  ],
  providers: [
    BlockchainService,
  ],
  exports: [
    BlockchainService,
  ],
})
export class BlockchainModule {}
