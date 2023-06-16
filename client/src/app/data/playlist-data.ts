import { ResourceData } from './resource-data';

export class PlaylistData extends ResourceData {
	description: string;
	collaborative: boolean;
	tracks: number;

	constructor(objectModel: {}) {
		super(objectModel);
		this.category = "playlist";
		this.description = objectModel['description'];
		//count of tracks:
		this.tracks = objectModel['tracks']['total'];
	}
}
