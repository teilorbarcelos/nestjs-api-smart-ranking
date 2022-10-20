import {
  BadRequestException,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { Challenge } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private readonly logger = new Logger(ChallengesService.name);

  async create(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    const players = await this.playersService.getPlayers();
    createChallengeDto.players.map((player) => {
      if (players.filter((p) => p._id == player._id).length === 0) {
        throw new NotFoundException('Player not found');
      }
    });

    const isChallengerIncluded = createChallengeDto.players.find(
      (player) => player._id === createChallengeDto.challenger._id,
    );

    if (!isChallengerIncluded) {
      throw new BadRequestException(
        'O desafiante não está incluso no desafio!',
      );
    }

    const playerCategory = await this.categoriesService.getCategoryByPlayerId(
      createChallengeDto.challenger._id,
    );

    if (!playerCategory) {
      throw new BadRequestException(
        'O desafiante não possui ainda uma categoria!',
      );
    }

    const newChallenge = new this.challengeModel(createChallengeDto);
    newChallenge.category = playerCategory.category;
    newChallenge.date = new Date();
    newChallenge.status = ChallengeStatus.PENDING;

    this.logger.log(`Challenge created: ${JSON.stringify(newChallenge)}`);

    return await newChallenge.save();
  }

  async findAllByPlayerId(playerId: string): Promise<Challenge[]> {
    return await this.challengeModel
      .find()
      .where('players')
      .equals({ _id: playerId })
      .populate('players')
      .populate('partida')
      .exec();
  }

  async findAll(): Promise<Challenge[]> {
    return await this.challengeModel
      .find()
      .populate('challenger')
      .populate('players')
      .populate('partida')
      .exec();
  }

  async findChallengeById(_id: string): Promise<Challenge> {
    const challenge = await this.challengeModel.findOne({ _id }).exec();
    if (!challenge) {
      throw new NotFoundException(
        `Desafio não encontrado com o ID informado: ${_id}`,
      );
    }
    return challenge;
  }

  async updateChallenge(
    _id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge> {
    const challengeExists = await this.challengeModel.findOne({ _id }).exec();

    if (updateChallengeDto.status === ChallengeStatus.PENDING) {
      throw new NotAcceptableException(
        'O status informado do desafio é inválido!',
      );
    }

    if (challengeExists) {
      return await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: updateChallengeDto })
        .exec();
    }

    throw new NotFoundException('Desafio não cadastrado!');
  }

  async removeChallenge(_id: string): Promise<Challenge> {
    const challenge = await this.challengeModel.findOne({ _id }).exec();
    if (!challenge) {
      throw new NotFoundException(
        `Desafio não encontrado com o ID informado: ${_id}`,
      );
    }
    return await this.challengeModel.findOneAndUpdate(
      { _id },
      { $set: { status: ChallengeStatus.CANCELED } },
    );
  }
}
