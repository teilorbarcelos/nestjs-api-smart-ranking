import { Body, Controller, Post } from '@nestjs/common';
import { createPlayerDto } from 'src/dto/create-player.dto';

@Controller('api/v1/players')
export class PlayersController {
  @Post()
  async createUpdatePlayer(@Body() createPlayer: createPlayerDto) {
    const { email } = createPlayer;
    return JSON.stringify({ email: email });
  }
}
