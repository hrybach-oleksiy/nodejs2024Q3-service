import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import Artist from './artist.interface';
import { TracksService } from 'src/tracks/tracks.service';
import { AlbumsService } from 'src/albums/albums.service';

@Injectable()
export class ArtistsService {
  constructor(
    private readonly tracksService: TracksService,
    private readonly albumsService: AlbumsService,
  ) {}

  private artists: Artist[] = [];

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid artist ID format');
    }

    const track = this.artists.find((artist) => artist.id === id);

    if (!track) {
      throw new NotFoundException('Artist not found');
    }

    return track;
  }

  create(createArtistDto: CreateArtistDto) {
    if (!createArtistDto.name || createArtistDto.grammy === undefined) {
      throw new BadRequestException('Body does not contain required fields');
    }

    const newArtist = {
      id: uuidv4(),
      ...createArtistDto,
    };
    this.artists.push(newArtist);

    return newArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    if (
      !updateArtistDto ||
      updateArtistDto.grammy === undefined ||
      !updateArtistDto.name
    ) {
      throw new BadRequestException('Body does not contain required fields');
    }

    if (!isUuid(id)) {
      throw new BadRequestException('Invalid artist ID format');
    }

    const artist = this.artists.find((track) => track.id === id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;

    return artist;
  }

  remove(id: string) {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid artist ID format');
    }

    const index = this.artists.findIndex((artist) => artist.id === id);

    if (index === -1) {
      throw new NotFoundException('Artist not found');
    }

    this.artists.splice(index, 1);

    this.tracksService.nullifyArtistIdInTracks(id);
    this.albumsService.nullifyArtistIdInAlbums(id);
  }
}
