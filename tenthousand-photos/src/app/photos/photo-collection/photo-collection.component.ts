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
      (updatedPhotos: Photo[]) => {
        this.photos = updatedPhotos;
      }
    );
  }

  ngOnDestroy() {
    this.photosUpdatedSubscription.unsubscribe();
  }
}
