import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Photo } from '../photo.interface';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-photo-upload-form',
  templateUrl: './photo-upload-form.component.html',
  styleUrls: ['./photo-upload-form.component.css'],
})
export class PhotoUploadFormComponent implements OnInit {
  photoCaption: string = '';
  imageFile: any = null;
  editMode: boolean = false;
  id: string = '';
  photo: Photo;

  constructor(
    private photoSvc: PhotoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.id ? (this.editMode = true) : (this.editMode = false);
    if (this.editMode) {
      this.photo = this.photoSvc.getPhoto(this.id);
    } else {
      this.photo = null;
    }
  }

  onSubmit(newPhotoForm: NgForm) {
    if (this.editMode) {
      this.photoSvc.updatePhoto(
        this.id,
        newPhotoForm.value.caption,
        this.imageFile
      );
    } else {
      this.photoSvc.uploadPhoto(newPhotoForm.value.caption, this.imageFile);
    }

    //navigate back to PhotoCollectionComponent after uploading a new photo
    this.router.navigate(['']);
  }

  onPhotoSelected(event: any) {
    this.imageFile = <File>event.target.files[0];
  }
}
