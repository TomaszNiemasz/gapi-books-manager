import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {IVolume, BooksService} from '../books.service';
import {AuthService} from '../auth.service';
import {IShelfChange} from '../book-thumbnail/book-thumbnail.component';

const FAVORITES_SHELF_ID = 0;
const TO_READ_SHELF_ID = 2;

@Component({
  selector: 'app-main-searcher',
  templateUrl: './main-searcher.component.html',
  styleUrls: ['./main-searcher.component.scss']
})
export class MainSearcherComponent implements OnInit {

  searchForm!: FormGroup;
  searchResults: IVolume[] = [];
  favoriteVolumeIds: string[] = [];
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
    this.loadShelves();
  }

  searchBooks(searchQuery: string) {
    if (!searchQuery || !searchQuery.trim()) {
      return;
    }
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

  // Pobiera książki z półek Favorites i "To Read" (tylko dla zalogowanego użytkownika).
  private loadShelves(): void {
    const token = this.authService.getSessionToken();
    if (!token) {
      return;
    }

    this.booksService.getUserBookshelfVolumes(FAVORITES_SHELF_ID, token).subscribe(
      volumes => {
        this.favoriteVolumeIds = volumes.map(volume => volume.id);
      },
      error => {
        console.warn('Nie udało się wczytać półki Favorites, status:', error.status);
      }
    );

    this.booksService.getUserBookshelfVolumes(TO_READ_SHELF_ID, token).subscribe(
      volumes => {
        this.toReadVolumeIds = volumes.map(volume => volume.id);
      },
      error => {
        console.warn('Nie udało się wczytać półki To Read, status:', error.status);
      }
    );
  }

  public isFavorite(volumeId: string): boolean {
    return this.favoriteVolumeIds.indexOf(volumeId) !== -1;
  }

  public isOnToReadShelf(volumeId: string): boolean {
    return this.toReadVolumeIds.indexOf(volumeId) !== -1;
  }

  // Karta zgłasza, że książka została dodana na półkę lub z niej usunięta: aktualizujemy naszą listę.
  public onShelfChanged(volumeId: string, change: IShelfChange): void {
    if (change.shelfId === FAVORITES_SHELF_ID) {
      this.favoriteVolumeIds = this.updateIds(this.favoriteVolumeIds, volumeId, change.added);
    } else if (change.shelfId === TO_READ_SHELF_ID) {
      this.toReadVolumeIds = this.updateIds(this.toReadVolumeIds, volumeId, change.added);
    }
  }

  // Zwraca nową listę identyfikatorów z dodanym lub usuniętym identyfikatorem książki.
  private updateIds(ids: string[], volumeId: string, added: boolean): string[] {
    const withoutVolume = ids.filter(id => id !== volumeId);
    return added ? withoutVolume.concat(volumeId) : withoutVolume;
  }
  
}
