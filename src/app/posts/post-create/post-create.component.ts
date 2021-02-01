import { Component } from "@angular/core";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: []
})
export class PostCreateComponent {
    enteredValue = '';
    newPost = 'N/A';

    onAddPost(){
        this.newPost = this.enteredValue;
    }
    
}