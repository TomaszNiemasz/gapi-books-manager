import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule}
from '@angular/material';

import { AppComponent } from './app.component';
import { MainSearcherComponent } from './main-searcher/main-searcher.component';
import {
  MdcButtonModule,
  MdcCardModule, MdcDrawerModule, MdcFabModule,
  MdcFormFieldModule,
  MdcIconButtonModule,
  MdcIconModule, MdcListModule, MdcRippleModule,
  MdcTextFieldModule, MdcTopAppBarModule,
  MdcTypographyModule
} from '@angular-mdc/web';
import { LibraryComponent } from './library/library.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { BookViewerComponent } from './book-viewer/book-viewer.component';
import { BookThumbnailComponent } from './book-thumbnail/book-thumbnail.component';
import { BookshelfComponent } from './bookshelf/bookshelf.component';
import { BookshelfThumbnailComponent } from './bookshelf-thumbnail/bookshelf-thumbnail.component';
import {GoogleApiService, GoogleAuthService} from 'ng-gapi';


@NgModule({
  declarations: [
    AppComponent,
    MainSearcherComponent,
    LibraryComponent,
    SignInComponent,
    BookDetailsComponent,
    BookViewerComponent,
    BookThumbnailComponent,
    BookshelfComponent,
    BookshelfThumbnailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MdcCardModule,
    MdcIconModule,
    MdcIconButtonModule,
    MdcTypographyModule,
    MdcFormFieldModule,
    MdcTextFieldModule,
    MdcTopAppBarModule,
    MdcButtonModule,
    MdcDrawerModule,
    MdcListModule,
    MdcFabModule,
    MdcRippleModule
  ],
  providers: [
    { provide: GoogleAuthService },
    { provide: GoogleApiService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
