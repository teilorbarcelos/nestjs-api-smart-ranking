import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
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
}
