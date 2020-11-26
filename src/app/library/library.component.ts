import {Component, OnInit} from '@angular/core';
import {IBookshelf, BooksService, IVolume} from '../books.service';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

  destinations = [
    {label: 'Something', icon: 'inbox', activated: true},
    {label: 'Something', icon: 'star', activated: false},
    {label: 'Something', icon: 'send', activated: false},
    {label: 'Something', icon: 'drafts', activated: false}
  ];

  bookshelves: IBookshelf[];

  constructor(
    private authService: AuthService,
    private booksService: BooksService
  ) {
  }

  ngOnInit() {
    this.getBookshelves();
  }

  getBookshelves() {
    this.booksService.getUserBookshelves(this.authService.getSessionToken())
      .subscribe(data => {
      this.bookshelves = data;
      console.log(this.bookshelves);
    });
  }
}
