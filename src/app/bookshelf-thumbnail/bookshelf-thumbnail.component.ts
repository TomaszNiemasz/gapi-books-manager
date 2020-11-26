import {Component, Input, OnInit} from '@angular/core';
import {IBookshelf, BooksService, IVolume} from '../books.service';
import {AuthService} from '../auth.service';
import * as Glider from 'glider-js';

@Component({
  selector: 'app-bookshelf-thumbnail',
  templateUrl: './bookshelf-thumbnail.component.html',
  styleUrls: ['./bookshelf-thumbnail.component.scss']
})
export class BookshelfThumbnailComponent implements OnInit {

  @Input() bookshelf: IBookshelf;
  bookshelfVolumes: IVolume[];

  constructor(
    private booksService: BooksService,
    private authService: AuthService
  ) { }

  ngOnInit() {
/*    Glider(document.querySelector('.glider'), {
      slidesToShow: 5,
      slidesToScroll: 5,
      draggable: true,
      dots: '.dots',
      arrows: {
        prev: '.glider-prev',
        next: '.glider-next'
      }
    });*/
    this.getBookshelfVolumes(this.bookshelf.id);
  }

  getBookshelfVolumes(bookshelfId: number) {
    this.booksService.getUserBookshelfVolumes(bookshelfId, this.authService.getSessionToken())
      .subscribe(data => {
        this.bookshelfVolumes = data;
        console.log(this.bookshelf.title + ': ' + this.bookshelfVolumes);
      });
  }
}
