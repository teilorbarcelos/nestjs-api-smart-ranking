import {
  BadRequestException,
  Injectable,
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

  async create(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    await this.playersService.getPlayerById(createChallengeDto.challenger._id);

    const isChallengerIncluded = createChallengeDto.players.find(
      (player) => player._id === createChallengeDto.challenger._id,
    );

    if (!isChallengerIncluded) {
      throw new BadRequestException(
        'O desafiante não está incluso no desafio!',
      );
    }

    const categories = await this.categoriesService.getCategories();

    const hasChallengerCategory = categories.find((category) =>
      category.players.includes(createChallengeDto.challenger._id),
    );

    if (hasChallengerCategory) {
      throw new BadRequestException(
        'O desafiante não possui ainda uma categoria!',
      );
    }

    const newChallenge = {
      ...createChallengeDto,
      status: ChallengeStatus.PENDING,
    };

    const createdChallenge = await this.challengeModel.create(newChallenge);

    return await createdChallenge.save();
  }

  async findAllByPlayerId(playerId: string): Promise<Challenge[]> {
    return await this.challengeModel
      .find()
      .where('players')
      .equals({ _id: playerId })
      .populate('players')
      .exec();
  }

  async findAll(): Promise<Challenge[]> {
    return await this.challengeModel.find();
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

    if (challengeExists) {
      return await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: updateChallengeDto })
        .exec();
    }

    if (challengeExists.status === ChallengeStatus.PENDING) {
      throw new NotAcceptableException(
        'O status informado do desafio é inválido!',
      );
    }

    throw new NotFoundException('Desafio não cadastrado!');
  }

  async removeChallenge(
    _id: string,
  ): Promise<{ acknowledged: boolean; deletedCount: number }> {
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
