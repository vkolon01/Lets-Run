import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment"
import { CommentModule } from "../models/comment.model";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";



const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: "root" })
export class CommentService {

    private comments: CommentModule[] = [];
    private commentUpdated = new Subject<{ comments: CommentModule[] }>();


    constructor(private http: HttpClient, private router: Router) { }

    addComment(content: string, eventId: string) {
        const newContent = { content: content };
        this.http.post(BACKEND_URL + '/events/' + eventId + '/add_comment', newContent)
            .subscribe(result => {
                this.commentUpdated.next({
                    comments: [...this.comments]
                })
                // , 
                // this.getCommentsList(eventId);
            })
    }

    // getCommentsList(eventId: string) {
    //     this.http.get<{ message: string, comments: any, authorId: string,  }>(BACKEND_URL + '/events/' + eventId + '/get_comments')
    //         .pipe(map(commentDate => {
    //             return {
    //                 comments: commentDate.comments.map(comment => {
    //                     return {
    //                         id: comment._id,
    //                         content: comment.content,
    //                         author: comment.author.username,
    //                         authorId: comment.author._id
    //                     }
    //                 }), 

    //             }
    //         })
    //         )
    //         .subscribe(comments => {
    //             this.comments = comments.comments,
    //                 this.commentUpdated.next({
    //                     comments: [...this.comments]
    //                 })   
    //         })
    // }


    getCommentListFormNgxUiScroll(eventId: string, index: number, count: number) {
        const queryParams = `?index=${index}&count=${count}`;
       return this.http.get<{ message: string, comments: any, authorId: string, }>(BACKEND_URL + '/events/' + eventId + '/get_comments' + queryParams)
            .pipe(map(commentDate => {
                return {
                    comments: commentDate.comments.map(comment => {
                        return {
                            id: comment._id,
                            content: comment.content,
                            author: comment.author.username,
                            authorId: comment.author._id
                        }
                    }),

                }
            })
            )
            // .subscribe(comments => {
            //     console.log('comments');

            //     console.log(comments);
                
            //     this.comments = comments.comments,
            //         this.commentUpdated.next({
            //             comments: [...this.comments]
            //         })
            // })

    }




    getUpdateCommentsListener() {
        return this.commentUpdated.asObservable();
    }

    editComment(eventId: string, content: string, comment_id: string) {

        let newComment = { content: content };

        this.http.put(BACKEND_URL + '/events/' + eventId + '/' + comment_id, newComment)
            .subscribe(response => {
                // this.getCommentsList(eventId);
            });
    }

    deleteComent(eventId: string, commentId: string) {
        return this.http.delete(BACKEND_URL + '/events/' + eventId + '/' + commentId).subscribe(result => {

            // this.getCommentsList(eventId);
        })
    }


}