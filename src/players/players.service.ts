import { Injectable, Logger } from '@nestjs/common';
import { createPlayerDto } from 'src/dto/create-player.dto';
import { Player } from 'src/interfaces/player.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [];
  private readonly logger = new Logger(PlayersService.name);

  async createUpdatePlayer(createPlayer: createPlayerDto) {
    this.logger.log(`criar jogador: ${createPlayer}`);

    return this.create(createPlayer);
  }

  private create(createPlayer: createPlayerDto): Player {
    const { name, email, phoneNumber } = createPlayer;
    const player: Player = {
      _id: uuid(),
      name,
      phoneNumber,
      email,
      ranking: 'A',
      rankingPosition: 1,
      imageUrl: 'https://github.com/teilorbarcelos.png',
    };
    this.players.push(player);
    return player;
  }
}
