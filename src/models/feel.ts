export class Feel {
  scores: JSON;
  timestamp: string;

  constructor (scores) {
    this.scores = scores;
    this.timestamp = new Date().toString();
  }
}
