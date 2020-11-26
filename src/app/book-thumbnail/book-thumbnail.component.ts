import {Component, Input, OnInit} from '@angular/core';
import {IVolume, BooksService} from '../books.service';

@Component({
  selector: 'app-book-thumbnail',
  templateUrl: './book-thumbnail.component.html',
  styleUrls: ['./book-thumbnail.component.scss']
})
export class BookThumbnailComponent implements OnInit {

  @Input() volume: IVolume;

  constructor(private booksService: BooksService) { }

  ngOnInit() {
  }

  viewVolume(volumeId: string) {
    this.booksService.getVolumeById(volumeId)
      .subscribe(value => {
        console.log(value);
      });
  }
}
