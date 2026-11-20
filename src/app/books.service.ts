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
    // encodeURIComponent zamienia znaki specjalne na bezpieczny zapis,
    // np. spacja na %20, a & na %26.
    const url = `https://www.googleapis.com/books/v1/volumes`
      + `?q=${encodeURIComponent(query)}&maxResults=40&key=${apiKey}`;
    return this.httpClient.get<{ items: IVolume[] }>(url)
      .pipe(map(data => data.items || []));
  }

  public searchVolumesInLibrary(query: string): Observable<IVolume[]> {
    return this.httpClient.get<{ items: IVolume[] }>(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&libraryRestrict=my-library`)
      .pipe(map(data => data.items || []));
  }

  public getVolumeById(volumeId: string): Observable<IVolume> {
    const url = `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(volumeId)}`
      + `?key=${apiKey}`;
    return this.httpClient.get<IVolume>(url);
  }

    public getUserBookshelves(accessToken: string): Observable<IBookshelf[]> {
    // Adres składamy z dwóch kawałków bez przenoszenia tekstu do nowej linii w środku.
    const url = `https://www.googleapis.com/books/v1/mylibrary/bookshelves`
      + `?key=${apiKey}&access_token=${accessToken}`;
    return this.httpClient.get<{ items: IBookshelf[] }>(url)
      .pipe(map(data => data.items || []));
  }

  public getUserBookshelfVolumes(bookshelfId: number, accessToken: string): Observable<IVolume[]> {
    const url = `https://www.googleapis.com/books/v1/mylibrary/bookshelves/${+bookshelfId}/volumes`
      + `?key=${apiKey}&access_token=${accessToken}`;
    return this.httpClient.get<{ items: IVolume[] }>(url)
      .pipe(map(data => data.items || []));
  }

  public addVolumeToUserBookshelf(bookshelfId: number, volumeId: string, accessToken: string): Observable<any> {
    const url = `https://www.googleapis.com/books/v1/mylibrary/bookshelves/${+bookshelfId}/addVolume`
      + `?volumeId=${encodeURIComponent(volumeId)}&key=${apiKey}&access_token=${accessToken}`;
    return this.httpClient.post(url, null);
  }

  public deleteVolumeFromUserBookshelf(bookshelfId: number, volumeId: string, accessToken: string): Observable<any> {
    const url = `https://www.googleapis.com/books/v1/mylibrary/bookshelves/${+bookshelfId}/removeVolume`
      + `?volumeId=${encodeURIComponent(volumeId)}&key=${apiKey}&access_token=${accessToken}`;
    return this.httpClient.post(url, null);
  }
}
