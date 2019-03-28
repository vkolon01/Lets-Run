import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment"
import { HttpClient } from "@angular/common/http";
import { ForumModule } from "../forum/forum.module";
import { TopicCategoryModel } from "../models/forum_category.module";
import { PostModel } from "../models/post.model";
import { PostCommentModule } from "../models/postComment.model";

const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: "root" })
export class ForumService {

    constructor(private http: HttpClient) { }

    getForumInformationForHome() {
        return this.http.get<{ topics: number; posts: number; comments: number }>(BACKEND_URL + "/forum/get_forum_information_for_home_component");
    }

    addInCategory(icon: string, title: string, description: string, forumCategory: string, forOwnersOnly: boolean) {
        const dataToSend = { icon: icon, title: title, description: description, forumCategory: forumCategory, forOwnersOnly: forOwnersOnly }
        return this.http.post<{ forumCategory: TopicCategoryModel[] }>(BACKEND_URL + "/forum/add_section", dataToSend);
    }

    getCategory(category: string) {
        const queryParams = `?categoryName=${category}`;
        return this.http.get<{ forumCategory: TopicCategoryModel[] }>(BACKEND_URL + "/forum/get_sections" + queryParams);
    }

    updateForum(id: string, icon: string, title: string, description: string, forumCategory: string, forOwnersOnly: boolean) {
        const updateForum = {
            id: id,
            icon: icon,
            title: title,
            description: description,
            forOwnersOnly: forOwnersOnly,
            forumCategory: forumCategory
        }

        return this.http.put<{ updatedTopic: TopicCategoryModel }>(BACKEND_URL + "/forum/update/" + id, updateForum);
    }


    deleteForumSection(id: string) {
        return this.http.delete(BACKEND_URL + "/forum/deleteSection/" + id);
    }

    getTopicById(id: string) {
        return this.http.get<{ foundTopic: TopicCategoryModel }>(BACKEND_URL + "/forum/get_topic_by_id/" + id);
    }

    getPostsForTopic(topic_id: string,  pageSize: number, currentPage: number) {
        const queryParams = `?pageSize=${pageSize}&currentPage=${currentPage}`;
        return this.http.get<{postsForTopic: PostModel[], totalPosts: number}>(BACKEND_URL + "/forum/get_posts_list/" + topic_id + queryParams);
    }

    addPostToTheTopic(topic_id: string, icon: string, title: string, description: string, content: string) {
        const post = {
            topic_id: topic_id,
            icon: icon,
            title: title,
            description: description,
            content: content
        };

        return this.http.post<{ postsList: PostModel[] }>(BACKEND_URL + "/forum/add_post", post);
    }

    getPostById(post_id: string) {
        return this.http.get<{post: PostModel}>(BACKEND_URL + "/forum/get_post/" + post_id);
    }

    updatePostById(post_id: string, title: string, description: string, content: string) {
        const updatedPost = {
            _id: post_id,
            title: title,
            description: description,
            content: content
        };

        return this.http.put<{updatedPost: PostModel}>(BACKEND_URL + "/forum/updatePost", updatedPost);
    }

    deletePost(post_id) {
        return this.http.delete(BACKEND_URL + "/forum/delete_post/" + post_id);
    }

    getCommentToThePost(post_id: string, pageSize: number, currentPage: number) {
        const queryParams = `?pageSize=${pageSize}&currentPage=${currentPage}`;
        return this.http.get<{comments: PostCommentModule[], commentsCount: number}>(BACKEND_URL + "/forum/get_comment_to_post/" + post_id + queryParams);
    }

    addCommentToThePost(post_id: string, content: string) {
        var body = { content: content}
       return this.http.post<{comments: PostCommentModule[]}>(BACKEND_URL + "/forum/add_comment/" + post_id, body);
    }

    updateCommentToThePost(comment_id: string, content: string) {
        return this.http.put<{comment: PostCommentModule}>(BACKEND_URL + "/forum/update_comment_to_post", { comment_id, content});
    }

    replyToCommentToThePost(comment_id: string, postId: string, content: string) {
        return this.http.put<{comments: PostCommentModule[]}>(BACKEND_URL + "/forum/reply_to_comment/" + postId, { comment_id, content});
    }

    deleteCommentToThePost(comment_id) {
        return this.http.delete(BACKEND_URL + "/forum/delete_comment_to_post/" + comment_id);
    }

}