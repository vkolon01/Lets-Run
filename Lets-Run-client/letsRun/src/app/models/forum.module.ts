import { Title } from "@angular/platform-browser";

export interface ForumModel {
    icon: string,
    title: string,
    desc: string,
    id?: string,
    views?: number,
    username?: string,
    comment?: string,
    createdAt?: Date,
}