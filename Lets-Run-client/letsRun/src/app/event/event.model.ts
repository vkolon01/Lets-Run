export class EventModule {
    id: string;
    location: string;
    description: string;
    distance: number;
    pace: string;
    eventDate: Date;
    author: string;
    createdAt?: string;
    comments: [string];
    picture?: string;
    likes?: [string];
    runners?: [string];
}