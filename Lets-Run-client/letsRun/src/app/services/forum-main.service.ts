import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment"
import { HttpClient } from "@angular/common/http";
import { ForumModule } from "../forum/forum.module";
import { ForumCategoryModel } from "../models/forum_category.module";

const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: "root"})
export class ForumService {

    constructor(private http: HttpClient) {}

    addInCategory(icon: string, title: string, description: string, forumCategory: string, forOwnersOnly: boolean) {
        const dataToSend = {icon: icon, title: title, description: description, forumCategory: forumCategory, forOwnersOnly: forOwnersOnly}
      return  this.http.post<{forumCategory: ForumCategoryModel[]}>(BACKEND_URL + "/forum/add_section", dataToSend);
    }

    getCategory(category: string) {
        const queryParams = `?categoryName=${category}`;
       return this.http.get<{forumCategory: ForumCategoryModel[]}>(BACKEND_URL + "/forum/get_sections" + queryParams);
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

      return  this.http.put<{updatedForum: ForumCategoryModel}>(BACKEND_URL + "/forum/update/" + id, updateForum);
    }


    deleteForumSection(id: string) {
        return this.http.delete(BACKEND_URL + "/forum/deleteSection/" + id);
    }

}

// ERROR in src/app/forum/general-category/general-category.component.ts(4,10): 
// error TS2305: Module 
// '"D:/Programming/LetsRun/ltsrun/Lets-Run/Lets-Run-client/letsRun/src/app/services/forum-main.service"'
// has no exported member 'ForumService'.