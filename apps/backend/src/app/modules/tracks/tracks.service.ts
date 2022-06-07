import { Track } from '../../entities/track';
import { isBefore, sub } from 'date-fns';
import { pluck } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Album } from '../../entities/album';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from './albums.service';
import { SpotifyService } from '../spotify/spotify.service';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { Artist } from '../../entities/artist';
import { BlockchainService } from '../blockchain/blockchain.service';
import { EventsService } from '../events/events.service';
import { EventType } from '../../entities/event';
import { forwardRef, Inject } from '@nestjs/common';

export class TracksService {
  constructor(
    @InjectRepository(Track) private readonly trackRepository: Repository<Track>,
    @InjectRepository(Album) private readonly albumRepository: Repository<Album>,
    @Inject(forwardRef(() => ArtistsService)) private readonly artistsService: ArtistsService,
    private readonly albumsService: AlbumsService,
    private readonly spotifyService: SpotifyService,
    private readonly blockchainService: BlockchainService,
    @Inject(forwardRef(() => EventsService)) private readonly eventsService: EventsService,
  ) {
  }

  getReleases({
    skip,
    take,
  }: FindManyOptions<Track>): Promise<[Track[], number]> {
    return this.trackRepository.findAndCount({
      take,
      skip,
      where: {
        collectionId: Not(0),
      },
    });
  }

  async getById(id: string, withAlbum = false): Promise<Track> {

    const options = {};

    if (withAlbum) {
      options['relations'] = ['album'];
    }

    let track = await this.trackRepository.findOne(id, options);

    if (!track || isBefore(track.updated, sub(new Date(), { months: 1}))) {
      const spotify = await this.spotifyService.http.get(`tracks/${id}`).pipe(
        pluck('data'),
      ).toPromise();
      track = track || this.trackRepository.create();
      track.id = spotify.id;
      track.name = spotify.name;
      track.popularity = spotify.popularity;
      track.spotifyUri = spotify.uri;
      track.trackNumber = spotify.track_number;
      track.album = await this.albumsService.getById(spotify.album.id);
      track.artist = track.album.artist;
      await this.trackRepository.save(track);
    }

    return track;
  }

  async getMintExtrinsic(
    id: Track['id'],
    address: string,
    fields: {
      image: string;
      description: string; // todo add to collection
    },
  ): Promise<any> {

  }

  async create(
    id: Track['id'],
    address: string,
    fields: {
      image: string;
      description: string; // todo add to collection
    },
  ): Promise<any> {
    const track = await this.getById(id, true);

    const { collectionId, tokenId } = await this.blockchainService.mintTrackToken(
      track,
      fields.image,
      address,
    );

    track.collectionId = collectionId;
    track.tokenId = tokenId;
    track.ipfsPin = fields.image;
    await this.trackRepository.save(track);

    this.eventsService.createAndSave({
      track,
      artist: track.artist,
      from: address,
      to: address,
      type: EventType.TrackTokenCreated,
      meta: {
        collectionId,
        tokenId,
      },
    }).then();

    await this.blockchainService.removeAddressFromWhiteList(
      address,
      track.artist.collectionId,
    );

    this.eventsService.createAndSave({
      track,
      artist: track.artist,
      from: address,
      to: address,
      type: EventType.RemovedFromWhiteList,
      meta: {
        address,
        collectionId,
      },
    }).then();
  }
}
