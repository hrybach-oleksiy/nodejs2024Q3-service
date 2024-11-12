import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validate as isUuid } from 'uuid';
import Track from 'src/tracks/track.interface';
import Album from 'src/albums/album.intarface';
import Artist from 'src/artists/artist.interface';
import { FavoritesResponse } from './favorites.interface';

@Injectable()
export class FavoritesService {
  private favoriteTracks: Track[] = [];
  private favoriteAlbums: Album[] = [];
  private favoriteArtists: Artist[] = [];

  public validateUuid(id: string) {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
  }

  public entityExists(entity, id: string) {
    if (!entity) {
      throw new UnprocessableEntityException(
        `Entity with id ${id} does not exist`,
      );
    }
  }

  findAll(): FavoritesResponse {
    return {
      artists: this.favoriteArtists,
      albums: this.favoriteAlbums,
      tracks: this.favoriteTracks,
    };
  }

  addTrackToFavorites(track: Track): { message: string } {
    this.favoriteTracks.push(track);
    return { message: 'Track added to favorites' };
  }

  removeTrackFromFavorites(id: string) {
    const index = this.favoriteTracks.findIndex((track) => track.id === id);
    if (index === -1)
      throw new NotFoundException('Track not found in favorites');
    this.favoriteTracks.splice(index, 1);
  }

  addAlbumToFavorites(album: Album): { message: string } {
    this.favoriteAlbums.push(album);
    return { message: 'Album added to favorites' };
  }

  removeAlbumFromFavorites(id: string) {
    const index = this.favoriteAlbums.findIndex((album) => album.id === id);
    if (index === -1)
      throw new NotFoundException('Album not found in favorites');
    this.favoriteAlbums.splice(index, 1);
  }

  addArtistToFavorites(artist: Artist): { message: string } {
    this.favoriteArtists.push(artist);
    return { message: 'Artist added to favorites' };
  }

  removeArtistFromFavorites(id: string) {
    const index = this.favoriteArtists.findIndex((artist) => artist.id === id);
    if (index === -1)
      throw new NotFoundException('Artist not found in favorites');
    this.favoriteArtists.splice(index, 1);
  }
}
