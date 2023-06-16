import * as chroma from 'chroma-js';

export class TrackFeature {
	id:string;
	danceability:number;
	energy:number;
	count: number;
	constructor(id, danceability, energy, count) {
		this.id = id;
		this.danceability = danceability;
		this.energy = energy;
		this.count =count;
	}

	get percentageDanceability() {
		return (this.danceability*100).toFixed() + '%';
	}
	get percentageEnergy() {
		return (this.energy*100).toFixed() + '%';
	}

	get colorDanceability() {
		return chroma.mix('red', 'green', this.danceability, 'hsl').hex();
	}
	get colorEnergy() {
		return chroma.mix('red', 'green', this.energy, 'hsl').hex();
	}
}
