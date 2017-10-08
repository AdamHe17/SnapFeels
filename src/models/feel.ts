export class Feel {
  scores: JSON;
  timestamp: string;

  constructor (scores) {
    this.scores = scores;
    this.timestamp = new Date().toString();
  }

  getValues() {
    return [
      this.scores['anger'], this.scores['contempt'], this.scores['disgust'], this.scores['fear'],
      this.scores['happiness'], this.scores['neutral'], this.scores['sadness'], this.scores['surprise']
    ]
  }
}
