import { Component } from "@angular/core";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: []
})
export class PostCreateComponent {
    newPost = 'N/A';

    onAddPost(input: HTMLTextAreaElement){
        console.dir(input);
        this.newPost = input.value;
    }
    
}