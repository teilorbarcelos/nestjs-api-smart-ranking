import { Body, Controller, Post } from '@nestjs/common';
import { createPlayerDto } from 'src/dto/create-player.dto';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createUpdatePlayer(@Body() createPlayer: createPlayerDto) {
    return JSON.stringify(
      await this.playersService.createUpdatePlayer(createPlayer),
    );
  }
}
