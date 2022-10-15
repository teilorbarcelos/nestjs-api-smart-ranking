import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './interfaces/category.interface';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @Get()
  async getCategories(): Promise<Category[]> {
    return await this.categoriesService.getCategories();
  }

  @Get('/:_id')
  async getCategory(@Param('_id') _id: string): Promise<Category> {
    return await this.categoriesService.getCategoryById(_id);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Param('_id') _id: string,
    @Body() updateCategory: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.updateCategory(_id, updateCategory);
  }

  @Post('/:categoryId/players/:playerId')
  async addPlayerCategory(
    @Param() params: { categoryId: string; playerId: string },
  ): Promise<any> {
    return await this.categoriesService.addPlayerCategory(params);
  }
}
