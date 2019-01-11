export class EventModule {
    id: string;
    title: string;
    location: string;
    description: string;
    distance: number;
    pace: string;
    eventDate: Date;
    eventTime: Date;
    author?: string;
    createdAt?: string;
    comments?: [string];
    picture?: string;
    likes?: [string];
    runners?: [string];
}