import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { createPlayerDto } from 'src/dto/create-player.dto';
import { Player } from 'src/interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createUpdatePlayer(@Body() createPlayer: createPlayerDto) {
    return JSON.stringify(
      await this.playersService.createUpdatePlayer(createPlayer),
    );
  }

  @Get()
  async getPlayers(@Query('email') email: string): Promise<Player[] | Player> {
    if (email) {
      return await this.playersService.getPlayerByEmail(email);
    }
    return await this.playersService.getPlayers();
  }

  @Delete()
  async deletePlayer(@Query('email') email: string): Promise<Player> {
    return await this.playersService.deletePlayer(email);
  }
}
