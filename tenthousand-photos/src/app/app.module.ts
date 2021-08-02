import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PhotoUploadFormComponent } from './photos/photo-upload-form/photo-upload-form.component';
import { PhotoUploadComponent } from './photos/photo-upload/photo-upload.component';
import { NavigationBarComponent } from './nav-bar/nav-bar.component';
import { PhotoCollectionComponent } from './photos/photo-collection/photo-collection.component';
import { PhotoService } from './photos/photo.service';
import { LoginComponent } from './authorization/login/login.component';
import { SignupComponent } from './authorization/signup/signup.component';
import { AuthorizationService } from './authorization/authorization.service';
import { AuthorizationInterceptor } from './authorization/authorization.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    PhotoUploadComponent,
    PhotoUploadFormComponent,
    NavigationBarComponent,
    PhotoCollectionComponent,
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatTooltipModule,
    FlexLayoutModule,
  ],
  exports: [MatIconModule, MatButtonModule],
  providers: [
    PhotoService,
    AuthorizationService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor , multi: true},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
