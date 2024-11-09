import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import Album from './album.intarface';

@Injectable()
export class AlbumsService {
  private albums: Album[] = [];

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid album ID format');
    }

    const album = this.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  create(createAlbumDto: CreateAlbumDto) {
    if (!createAlbumDto.name || !createAlbumDto.year) {
      throw new BadRequestException('Body does not contain required fields');
    }

    const newAlbum = {
      id: uuidv4(),
      ...createAlbumDto,
    };
    this.albums.push(newAlbum);

    return newAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (!updateAlbumDto || !updateAlbumDto.year || !updateAlbumDto.name) {
      throw new BadRequestException('Body does not contain required fields');
    }

    if (!isUuid(id)) {
      throw new BadRequestException('Invalid artist ID format');
    }

    const album = this.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException('Artist not found');
    }

    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;

    return album;
  }

  remove(id: string) {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid artist ID format');
    }

    const index = this.albums.findIndex((artist) => artist.id === id);

    if (index === -1) {
      throw new NotFoundException('Artist not found');
    }

    this.albums.splice(index, 1);
  }

  nullifyArtistIdInAlbums(artistId: string): void {
    this.albums = this.albums.map((album) =>
      album.artistId === artistId ? { ...album, artistId: null } : album,
    );
  }
}
