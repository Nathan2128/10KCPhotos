import { Component, ElementRef } from '@angular/core';
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
  imageFile: any = null;

  constructor(private photoSvc: PhotoService, private router: Router, private el: ElementRef) {}

  onUploadPhoto(newPhotoForm: NgForm) {
    this.photoSvc.uploadPhoto(newPhotoForm.value.caption, this.imageFile);
    //navigate back to PhotoCollectionComponent after uploading a new photo
    this.router.navigate(['']);
  }

  onPhotoSelected(event: any) {
    this.imageFile = <File>event.target.files[0];
    
  }
}
