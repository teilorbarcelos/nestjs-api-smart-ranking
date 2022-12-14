import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  Query,
  Put,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { AddChallengePlayDto } from './dto/add-challenge-play.dto';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Body() createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    return await this.challengesService.create(createChallengeDto);
  }

  @Get()
  async findAll(@Query('playerId') playerId: string): Promise<Challenge[]> {
    if (playerId)
      return await this.challengesService.findAllByPlayerId(playerId);
    return await this.challengesService.findAll();
  }

  @Get('/:_id')
  async findOne(@Param('_id') _id: string): Promise<Challenge> {
    return await this.challengesService.findChallengeById(_id);
  }

  @Put('/:_id')
  @UsePipes(ChallengeStatusValidationPipe)
  async update(
    @Param('_id') _id: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge> {
    return await this.challengesService.updateChallenge(
      _id,
      updateChallengeDto,
    );
  }

  @Post('/:challenge_id/play')
  async addChallengePlay(
    @Body(ValidationPipe) addChallengePlayDto: AddChallengePlayDto,
    @Param('challenge_id') challenge_id: string,
  ): Promise<Challenge> {
    return await this.challengesService.addChallengePlay(
      challenge_id,
      addChallengePlayDto,
    );
  }

  @Delete('/:_id')
  remove(@Param('_id') _id: string): Promise<Challenge> {
    return this.challengesService.removeChallenge(_id);
  }
}
