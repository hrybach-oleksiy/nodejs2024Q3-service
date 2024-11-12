import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  artistId: string;

  albumId: string;

  @IsNotEmpty()
  duration: number;
}
