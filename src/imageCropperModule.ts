import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { ImageCropperComponent } from "./imageCropperComponent";

@NgModule({
  imports: [CommonModule],
  declarations: [ImageCropperComponent],
  exports: [ImageCropperComponent]
})
export class ImageCropperModule {}
