export class Task {
    constructor(
        public id: number,
        public title: string,
        public content: string,
        public isCompleted: boolean,
      ) { }
    }