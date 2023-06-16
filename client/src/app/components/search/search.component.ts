import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { TrackData } from '../../data/track-data';
import { ResourceData } from '../../data/resource-data';
import {PlaylistData} from "../../data/playlist-data";
import {TrackFeature} from "../../data/track-feature";
import embed from 'vega-embed';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [ SpotifyService ]
})
export class SearchComponent implements OnInit {
  searchString: string;
  searchInput: string;
  searchCategory: string = 'playlist';
  resources: ResourceData[];
  playlists:PlaylistData[];
  todayPlaylists:PlaylistData[];
  tracks:TrackData[];
  trackIds:string[];
  trackIdsString:string;
  trackFeatures:TrackFeature[];
  mergedData:(TrackData & TrackFeature)[] = [];
  isSearchPerformed:boolean = false;
  chosenPlaylist: PlaylistData;

  spec: VisualizationSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "title":"Music Features",
    "description": "Drag a rectangular brush to show your selected points.",
    "data": {"values": []} ,
    "transform": [
      {"window": [{"op": "row_number", "as": "row_number"}]},
      {"calculate": "'https://open.spotify.com/track/' + datum.id", "as": "link"},
      {"calculate": "datum.energy + datum.danceability", "as": "totalScore"}
    ],
    "hconcat": [
      {
        "width": 300,
        "height":300,
        "params": [
          {
            "name": "brush",
            "select": {"type": "interval", "encodings": ["x", "y"]}
          }
        ],
        "mark": {"type": "circle", "tooltip": true},
        "encoding": {
          "href": {"field": "link", "type": "nominal"},
          "x": {"field": "danceability", "type": "quantitative", "axis": {"title": "Danceability"},"scale": {"domain": [0, 1]}},
          "y": {"field": "energy", "type": "quantitative", "axis": {"title": "Energy"},"scale": {"domain": [0, 1]}},
          "color": {
            "condition": {"param": "brush", "field": "totalScore", "type": "quantitative","scale": {"range": ["lightyellow", "darkgreen"], "domain": [0, 2]}},
            "value": "lightgray"
          },

          "tooltip": [
            {"field": "count", "type": "quantitative", "title": "Count"},
            {"field": "name", "type": "string", "title": "Name"},
            {"field": "primaryArtist", "type": "string", "title": "Artist"},
            {"field": "durationStr", "type": "string", "title": "Duration"},
            {"field": "danceability", "type": "quantitative", "title": "Danceability"},
            {"field": "energy", "type": "quantitative", "title": "Energy"}
          ]
        }
      },
      {
        "transform": [
          {"filter": {"param": "brush"}},
          {"window": [{"op": "rank", "as": "rank"}]},
          {"filter": {"field": "rank", "lt": 101}}
        ],
        "concat": [
          {
            "width": 25,
            "title": "Count",
            "mark": "text",
            "encoding": {
              "text": {"field": "count", "type": "quantitative"},
              "y": {"field": "row_number", "type": "ordinal", "axis": null}
            }
          },
          {
            "width": 250,
            "title": "Name",
            "mark": {"type": "text", "align": "left","x": "1","limit":"220"},
            "encoding": {
              "text": {"field": "name", "type": "string"},
              "y": {"field": "row_number", "type": "ordinal", "axis": null}
            }
          },
          {
            "width": 100,
            "title": "Artist",
            "mark": {"type": "text","limit":"90"},
            // "mark": {"type": "text", "align": "left","x": "1","limit":"90","fill":"green"},
            "encoding": {
              "text": {"field": "primaryArtist", "type": "string"},
              "y": {"field": "row_number", "type": "ordinal", "axis": null}
            }
          },
          {
            "width": 50,
            "title": "Duration",
            "mark": {"type": "text"},
            // "mark": {"type": "text", "align": "left","x": "1","limit":"90","fill":"green"},
            "encoding": {
              "text": {"field": "durationStr", "type": "string"},
              "y": {"field": "row_number", "type": "ordinal", "axis": null}
            }
          },
          {
            "width": 50,
            "title": "Danceability",
            "mark": {"type": "text"},
            "encoding": {
              "text": {"field": "danceability", "type": "quantitative"},
              "y": {"field": "row_number", "type": "ordinal", "axis": null}
            }
          },
          {
            "width": 50,
            "title": "Energy",
            "mark": {"type": "text"},
            "encoding": {
              "text": {"field": "energy", "type": "quantitative"},
              "y": {"field": "row_number", "type": "ordinal", "axis": null}
            }
          }
        ]
      }
    ],
    "resolve": {"legend": {"color": "independent"}}
  };

    constructor(private spotifyService: SpotifyService) {
  }

  ngOnInit() {
    this.search()
  }

  search() {
    //TODO: call search function in spotifyService and parse response
    this.searchString = this.isSearchPerformed ? this.searchInput : "today";
    this.spotifyService.searchFor(this.searchCategory, this.searchString)
        .then((data) => {
          this.playlists = data;
          this.isSearchPerformed = true;
        });
  }
  /**
   * Get the playlists to be displayed.
   * @returns {PlaylistData[]} The playlists to be displayed.
   */
  getDisplayedPlaylists(): PlaylistData[] {
    if (this.playlists?.length === 0) {
      return this.todayPlaylists;
    } else {
      return this.playlists;
    }
  }
  /**
   * Show the tracks of the specified playlist.
   * @param {string} playlistId - The ID of the playlist.
   */
  showTracks(playlistId: string) {
    this.spotifyService.getTracksForPlaylist(playlistId)
        .then((tracks) => {
          this.tracks = tracks;
          this.trackIds = this.tracks.map((trackData) => trackData.id);
          this.trackIdsString = this.trackIds.join('%2C');
          this.showAudioFeaturesForTracks(this.trackIdsString);
          this.getChosenPlaylist(playlistId);
        });
  }
  /**
   * Get the chosen playlist.
   * @param {string} playlistId - The ID of the playlist.
   */
  getChosenPlaylist(playlistId: string) {
    this.spotifyService.getPlaylist(playlistId)
        .then((data) => {
          this.chosenPlaylist=data;
        });
  }
  /**
   * Show the audio features for the tracks.
   * @param {string} trackIdsString - The ID string of the tracks.
   */
  showAudioFeaturesForTracks(trackIdsString: string) {
    this.spotifyService.getAudioFeaturesForTracks(trackIdsString)
        .then((data) => {
          this.trackFeatures = data;
          this.mergedData = this.mergeData(this.tracks, this.trackFeatures);
          this.spec.data.values = this.mergedData;
          console.log(this.spec.data.values)
          embed("#vis", this.spec);
        });
  }

  /**
   * Merge the track data and track feature data.
   * @param {TrackData[]} tracks - The track data.
   * @param {TrackFeature[]} trackFeatures - The track feature data.
   * @returns {(TrackData & TrackFeature)[]} - The merged data.
   */
  mergeData(tracks: TrackData[], trackFeatures: TrackFeature[]): (TrackData & TrackFeature)[] {
    this.mergedData = []; // Clear the mergedData array before merging

    for (const track of tracks) {
      if (!trackFeatures || trackFeatures.length === 0) {
        console.log("trackFeatures is undefined or empty");
        return [];
      }
      const matchingFeature = this.trackFeatures.find((trackFeature) => trackFeature.id === track.id);

      if (matchingFeature) {
        const mergedTrack: TrackData & TrackFeature = {
          ...track,
          ...matchingFeature,
          durationStr: track.durationStr,
          percentageDanceability: '0', // Add the missing percentageDanceability property
          percentageEnergy: '0', // Add the missing percentageEnergy property
          colorDanceability: '', // Add the missing colorDanceability property
          colorEnergy: '', // Add the missing colorEnergy property
          primaryArtist:track.primaryArtist
        };
        this.mergedData.push(mergedTrack);
      }
    }
    return this.mergedData;
  }

}
interface VisualizationSpec {
  $schema: string;
  title:string;
  description: string;
  data: {
    values: (TrackData & TrackFeature)[];
  };
  transform: any[];
  hconcat: any[];
  resolve: any;
}
