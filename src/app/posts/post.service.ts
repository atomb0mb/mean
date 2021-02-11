
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
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
        this.http
        .get<{ message: string; posts: any }>(
          "http://localhost:3000/api/posts"
        )
        .pipe(map((postData) => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
            };
          });
        }))
        .subscribe(transformedPosts => {
          this.posts = transformedPosts;
          this.postUpdated.next([...this.posts]);
        });
    }

    addPost(title: string, content: string){
        const post: Post = {
            id: null ,
            title: title,
            content: content
        }
        this.http.post<{message: string}>(this.localPath + '/api/posts', post)
            .subscribe((respondData)=> {
                console.log(respondData.message);
                this.posts.push(post);
                this.postUpdated.next([...this.posts]);
            });
        
    }

    getPostUpdateListener(){
        return this.postUpdated.asObservable();
    }

    deletePost(postId: string) {
        this.http.delete(this.localPath + '/api/posts/' + postId)
        .subscribe(() => {
            const updatedPosts =  this.posts.filter(post => post.id !== postId);
            this.posts = updatedPosts;
            this.postUpdated.next([...this.posts]);
        })
    }
}