import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PhotoUploadFormComponent } from "./photos/photo-upload-form/photo-upload-form.component";
import { PhotoCollectionComponent } from "./photos/photo-collection/photo-collection.component";

const appRoutes: Routes = [
    {path: '', component: PhotoCollectionComponent},
    {path: 'photo-upload-form', component: PhotoUploadFormComponent}
];
@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule{}