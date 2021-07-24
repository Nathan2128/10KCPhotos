import { Component } from "@angular/core";

@Component({
    selector:'app-photo-upload-form',
    templateUrl: './photo-upload-form.component.html',
    styleUrls: ['./photo-upload-form.component.css']
})
export class PhotoUploadFormComponent {
    onUploadPhoto() {
        alert('Uploaded!');
    }
}
