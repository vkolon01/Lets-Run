import { UserModel } from "./user.model";

export interface PostCommentModule {
    _id: string;
    createdAt: string;
    updatedAt?: string;
    content: string;
    author: UserModel;
    reported: boolean;
    quote?: {
        content: string,
        quoteAuthor: string
    },
    authorImage?: string;
} 