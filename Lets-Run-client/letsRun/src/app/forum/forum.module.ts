import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material.module";
import { GeneralCategoryComponent } from "./general-category/general-category.component";
import { UsersCategoryComponent } from "./users-category/users-category.component";
import { MainListComponent } from "./main-list/main-list.component";
import { ForumRouterModule } from "./forum-router.module";

@NgModule({
    declarations: [MainListComponent,
        GeneralCategoryComponent,
        UsersCategoryComponent
    ],
    imports: [
        CommonModule,
        ForumRouterModule,
        ReactiveFormsModule,
        AngularMaterialModule,
    ],
    exports: [MainListComponent,
        GeneralCategoryComponent,
        UsersCategoryComponent]
})

export class ForumModule {}