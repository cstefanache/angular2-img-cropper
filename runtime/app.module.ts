import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {ImageCropperComponent, CropperSettings, Bounds} from '../index';

import { HttpModule } from '@angular/http';
import 'rxjs/Rx';

import { AppComponent } from './app';

import { MaterialModule } from '@angular/material';

@NgModule({
    imports: [ BrowserModule, MaterialModule.forRoot() ],
    declarations: [
        AppComponent, ImageCropperComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
