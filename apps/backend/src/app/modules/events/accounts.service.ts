import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../entities/account';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account) private readonly accountRepository: Repository<Account>,
  ) {
  }

  async getByAddress(address: string): Promise<Account> {
    let acc = await this.accountRepository.findOne({ address });
    if (!acc) {
      acc = this.accountRepository.create({ address });
      await this.accountRepository.save(acc);
    }
    return acc;
  }
}
