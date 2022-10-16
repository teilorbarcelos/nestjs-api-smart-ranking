import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';
import { ChallengeStatus } from './challenge-status.enum';

export interface Challenge extends Document {
  date: Date;
  status: ChallengeStatus;
  solicitationDate: Date;
  answerDate: Date;
  challenger: Player;
  category: string;
  players: Player[];
  play: Play;
}

export interface Play extends Document {
  category: string;
  players: Player[];
  def: Player;
  result: Result[];
}

export interface Result {
  set: string;
}
