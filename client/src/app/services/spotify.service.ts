import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';
import { TrackFeature } from '../data/track-feature';
import {PlaylistData} from "../data/playlist-data";

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://localhost:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //This function uses the injected http Service to make a get request to the Express endpoint and return the response.
    //the http service works similarly to fetch(). 
    return lastValueFrom(this.http.get(this.expressBaseUrl + endpoint)).then((response) => {
      return response;
    }, (err) => {
      return err;
    });
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  //TODO: identify the search endpoint in the express webserver (routes/index.js) and send the request to express.
  //Make sure you're encoding the resource with encodeURIComponent().
  //Depending on the category (artist, track, album, playlist, etc.), return an array of that type of data.
  //JavaScript's "map" function might be useful for this, but there are other ways of building the array.
  //JavaScript's "map" function might be useful for this, but there are other ways of building the array.

  searchFor(category:string, resource:string):Promise<PlaylistData[]> {
    const encodedResource = encodeURIComponent(resource);
    const endpoint = `/search/${category}/${encodedResource}`;
    return this.sendRequestToExpress(endpoint).then((data) => {
      return data.playlists.items.map((item: any) => new PlaylistData(item));
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    return null as any;
  }

  getRelatedArtists(artistId:string):Promise<ArtistData[]> {
    //TODO: use the related artist endpoint to make a request to express and return an array of artist data.
   return null as any;
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //TODO: use the top tracks endpoint to make a request to express.
    return null as any;
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //TODO: use the albums for an artist endpoint to make a request to express.
    return null as any;
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //TODO: use the album endpoint to make a request to express.
    return null as any;
  }

  getPlaylist(playlistId:string):Promise<PlaylistData> {
    const endpoint = `/playlist/${playlistId}`;
    return this.sendRequestToExpress(endpoint).then((data) => {
      return new PlaylistData(data);
    });
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //TODO: use the tracks for album endpoint to make a request to express.
    return null as any;
  }

  getTracksForPlaylist(playlistId:string):Promise<TrackData[]> {
    //TODO: use the tracks for playlist endpoint to make a request to express.
      const endpoint = `/playlist-tracks/${playlistId}`;
      return this.sendRequestToExpress(endpoint).then((data) => {
        return data.items.map((item: any) => new TrackData({
          name: item.track.name,
          id: item.track.id,
          artists: item.track.artists.map((artist) => artist.name),
          duration_ms: item.track.duration_ms,
        }));

      });
    }

  getTrack(trackId:string):Promise<TrackData> {
    //TODO: use the track endpoint to make a request to express.
    return null as any;
  }

  getAudioFeaturesForTrack(trackId:string):Promise<TrackFeature[]> {
    //TODO: use the audio features for track endpoint to make a request to express.
    return null as any;
  }

  getAudioFeaturesForTracks(trackIdsString:string):Promise<TrackFeature[]> {
    //TODO: use the audio features for track endpoint to make a request to express.
    const endpoint = `/tracks-audio-features/${trackIdsString}`;
    return this.sendRequestToExpress(endpoint).then((data) => {
      let count = 1; // Initialize the count to 1
      return data.audio_features.map((item: any) => new TrackFeature(
        item.id, item.danceability, item.energy,count++
      ));

    });
  }
}
