import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from 'src/dto/create-player.dto';
import { UpdatePlayerDto } from 'src/dto/update-player.dto';
import { Player } from 'src/players/interfaces/player.interface';
import { ValidateParamsPipe } from '../common/pipes/validate-params.pipe';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayer: CreatePlayerDto): Promise<Player> {
    return await this.playersService.createPlayer(createPlayer);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Param('_id', ValidateParamsPipe) _id: string,
    @Body() updatePlayer: UpdatePlayerDto,
  ): Promise<Player> {
    return await this.playersService.updatePlayer(_id, updatePlayer);
  }

  @Get()
  async getPlayers(): Promise<Player[]> {
    return await this.playersService.getPlayers();
  }

  @Get('/:_id')
  async getPlayer(
    @Param('_id', ValidateParamsPipe) _id: string,
  ): Promise<Player> {
    return await this.playersService.getPlayerById(_id);
  }

  @Delete('/:_id')
  async deletePlayer(
    @Param('_id', ValidateParamsPipe) _id: string,
  ): Promise<{ acknowledged: boolean; deletedCount: number }> {
    return await this.playersService.deletePlayer(_id);
  }
}
