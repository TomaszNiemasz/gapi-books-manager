import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IVolume, BooksService} from '../books.service';
import {AuthService} from '../auth.service';

// Numery półek w Google Books.
const FAVORITES_SHELF_ID = 0;
const TO_READ_SHELF_ID = 2;

// Półki, z których użytkownik może ręcznie usuwać książki:
// Favorites (0), To Read (2), Reading Now (3), Have Read (4).
const REMOVABLE_SHELF_IDS = [0, 2, 3, 4];

// Opis zmiany, o której karta informuje rodzica: na której półce i czy dodano (true) czy usunięto (false).
export interface IShelfChange {
  shelfId: number;
  added: boolean;
}

@Component({
  selector: 'app-book-thumbnail',
  templateUrl: './book-thumbnail.component.html',
  styleUrls: ['./book-thumbnail.component.scss']
})
export class BookThumbnailComponent implements OnInit {

  @Input() volume: IVolume;

  // Na której półce wyświetlamy tę kartę. Brak wartości = wyniki wyszukiwania.
  @Input() shelfId?: number;

  // Czy książka jest na półce Favorites / To Read (podaje to wyszukiwarka).
  @Input() inFavorites = false;
  @Input() inToRead = false;

  // Zdarzenie "książka została usunięta z półki" (używane na stronie biblioteki).
  @Output() removed = new EventEmitter<string>();

  // Zdarzenie "zmieniła się przynależność książki do półki" (używane w wyszukiwarce).
  @Output() shelfChanged = new EventEmitter<IShelfChange>();

  // Komunikat dla użytkownika, pokazywany tylko przy problemach.
  public statusMessage = '';

  // Czy właśnie trwa zapytanie do Google (blokuje przyciski, żeby nie klikać dwa razy).
  public isBusy = false;

  constructor(
    private booksService: BooksService,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  viewVolume(volumeId: string) {
    this.booksService.getVolumeById(volumeId)
      .subscribe(value => {
        console.log(value);
      });
  }

  // Czy pokazać przycisk usuwania: karta jest na półce i z tej półki wolno usuwać.
  public get canRemove(): boolean {
    return this.shelfId !== undefined && REMOVABLE_SHELF_IDS.indexOf(this.shelfId) !== -1;
  }

  public removeFromShelf(): void {
    const token = this.authService.getSessionToken();
    if (!token) {
      this.statusMessage = 'Zaloguj się, aby usunąć książkę z półki.';
      return;
    }

    this.booksService.deleteVolumeFromUserBookshelf(this.shelfId, this.volume.id, token)
      .subscribe(
        () => {
          this.removed.emit(this.volume.id);
        },
        error => {
          this.statusMessage = 'Nie udało się usunąć książki (status ' + error.status + ').';
        }
      );
  }

  // Kliknięcie serduszka: dodaje książkę do Favorites albo ją stamtąd usuwa.
  public toggleFavorite(): void {
    this.toggleShelf(FAVORITES_SHELF_ID, this.inFavorites);
  }

  // Kliknięcie zakładki: dodaje książkę do To Read albo ją stamtąd usuwa.
  public toggleToRead(): void {
    this.toggleShelf(TO_READ_SHELF_ID, this.inToRead);
  }

  private toggleShelf(shelfId: number, currentlyOnShelf: boolean): void {
    this.statusMessage = '';

    const token = this.authService.getSessionToken();
    if (!token) {
      this.statusMessage = 'Zaloguj się, aby zarządzać półkami.';
      return;
    }

    // Jeśli książka jest na półce, usuwamy ją; jeśli nie, dodajemy.
    const request = currentlyOnShelf
      ? this.booksService.deleteVolumeFromUserBookshelf(shelfId, this.volume.id, token)
      : this.booksService.addVolumeToUserBookshelf(shelfId, this.volume.id, token);

    this.isBusy = true;
    request.subscribe(
      () => {
        this.isBusy = false;
        this.shelfChanged.emit({shelfId: shelfId, added: !currentlyOnShelf});
      },
      error => {
        this.isBusy = false;
        this.statusMessage = 'Nie udało się zmienić półki (status ' + error.status + ').';
      }
    );
  }
}