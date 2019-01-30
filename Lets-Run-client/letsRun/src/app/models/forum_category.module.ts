import { Title } from "@angular/platform-browser";
import { Identifiers } from "@angular/compiler";

export interface TopicCategoryModel {
    _id: string,
    icon: string,
    title: string,
    description: string,
    forOwnersOnly: boolean,
    forumCategory: string,
    author?: string,
    visitsCount?: number,
    posts?: [],
    username?: string,
    comment?: string,
    createdAt?: Date,
}