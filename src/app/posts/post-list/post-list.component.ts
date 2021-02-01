import { Component} from '@angular/core';

@Component({
    selector: 'app-post-list',
    templateUrl: 'post-list.component.html',
    styleUrls: ['./post-list.component.css']
})


export class PostListComponent {
    posts = [
        {title: '1st post', content: 'Yup'},
        {title: '2nd post', content: 'You\'re'},
        {title: '3rd post', content: 'right'}
    ]
}