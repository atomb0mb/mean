
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
    // add a new post
    addPost(title: string, content: string){
        const post: Post = {
            id: null ,
            title: title,
            content: content
        }
        this.http.post<{message: string, postId: string}>(this.localPath + '/api/posts', post)
            .subscribe((respondData)=> {
                console.log(respondData.message);
                const id = respondData.postId;
                post.id = id;
                this.posts.push(post);
                this.postUpdated.next([...this.posts]);
            });
        
    }
    // Update the post in edit mode 
    updatePost(id: string, title: string, content: string) {
      const post: Post = { id: id, title: title, content: content};
      this.http.put(this.localPath + '/api/posts/' + id, post)
      .subscribe(respond => {
        //mainly update the list
        const updatedPosts = [...this.posts];
        const oldPostindex = updatedPosts.findIndex(p => p.id === id);
        updatedPosts[oldPostindex] = post;
        this.posts = updatedPosts;
        
        this.postUpdated.next([...this.posts]);
      })
    }

    getPostUpdateListener(){
        return this.postUpdated.asObservable();
    }

    // Check if get post id is equal to post id in the array
    getPost(id: string) {
      // the ... to avoid manipulate the actual object in the array
      //to check output..
      // const temp = {...this.posts.find(p => 
      //   p.id === id
      // )}
      // console.log(temp);
      return {...this.posts.find(p => 
        p.id === id
      )}
    }
    // delete the post
    deletePost(postId: string) {
        this.http.delete(this.localPath + '/api/posts/' + postId)
        .subscribe(() => {
            const updatedPosts =  this.posts.filter(post => post.id !== postId);
            this.posts = updatedPosts;
            this.postUpdated.next([...this.posts]);
        })
    }
}