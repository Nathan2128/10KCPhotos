import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Photo } from './photo.interface';

@Injectable()
export class PhotoService {
  private photos: Photo[] = [];

  photoUpdate: Subject<Photo[]> = new Subject<Photo[]>();

  constructor(private http: HttpClient) {}

  uploadPhoto(caption: string, photo: File) {
    //use formData to include file in request
    const formData: FormData = new FormData();
    formData.append("caption", caption);
    formData.append("photo", photo);

    this.http
      .post<any>(
        'http://localhost:3000/api/photos',
        formData
      )
      .subscribe((res) => {
        console.log(res);
        const newPhoto: Photo = {
          _id: res.photo.id,
          caption: caption,
          imagePath: res.photo.imagePath
        }
        this.photos.push(newPhoto);
        this.photoUpdate.next(this.photos.slice());
      });
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
    this.http.delete('http://localhost:3000/api/photos/' + id).subscribe(() => {
      this.photoUpdate.next([...this.photos.filter(photo => photo._id !== id)]);
    })
  }
}
