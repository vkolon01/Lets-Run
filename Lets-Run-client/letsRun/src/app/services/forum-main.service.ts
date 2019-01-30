import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment"
import { HttpClient } from "@angular/common/http";
import { ForumModule } from "../forum/forum.module";
import { TopicCategoryModel } from "../models/forum_category.module";
import { PostModel } from "../models/post.model";

const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: "root" })
export class ForumService {

    constructor(private http: HttpClient) { }

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

    getPostsForTopic(topic_id: string) {
        return this.http.get<{postsForTopic: PostModel[]}>(BACKEND_URL + "/forum/get_posts_list/" + topic_id);
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

}