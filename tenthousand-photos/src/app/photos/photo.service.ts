import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ErrorService } from '../shared/error.service';
import { Photo } from './photo.interface';

@Injectable()
export class PhotoService {
  private photos: Photo[] = [];

  photoUpdate: Subject<Photo[]> = new Subject<Photo[]>();

  constructor(
    private http: HttpClient,
    private errorSvc: ErrorService,
    private router: Router
  ) {}

  uploadPhoto(caption: string, photo: File) {
    //use formData to include file in request
    const formData: FormData = new FormData();
    formData.append('caption', caption);
    formData.append('photo', photo);

    this.http.post<any>('http://localhost:3000/api/photos', formData).subscribe(
      (res) => {
        const newPhoto: Photo = {
          _id: res.photo.id,
          caption: caption,
          imagePath: res.photo.imagePath,
        };
        this.photos.push(newPhoto);
        this.photoUpdate.next(this.photos.slice());
        this.router.navigate(['/']);
      },
      (error) => {
        if (error.status === 415) {
          this.errorSvc.showSnackbar(error.error.error, null, 3000);
          this.router.navigate(['/']);
        }
      }
    );
  }

  getPhotos() {
    this.http
      .get<{ photos: Photo[] }>('http://localhost:3000/api/photos')
      .subscribe((res) => {
        this.photos = res.photos;
        this.photoUpdate.next(this.photos.slice());
      });
  }

  deletePhoto(id: string) {
    return this.http.delete('http://localhost:3000/api/photos/'+ id);
  }

  //creating this for the edit photo feature
  getPhoto(id: string) {
    return { ...this.photos.find((photo) => photo._id === id) };
  }

  updatePhoto(_id: string, caption: string, photo: File | string) {
    let updatedPhoto: Photo | FormData;
    if (typeof photo === 'object') {
      //run this if photo is a file
      updatedPhoto = new FormData();
      updatedPhoto.append('_id', _id);
      updatedPhoto.append('caption', caption);
      updatedPhoto.append('photo', photo);
    } else {
      //run this if photo is a string
      updatedPhoto = {
        _id,
        caption,
        imagePath: photo,
      };
    }

    this.http
      .put('http://localhost:3000/api/photos/' + _id, updatedPhoto)
      .subscribe((res) => {
        //update the old posts immutably
        const newPhotos = [...this.photos];
        const index = newPhotos.findIndex((photo) => photo._id === _id);
        const updatedPhoto = {
          _id,
          caption,
          imagePath: photo,
        };
        newPhotos[index] = updatedPhoto;
        this.photos = newPhotos;
        this.photoUpdate.next([...this.photos]);
      });
  }
}
