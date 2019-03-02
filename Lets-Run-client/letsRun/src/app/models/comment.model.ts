export interface CommentModule {
    id: string;
    createdAt: string;
    content: string;
    author: string;
    quote?: {
        content: string,
        quoteAuthor: string
    };
    authorId?: string;
    authorImage?: string;

} 