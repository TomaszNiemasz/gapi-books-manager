import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IVolume, BooksService} from '../books.service';
import {AuthService} from '../auth.service';


const TO_READ_SHELF_ID = 2;
const REMOVABLE_SHELF_IDS = [0, 2, 3, 4];

@Component({
  selector: 'app-book-thumbnail',
  templateUrl: './book-thumbnail.component.html',
  styleUrls: ['./book-thumbnail.component.scss']
})
export class BookThumbnailComponent implements OnInit {

  @Input() volume: IVolume;
  @Input() shelfId?: number;
  @Input() alreadyOnShelf = false;
  public justAdded = false;
  @Output() removed = new EventEmitter<string>();
  public statusMessage = '';

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

  public addToShelf(): void {
    const token = this.authService.getSessionToken();
    if (!token) {
      this.statusMessage = 'Zaloguj się, aby dodać książkę do półki.';
      return;
    }

    this.booksService.addVolumeToUserBookshelf(TO_READ_SHELF_ID, this.volume.id, token)
      .subscribe(
        () => {
          this.justAdded = true;
          this.statusMessage = 'Dodano do półki "To Read".';
        },
        error => {
          this.statusMessage = 'Nie udało się dodać książki (status ' + error.status + ').';
        }
      );
  }

}
