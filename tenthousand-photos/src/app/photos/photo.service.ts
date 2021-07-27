import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Photo } from './photo.interface';

@Injectable()
export class PhotoService {
  private photos: Photo[] = [
  ];

  photoUpdate: Subject<Photo[]> = new Subject<Photo[]>();

  constructor(private http: HttpClient) {}

  uploadPhoto(caption: string, imagePath: string) {
    const newPhoto: Photo = {
      caption,
      imagePath,
      id: '',
    };
    this.http.post<{photos: Photo[]}>('http://localhost:3000/api/photos', newPhoto).subscribe((res) => {
      console.log(res);
      this.photos.push(newPhoto);
      this.photoUpdate.next(this.photos.slice());
    })
  }

  getPhotos() {
    this.http.get<{photos: Photo[]}>('http://localhost:3000/api/photos').subscribe((res) => {
      this.photos = res.photos;
      this.photoUpdate.next(this.photos.slice());
    });
  }
}
