import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {IVolume, BooksService} from '../books.service';

@Component({
  selector: 'app-main-searcher',
  templateUrl: './main-searcher.component.html',
  styleUrls: ['./main-searcher.component.scss']
})
export class MainSearcherComponent implements OnInit {

  searchForm: FormGroup;
  searchResults: IVolume[];

  constructor(private fb: FormBuilder, private booksService: BooksService) {
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      searchQuery: ['']
    });
  }

  searchBooks(searchQuery: string) {
    this.booksService.searchVolumes(searchQuery).
    subscribe((volumes: IVolume[]) => {
      this.searchResults = volumes;
      console.log(volumes);
    });
  }
}
