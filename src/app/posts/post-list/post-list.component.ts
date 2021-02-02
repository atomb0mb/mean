import { Component, Input} from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
    selector: 'app-post-list',
    templateUrl: 'post-list.component.html',
    styleUrls: ['./post-list.component.css']
})


export class PostListComponent {

    @Input() posts: Post[] = []; // taking the input from app component such as storedposts 
    // postService: PostService;

    //added public keyword thhus no need to create declare and initalize in contstructor. This is typescript feature.
    constructor(public postService: PostService){
        // this.postService = postService;
        
    }
   
}

