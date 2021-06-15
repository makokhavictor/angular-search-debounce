import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, of } from 'rxjs';
import {
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap
} from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  name = 'Angular';
  results$: Observable<any>;
  isLoading: Boolean = false;

  subject = new Subject();
  constructor(private http: HttpClient) {}
  ngOnInit() {
    var self = this;
    this.results$ = this.subject.pipe(
      tap(() => (this.isLoading = true)),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((searchText: String) => this.fetchItems(searchText)),
      tap(() => (this.isLoading = false))
    );
  }

  fetchItems(searchText: String) {
    return this.http.get('https://jsonplaceholder.typicode.com/todos').pipe(
      map((res: any[]) => {
        return res.filter((val: any, index) => {
          return val.title.indexOf(searchText) > -1;
        });
      })
    );
  }
  searchTodos(event) {
    let searchText: String = event.target.value;
    this.subject.next(searchText);
  }
}
