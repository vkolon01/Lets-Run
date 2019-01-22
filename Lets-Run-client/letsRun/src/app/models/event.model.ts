export class EventModule {
    id: string;
    title: string;
    location: string;
    description: string;
    distance: number;
    pace: string;
    eventDate: Date;
    eventTime: Date;
    privateEvent: boolean;
    author?: string;
    createdAt?: string;
    comments?: [string];
    picture?: string;
    likes?: [string];
    runners?: [string];
}