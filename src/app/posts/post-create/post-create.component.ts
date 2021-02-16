import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { PostService } from "../post.service";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
    enteredTitle = '';
    enteredContent = '';
    post: Post;
    private mode = 'create';
    private postId: string;
    

    constructor(public postService: PostService, public route: ActivatedRoute){
        
    }

    ngOnInit(){
        this.route.paramMap.subscribe((param: ParamMap) => {
            if(param.has('postId')) {
                this.mode = 'edit';
                this.postId = param.get('postId'); // get the postId from the list
                this.postService.getPost(this.postId).subscribe(postData => {
                    this.post = { id: postData._id, title: postData.title, content: postData.content}
                });
            } else {
                this.mode = 'create';
                this.postId = null; 
            }
        })
    }

    onSavePost(form: NgForm) {

        if(form.invalid){
            return;
        }

        if(this.mode === 'create') {
            this.postService.addPost(form.value.title, form.value.content);
        } else  {
            this.postService.updatePost(this.postId, form.value.title, form.value.content);
        }
        form.resetForm();
    }
    

}