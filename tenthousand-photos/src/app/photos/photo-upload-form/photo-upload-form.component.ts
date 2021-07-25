import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-photo-upload-form',
  templateUrl: './photo-upload-form.component.html',
  styleUrls: ['./photo-upload-form.component.css'],
})
export class PhotoUploadFormComponent {
  photoCaption: string = '';
  filePath: string = '';

  constructor(private photoSvc: PhotoService, private router: Router) {}

  onUploadPhoto(newPhotoForm: NgForm) {
    this.photoSvc.uploadPhoto(
      newPhotoForm.value.caption,
      newPhotoForm.value.imagePath
    );
    //navigate back to PhotoCollectionComponent after uploading a new photo
    this.router.navigate(['']);
  }
}
