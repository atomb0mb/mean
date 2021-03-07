
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

@Injectable({providedIn: 'root'}) // This is alternative solution for adding postService in app module provider
export class PostService {
    private posts: Post[] = [];
    private postUpdated = new Subject<{posts: Post[], postCount: number}>();
    private localPath = environment.apiUrl;

    constructor(private http: HttpClient, private router: Router ){
 
    }

    //subscribe is just asyschronous stuff
    getPosts(postPerPage: number, currentPage: number) {
      const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
        this.http
        .get<{ message: string; posts: any, maxPosts: number }>(
          this.localPath + "posts" + queryParams
        )
        .pipe(map((postData) => {
          return { 
            posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            }
          }), maxPosts: postData.maxPosts
          };

        })) 
        .subscribe(transformedPostsData => {
          this.posts = transformedPostsData.posts;
          this.postUpdated.next({posts: [...this.posts], postCount: transformedPostsData.maxPosts});
        });
    }
    // add a new post
    addPost(title: string, content: string, image: File){
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
        this.http.post<{message: string, post: Post}>(this.localPath + 'posts', postData)
            .subscribe((respondData) => {
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
          imagePath: image,
          creator: null // do not handle it here because it handles on server side for better security
        }
      }
      this.http.put(this.localPath + 'posts/' + id, postData)
      .subscribe(respond => {
        this.router.navigate(["/"]);
      })
    }

    getPostUpdateListener(){
        return this.postUpdated.asObservable();
    }

    // Check if get post id is equal to post id in the array
    getPost(id: string) {
      return this.http.get<{_id: string; title: string; content: string; imagePath: string; creator: string; }>(this.localPath + 'posts/' + id);
    }
    // delete the post
    deletePost(postId: string) {
        return this.http.delete(this.localPath + 'posts/' + postId);
    }
}