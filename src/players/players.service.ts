import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createPlayerDto } from 'src/dto/create-player.dto';
import { updatePlayerDto } from 'src/dto/update-player.dto';
import { Player } from 'src/interfaces/player.interface';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async createPlayer(createPlayer: createPlayerDto) {
    const { email } = createPlayer;
    const playerExists = await this.playerModel.findOne({ email }).exec();

    if (playerExists) {
      throw new BadRequestException('E-mail já cadastrado!');
    }

    const createdPlayer = new this.playerModel(createPlayer);
    return await createdPlayer.save();
  }

  async updatePlayer(_id: string, updatePlayer: updatePlayerDto) {
    const playerExists = await this.playerModel.findOne({ _id }).exec();

    if (playerExists) {
      return await this.playerModel
        .findOneAndUpdate({ _id }, { $set: updatePlayer })
        .exec();
    }

    throw new NotFoundException('Jogador não cadastrado!');
  }

  async getPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async getPlayerById(_id: string): Promise<Player> {
    const player = await this.playerModel.findOne({ _id }).exec();
    if (!player) {
      throw new NotFoundException(
        `Jogador não encontrado com o ID informado: ${_id}`,
      );
    }
    return player;
  }

  async deletePlayer(
    _id: string,
  ): Promise<{ acknowledged: boolean; deletedCount: number }> {
    return await this.playerModel.deleteOne({ _id });
  }
}
