import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { MainListComponent } from "./main-list/main-list.component";

const forumRoutes: Routes  = [
    {path: '', component: MainListComponent, 
    // children: [
    //     {path: ':id', component: EventDetailComponent}
    // ]
}
];

@NgModule({
    imports: [
        RouterModule.forChild(forumRoutes)
    ],
    exports: [RouterModule]
})
export class ForumRouterModule {}