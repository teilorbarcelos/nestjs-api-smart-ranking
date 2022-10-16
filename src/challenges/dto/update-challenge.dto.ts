import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';

export class UpdateChallengeDto {
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsString()
  @IsNotEmpty()
  status: ChallengeStatus;
}
