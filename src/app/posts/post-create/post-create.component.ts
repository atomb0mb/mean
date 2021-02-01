import { Component } from "@angular/core";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: []
})
export class PostCreateComponent {


    onAddPost(){
        alert('Post added!')
    }
}