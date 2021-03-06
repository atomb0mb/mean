import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Post } from "../post.model";
import { PostService } from "../post.service";
import { mimeType } from  './mime-type.validator';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
    enteredTitle = '';
    enteredContent = '';
    post: Post;
    isLoading = false;
    form: FormGroup;
    imagePreview: string;

    private mode = 'create';
    private postId: string;
    private authSubStatus: Subscription;
    

    constructor(public postService: PostService, public route: ActivatedRoute, private authService: AuthService){
        
    }
    ngOnDestroy(): void {
        this.authSubStatus.unsubscribe();
    }

    ngOnInit(){
        this.authSubStatus =this.authService.getAuthStatListerner().subscribe(
            authStatus => {
                this.isLoading = false;
            }
        )
        this.form = new FormGroup({
            'title': new FormControl(null, 
                {
                    validators: [Validators.required, Validators.minLength(3)] 
                }),
            'content': new FormControl(null, 
                {
                    validators: [Validators.required]
                }),
            'image': new FormControl(null, {
                    validators: [Validators.required],
                    asyncValidators: [mimeType] // only accept image
                }),
        })

        this.route.paramMap.subscribe((param: ParamMap) => {
            if(param.has('postId')) {
                
                this.mode = 'edit';
                this.postId = param.get('postId'); // get the postId from the list

                this.isLoading = true;

                this.postService.getPost(this.postId).subscribe(postData => {
                    this.isLoading = false;
                    this.post = { 
                        id: postData._id, 
                        title: postData.title, 
                        content: postData.content, 
                        imagePath: postData.imagePath, 
                        creator: postData.creator}
                    this.form.setValue({
                        title: this.post.title,
                        content: this.post.content,
                        image: this.post.imagePath,
                        // creator: this.post.creator,
                    })
                });
            } else {
                this.mode = 'create';
                this.postId = null; 
            }
        })
    }
    // Save the post
    onSavePost() {

        if(this.form.invalid){
            return;
        }
        this.isLoading = true;
        if(this.mode === 'create') {
            this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
        } else  {
            this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
        }
        this.form.reset();
    }
    
    // upload the image

    onImagePick(event: Event) {
        // user input
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image: file});
        this.form.get('image').updateValueAndValidity();

        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = (reader.result as string);
        }
        reader.readAsDataURL(file);


    }


}