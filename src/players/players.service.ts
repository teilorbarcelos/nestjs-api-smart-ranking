import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  async createUpdatePlayer(createPlayer: createPlayerDto) {
    const { email } = createPlayer;
    // const playerExists = this.players.find((player) => player.email === email);
    // this.logger.log(`criar jogador: ${createPlayer}`);

    const playerExists = await this.playerModel.findOne({ email }).exec();

    if (playerExists) {
      const updatePlayer: updatePlayerDto = {
        _id: playerExists._id,
        ...createPlayer,
        ranking: 'A',
        rankingPosition: 1,
        imageUrl: 'https://github.com/teilorbarcelos.png',
      };
      return this.update(updatePlayer);
    }

    return this.create(createPlayer);
  }

  async getPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
    // return this.players;
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const player = await this.playerModel.findOne({ email }).exec();
    if (!player) {
      throw new NotFoundException(`E-mail não cadastrado: ${email}`);
    }
    return player;
  }

  async deletePlayer(email: string): Promise<Player> {
    return await this.playerModel.remove({ email }).exec();

    // const player = this.players.find((player) => player.email === email);
    // if (!player) {
    //   throw new NotFoundException(`E-mail não cadastrado: ${email}`);
    // }
    // this.players = this.players.filter((player) => player.email !== email);
    // return player;
  }

  private async create(createPlayer: createPlayerDto): Promise<Player> {
    const createdPlayer = new this.playerModel(createPlayer);
    return await createdPlayer.save();

    // const { name, email, phoneNumber } = createPlayer;
    // const player: Player = {
    //   _id: uuid(),
    //   name,
    //   phoneNumber,
    //   email,
    //   ranking: 'A',
    //   rankingPosition: 1,
    //   imageUrl: 'https://github.com/teilorbarcelos.png',
    // };
    // this.players.push(player);
    // return player;
  }

  private async update(updatePlayer: updatePlayerDto): Promise<Player> {
    return await this.playerModel
      .findOneAndUpdate({ _id: updatePlayer._id }, { $set: updatePlayer })
      .exec();

    // this.players = this.players.map((player) => {
    //   if (player._id === updatePlayer._id) {
    //     return updatePlayer;
    //   }
    //   return player;
    // });
    // return updatePlayer;
  }
}
