import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AlbumsService } from 'src/albums/albums.service';
import { TracksService } from 'src/tracks/tracks.service';
import { ArtistsService } from 'src/artists/artists.service';

@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly albumService: AlbumsService,
    private readonly trackService: TracksService,
    private readonly artistService: ArtistsService,
  ) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('/track/:id')
  async addTrackToFavorites(@Param('id') id: string) {
    this.favoritesService.validateUuid(id);

    const track = this.trackService.findOne(id);

    this.favoritesService.entityExists(track, id);

    return this.favoritesService.addTrackToFavorites(track);
  }

  @Delete('/track/:id')
  @HttpCode(204)
  removeTrackFromFavorites(@Param('id') id: string) {
    this.favoritesService.validateUuid(id);
    this.favoritesService.removeTrackFromFavorites(id);
  }

  @Post('/album/:id')
  async addAlbumToFavorites(@Param('id') id: string) {
    this.favoritesService.validateUuid(id);

    const album = this.albumService.findOne(id);

    this.favoritesService.entityExists(album, id);

    return this.favoritesService.addAlbumToFavorites(album);
  }

  @Delete('/album/:id')
  @HttpCode(204)
  removeAlbumFromFavorites(@Param('id') id: string) {
    this.favoritesService.validateUuid(id);
    this.favoritesService.removeAlbumFromFavorites(id);
  }

  @Post('/artist/:id')
  async addArtistToFavorites(@Param('id') id: string) {
    this.favoritesService.validateUuid(id);

    const artist = this.artistService.findOne(id);

    this.favoritesService.entityExists(artist, id);

    return this.favoritesService.addArtistToFavorites(artist);
  }

  @Delete('/artist/:id')
  @HttpCode(204)
  removeArtistFromFavorites(@Param('id') id: string) {
    this.favoritesService.validateUuid(id);
    this.favoritesService.removeArtistFromFavorites(id);
  }
}
