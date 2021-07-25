import { Subject } from 'rxjs';
import { Photo } from './photo.interface';

export class PhotoService {
  private photos: Photo[] = [
    {
      caption: 'Ezra is hungry!',
      imagePath: 'assets/aadhav-bites-foot.jpeg',
    },
    {
      caption: 'I learned how to open the window!',
      imagePath: 'assets/aadhav-window.jpeg',
    },
  ];

  photoUpdate: Subject<Photo[]> = new Subject<Photo[]>();

  uploadPhoto(caption: string, imagePath: string) {
    const newPhoto: Photo = {
      caption,
      imagePath,
    };
    this.photos.push(newPhoto);
    this.photoUpdate.next(this.photos.slice());
  }

  getPhotos() {
    return this.photos.slice();
  }
}
