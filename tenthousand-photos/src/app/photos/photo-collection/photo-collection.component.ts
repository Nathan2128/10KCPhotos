import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Photo } from '../photo.interface';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-photo-collection',
  templateUrl: './photo-collection.component.html',
  styleUrls: ['./photo-collection.component.css'],
})
export class PhotoCollectionComponent implements OnInit, OnDestroy {
  photos: Photo[] = [];
  photosUpdatedSubscription: Subscription;
  isAuth: boolean = false;
  private isAuthSubscription: Subscription;

  constructor(
    private authSvc: AuthorizationService,
    private photoSvc: PhotoService
  ) {}

  ngOnInit() {
    this.photoSvc.getPhotos();
    this.photosUpdatedSubscription = this.photoSvc.photoUpdate.subscribe(
      (updatedPhotos: any) => {
        this.photos = updatedPhotos.map((photo) => {
          return {
            _id: photo._id,
            caption: photo.caption,
            imagePath: photo.photo,
          };
        });
      }
    );
    this.isAuth = this.authSvc.getAuthFlag(); //added this logic to avoid a bug
    this.isAuthSubscription = this.authSvc
      .getIsAuthenticated()
      .subscribe((res: boolean) => {
        this.isAuth = res;
      });
  }

  onDeletePhoto(id: string) {
    this.photoSvc.deletePhoto(id).subscribe(() => {
      this.photos = [...this.photos.filter((photo) => photo._id !== id)]
    })
  }

  ngOnDestroy() {
    this.photosUpdatedSubscription.unsubscribe();
    this.isAuthSubscription.unsubscribe();
  }
}
