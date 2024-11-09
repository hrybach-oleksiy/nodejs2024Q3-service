import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import Track from './track.interface';

@Injectable()
export class TracksService {
  private tracks: Track[] = [];

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid track ID format');
    }

    const track = this.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  create(createTrackDto: CreateTrackDto): Track {
    if (!createTrackDto.duration || !createTrackDto.name) {
      throw new BadRequestException('Body does not contain required fields');
    }

    const newTrack = {
      id: uuidv4(),
      ...createTrackDto,
    };

    this.tracks.push(newTrack);

    return newTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    if (!updateTrackDto || !updateTrackDto.duration || !updateTrackDto.name) {
      throw new BadRequestException('Body does not contain required fields');
    }

    if (!isUuid(id)) {
      throw new BadRequestException('Invalid track ID format');
    }

    const track = this.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    track.name = updateTrackDto.name;
    track.artistId = updateTrackDto.artistId;
    track.albumId = updateTrackDto.albumId;
    track.duration = updateTrackDto.duration;

    return track;
  }

  remove(id: string) {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid track ID format');
    }

    const index = this.tracks.findIndex((track) => track.id === id);

    if (index === -1) {
      throw new NotFoundException('Track not found');
    }

    this.tracks.splice(index, 1);
  }

  nullifyArtistIdInTracks(artistId: string): void {
    this.tracks = this.tracks.map((track) =>
      track.artistId === artistId ? { ...track, artistId: null } : track,
    );
  }
}
