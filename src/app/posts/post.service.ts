
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'}) // This is alternative solution for adding postService in app module provider
export class PostService {
    private posts: Post[] = [];
    private postUpdated = new Subject<Post[]>();
    private localPath = 'http://localhost:3000';

    constructor(private http: HttpClient, private router: Router ){
 
    }

    //subscribe is just asyschronous stuff
    getPosts(postPerPage: number, currentPage: number) {
      const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
        this.http
        .get<{ message: string; posts: any }>(
          "http://localhost:3000/api/posts" + queryParams
        )
        .pipe(map((postData) => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
            };
          });
        }))
        .subscribe(transformedPosts => {
          this.posts = transformedPosts;
          this.postUpdated.next([...this.posts]);
        });
    }
    // add a new post
    addPost(title: string, content: string, image: File){
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
        this.http.post<{message: string, post: Post}>(this.localPath + '/api/posts', postData)
            .subscribe((respondData) => {
                const post: Post = {id: respondData.post.id, title: title, content: content, imagePath: respondData.post.imagePath};
                // const id = respondData.postId;
                // post.id = id;
                this.posts.push(post);
                this.postUpdated.next([...this.posts]);
                this.router.navigate(['/']);
            });
        
    }
    // Update the post in edit mode 
    updatePost(id: string, title: string, content: string, image: File | string ) {
      let postData: Post | FormData;
      if(typeof(image) === 'object') {
        postData = new FormData();
        postData.append("id", id); 
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);
      } else {
        postData = {
          id: id,
          title: title, 
          content: content,
          imagePath: image
        }
      }
      this.http.put(this.localPath + '/api/posts/' + id, postData)
      .subscribe(respond => {
        //mainly update the list
        const updatedPosts = [...this.posts];
        const oldPostindex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = { id: id, title: title, content: content, imagePath: ''};
        updatedPosts[oldPostindex] = post;
        this.posts = updatedPosts;
        // the ... to avoid manipulate the actual object in the array
        this.postUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      })
    }

    getPostUpdateListener(){
        return this.postUpdated.asObservable();
    }

    // Check if get post id is equal to post id in the array
    getPost(id: string) {
      return this.http.get<{_id: string, title: string, content: string, imagePath: string }>(this.localPath + '/api/posts/' + id);
    }
    // delete the post
    deletePost(postId: string) {
        this.http.delete(this.localPath + '/api/posts/' + postId)
        .subscribe(() => {
            const updatedPosts = this.posts.filter(post => post.id !== postId);
            this.posts = updatedPosts;
            this.postUpdated.next([...this.posts]);
        })
    }
}