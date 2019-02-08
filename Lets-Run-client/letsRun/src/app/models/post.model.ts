import { UserModel } from "./user.model";

export interface PostModel {
      icon: string,
      title: string,
      description: string,
      content: string,
      visitsCount: number,
      author: {
            _id: string,
            username: string,
            imagePath: string
      },
      lastComment: {
            username: string,
            date: Date
          }
      postComments?: string[],
      username?: string,
}