import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {IVolume, BooksService} from '../books.service';
import {AuthService} from '../auth.service';

const TO_READ_SHELF_ID = 2;

@Component({
  selector: 'app-main-searcher',
  templateUrl: './main-searcher.component.html',
  styleUrls: ['./main-searcher.component.scss']
})
export class MainSearcherComponent implements OnInit {

  searchForm: FormGroup;
  searchResults: IVolume[];
  toReadVolumeIds: string[] = [];

  constructor(
    private fb: FormBuilder,
    private booksService: BooksService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      searchQuery: ['']
    });
    this.loadToReadShelf();
  }

  searchBooks(searchQuery: string) {
    this.booksService.searchVolumes(searchQuery).subscribe(
      (volumes: IVolume[]) => {
        this.searchResults = volumes;
        console.log('Znaleziono książek:', volumes.length);
      },
      error => {
        console.warn('Wyszukiwanie nie powiodło się, status:', error.status);
      }
    );
  }

  private loadToReadShelf(): void {
    const token = this.authService.getSessionToken();
    if (!token) {
      return;
    }

    this.booksService.getUserBookshelfVolumes(TO_READ_SHELF_ID, token).subscribe(
      volumes => {
        this.toReadVolumeIds = volumes.map(volume => volume.id);
      },
      error => {
        console.warn('Nie udało się wczytać półki To Read, status:', error.status);
      }
    );
  }

  public isOnToReadShelf(volumeId: string): boolean {
    return this.toReadVolumeIds.indexOf(volumeId) !== -1;
  }
  
}
