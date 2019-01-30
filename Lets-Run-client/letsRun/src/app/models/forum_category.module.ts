import { Title } from "@angular/platform-browser";
import { Identifiers } from "@angular/compiler";
import { PostModel } from "./post.model";

export interface TopicCategoryModel {
    _id: string,
    icon: string,
    title: string,
    description: string,
    forOwnersOnly: boolean,
    forumCategory: string,
    author?: string,
    visitsCount?: number,
    posts?: PostModel[],
    username?: string,
    comment?: string,
    createdAt?: Date,
}