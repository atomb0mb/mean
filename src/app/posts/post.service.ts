
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'}) // This is alternative solution for adding postService in app module provider
export class PostService {
    private posts: Post[] = [];
    private postUpdated = new Subject<Post[]>();
    private localPath = 'http://localhost:3000';

    constructor(private http: HttpClient ){
 
    }

    //subscribe is just asyschronous stuff
    getPosts(){
        this.http.get<{message: string, posts: Post[]}>(this.localPath +'/api/posts')
            .subscribe((postData)=> {
             this.posts = postData.posts;
             this.postUpdated.next([...this.posts]);
            });
    }

    addPost(title: string, content: string){
        const post: Post = {
            id: null ,
            title: title,
            content: content
        }
        this.http.post<{message: string}>('http://localhost:3000/api/posts', post)
            .subscribe((respondData)=> {
                console.log(respondData.message);
                this.posts.push(post);
                this.postUpdated.next([...this.posts]);
            });
        
    }

    getPostUpdateListener(){
        return this.postUpdated.asObservable();
    }
}