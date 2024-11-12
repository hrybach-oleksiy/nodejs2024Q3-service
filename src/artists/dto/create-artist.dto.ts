import { IsString, IsNotEmpty } from 'class-validator';
export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  grammy: boolean;
}
