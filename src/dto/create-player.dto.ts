import { IsNotEmpty, IsEmail } from 'class-validator';

export class createPlayerDto {
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  name: string;
}
