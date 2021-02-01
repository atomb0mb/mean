import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

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