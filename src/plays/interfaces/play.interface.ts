import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';

export interface Play extends Document {
  def: string;
  result: Set[];
  players: Player[];
}

export interface Set {
  set: string;
}
