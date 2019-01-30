export interface PostModel {
      icon: string,
      title: string,
      description: string,
      content: string,
      visitsCount: number,
      postComments?: string[],
      username?: string,
}