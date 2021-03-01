import { Component, OnDestroy, OnInit} from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-post-list',
    templateUrl: 'post-list.component.html',
    styleUrls: ['./post-list.component.css']
})


export class PostListComponent implements OnInit,OnDestroy {
    private postSubscription: Subscription;
    private authStatSub: Subscription;

    userIsAuthenticated = false;

    // pagination
    totalPosts = 0;
    currentPage = 1;
    postsPerPage = 2; // default
    customPageSize = [1, 2, 5, 10]

    // loading spinner
    isLoading = false;

    // taking the input from app component such as storedposts 
    posts: Post[] = []; 


    // postService: PostService;
    //added public keyword thhus no need to create declare and initalize in contstructor. This is typescript feature.
    constructor(public postService: PostService, private authService: AuthService){
        // this.postService = postService;
        
    }

    ngOnInit(){
        this.postService.getPosts(this.postsPerPage, this.currentPage);
        this.isLoading = true;
        this.postSubscription = this.postService.getPostUpdateListener()
        .subscribe((subpostsData: {posts: Post[], postCount: number}) => {
            this.isLoading = false;
            this.totalPosts = subpostsData.postCount;
            this.posts = subpostsData.posts;
        })
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatSub = this.authService.getAuthStatListerner().subscribe(authenticated => {
            this.userIsAuthenticated = authenticated;
        })
    }

    onDelete(postId: string){
        this.isLoading = true;
        this.postService.deletePost(postId)
        .subscribe(() => {
            this.isLoading = false;
            this.postService.getPosts(this.postsPerPage, this.currentPage);
        });
    }

    onChange(pageData: PageEvent){
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postService.getPosts(this.postsPerPage, this.currentPage);
    }

    ngOnDestroy(){
        this.postSubscription.unsubscribe();
        this.authStatSub.unsubscribe();
    }
   
}

