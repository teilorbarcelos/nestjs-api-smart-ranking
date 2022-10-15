import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';

export interface Category extends Document {
  readonly category: string;
  description: string;
  events: CategoryEvent[];
  players: Player[];
}

export interface CategoryEvent {
  name: string;
  operation: string;
  value: number;
}
