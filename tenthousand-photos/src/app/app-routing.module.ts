import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PhotoUploadComponent } from "./photos/photo-upload/photo-upload.component";
import { PhotoUploadFormComponent } from "./photos/photo-upload-form/photo-upload-form.component";

const appRoutes: Routes = [
    {path: '', component: PhotoUploadComponent},
    {path: 'photo-upload-form', component: PhotoUploadFormComponent}
];
@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule{}