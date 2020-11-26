import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IVolume} from './data-model';
import {apiKey} from './api_key';

export interface IVolume {
  id: string;
  volumeInfo: {
    title: string;
    subtitle: string;
    authors: string[];
    publisher: string;
    publishDate: string;
    description: string;
    averageRating: number;
    ratingsCount: number;
    imageLinks: {
      thumbnail: string;
      smallThumbnail: string;
    }
  };
}

export interface IBookshelf {
  kind: string;
  id: number;
  selfLink: string;
  title: string;
  access: string;
  updated: string;
  created: string;
  volumeCount: string;
  volumesLastUpdated: string;
}

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private httpClient: HttpClient) {
  }

  public searchVolumes(query: string): Observable<IVolume[]> {
    return this.httpClient.get<{ items: IVolume[] }>(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`)
      .pipe(map(data => data.items || []));
  }

  public searchVolumesInLibrary(query: string): Observable<IVolume[]> {
    return this.httpClient.get<{ items: IVolume[] }>(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&libraryRestrict=my-library`)
      .pipe(map(data => data.items || []));
  }

  public getVolumeById(volumeId: string): Observable<IVolume> {
    return this.httpClient.get<IVolume>(
      `https://www.googleapis.com/books/v1/volumes/${volumeId}`);
  }

  public getUserBookshelves(accessToken: string): Observable<IBookshelf[]> {
    return this.httpClient.get<{ items: IBookshelf[] }>(
      `https://www.googleapis.com/books/v1/mylibrary/bookshelves?key=${apiKey}
      &access_token=${accessToken}`)
      .pipe(map(data => data.items || []));
  }

  public getUserBookshelfVolumes(bookshelfId: number, accessToken: string): Observable<IVolume[]> {
    return this.httpClient.get<{ items: IVolume[] }>(
      `https://www.googleapis.com/books/v1/mylibrary/bookshelves/${+bookshelfId}
      /volumes?key=${apiKey}
      &access_token=${accessToken}`)
      .pipe(map(data => data.items || []));
  }

  public addVolumeToUserBookshelf(bookshelfId: number, volumeId: string, accessToken: string) {
    return this.httpClient.post(
      `https://www.googleapis.com/books/v1/mylibrary/bookshelves/${bookshelfId}
      /addVolume?volumeId=${volumeId}
      &key=${apiKey}
      &access_token=${accessToken}`, {
        'Content-Type': 'application/json'
      }).subscribe(
      () => {
        console.log('Added to bookshelf!');
      },
      () => {

      },
      () => {

      }
    );
  }

  public deleteVolumeFromUserBookshelf(bookshelfId: number, volumeId: string, accessToken: string) {
    return this.httpClient.post(
      `https://www.googleapis.com/books/v1/mylibrary/bookshelves/${bookshelfId}
      /removeVolume?volumeId=${volumeId}
      &key=${apiKey}
      &access_token=${accessToken}`, {
        'Content-Type': 'application/json'
      }).toPromise();
  }
}
