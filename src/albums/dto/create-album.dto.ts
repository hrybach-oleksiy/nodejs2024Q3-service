import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  artistId: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;
}
