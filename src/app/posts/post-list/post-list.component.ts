import { Component, OnDestroy, OnInit} from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-post-list',
    templateUrl: 'post-list.component.html',
    styleUrls: ['./post-list.component.css']
})


export class PostListComponent implements OnInit,OnDestroy {
    private postSubscription: Subscription;
    posts: Post[] = []; // taking the input from app component such as storedposts 
    // postService: PostService;

    //added public keyword thhus no need to create declare and initalize in contstructor. This is typescript feature.
    constructor(public postService: PostService){
        // this.postService = postService;
        
    }

    ngOnInit(){
        this.postService.getPosts();

        this.postSubscription = this.postService.getPostUpdateListener().subscribe((subposts: Post[]) => {
            this.posts = subposts;
        })
    }

    onDelete(postId: string){
        this.postService.deletePost(postId);
    }

    ngOnDestroy(){
        this.postSubscription.unsubscribe();
    }
   
}

