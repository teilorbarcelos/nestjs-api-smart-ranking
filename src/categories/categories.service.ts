import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { category } = createCategoryDto;
    const categoryExists = await this.categoryModel
      .findOne({ category })
      .exec();

    if (categoryExists) {
      throw new BadRequestException('Categoria já cadastrada!');
    }

    const createdCategory = await this.categoryModel.create(createCategoryDto);
    return await createdCategory.save();
  }

  async getCategories(): Promise<Category[]> {
    return await this.categoryModel.find().populate('players').exec();
  }

  async getCategoryById(_id: string): Promise<Category> {
    const category = await this.categoryModel.findOne({ _id }).exec();

    if (!category) {
      throw new BadRequestException('Categoria não cadastrada!');
    }

    return category;
  }

  async updateCategory(
    _id: string,
    updateCategory: UpdateCategoryDto,
  ): Promise<Category> {
    const categoryExists = await this.categoryModel.findOne({ _id }).exec();

    if (!categoryExists) {
      throw new NotFoundException('Categoria não cadastrada!');
    }

    return await this.categoryModel
      .findOneAndUpdate({ _id }, { $set: updateCategory })
      .exec();
  }

  async getCategoryByPlayerId(playerId: any): Promise<Category> {
    const players = await this.playersService.getPlayers();
    const playerFilter = players.filter((player) => player._id == playerId);

    if (playerFilter.length == 0) {
      throw new BadRequestException(`Jogador não cadastrado!`);
    }

    return await this.categoryModel
      .findOne()
      .where('players')
      .in(playerId)
      .exec();
  }

  async addPlayerCategory(params: {
    categoryId: string;
    playerId: string;
  }): Promise<Category> {
    const { categoryId, playerId } = params;

    const categoryExists = await this.categoryModel
      .findOne({ _id: categoryId })
      .exec();
    const playerAlreadyAdded = await this.categoryModel
      .findOne({ _id: categoryId })
      .where('players')
      .equals(playerId)
      .exec();

    if (playerAlreadyAdded) {
      throw new BadRequestException('Jogador já está nesta categoria!');
    }

    await this.playersService.getPlayerById(playerId);

    if (!categoryExists) {
      throw new NotFoundException('Categoria não cadastrada!');
    }

    categoryExists.players.push(playerId);
    return await this.categoryModel
      .findOneAndUpdate({ _id: categoryId }, { $set: categoryExists })
      .exec();
  }
}
