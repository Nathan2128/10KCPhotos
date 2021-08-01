import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Photo } from '../photo.interface';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-photo-collection',
  templateUrl: './photo-collection.component.html',
  styleUrls: ['./photo-collection.component.css'],
})
export class PhotoCollectionComponent implements OnInit, OnDestroy {
  photos: Photo[] = [];
  photosUpdatedSubscription!: Subscription;

  constructor(private photoSvc: PhotoService) {}

  ngOnInit() {
    this.photoSvc.getPhotos();
    this.photosUpdatedSubscription = this.photoSvc.photoUpdate.subscribe(
      (updatedPhotos: any) => {
        this.photos = updatedPhotos.map(photo => {
          return {
            _id: photo.id,
            caption: photo.caption,
            imagePath: photo.photo
          }
        })
      }
    );
  }

  onDeletePhoto(id: string) {
    this.photoSvc.deletePhoto(id);
  }

  ngOnDestroy() {
    this.photosUpdatedSubscription.unsubscribe();
  }
}
