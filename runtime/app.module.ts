import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {ImageCropperComponent, CropperSettings, Bounds} from '../index';

import { HttpModule } from '@angular/http';
import 'rxjs/Rx';

import { AppComponent } from './app';
import {TabsModule} from "ng2-tabs";

@NgModule({
    imports: [ BrowserModule, TabsModule, FormsModule ],
    declarations: [
        AppComponent, ImageCropperComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
