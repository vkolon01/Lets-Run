export class EventModule {
    id: string;
    location: string;
    distance: number;
    pace: string;
    eventDate: Date;
    author: string;
    comments: [string];
    picture?: string;
    likes?: [string];
    runners?: [string];
}