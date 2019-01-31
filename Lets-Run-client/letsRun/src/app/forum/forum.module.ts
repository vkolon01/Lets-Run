import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material.module";
import { GeneralCategoryComponent } from "./general-category/general-category.component";
import { UsersCategoryComponent } from "./users-category/users-category.component";
import { MainListComponent } from "./main-list/main-list.component";
import { ForumRouterModule } from "./forum-router.module";
import { ForumItemComponent } from "./forum-item/forum-item.component";
import { PostItemComponent } from "./forum-item/post-list-with-desc/post-item/post-item.component";
import { PostCommentComponent } from "./forum-item/post-list-with-desc/post-item/post-detail/post-comment/post-comment.component";

@NgModule({
    declarations: [MainListComponent,
        GeneralCategoryComponent,
        UsersCategoryComponent,
        ForumItemComponent
    ],
    imports: [
        CommonModule,
        ForumRouterModule,
        ReactiveFormsModule,
        AngularMaterialModule,
    ],
    exports: [MainListComponent,
        GeneralCategoryComponent,
        UsersCategoryComponent,
        ForumItemComponent]
})

export class ForumModule {}