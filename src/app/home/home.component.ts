import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, Observable, of, timer, noop} from 'rxjs';
import {catchError, delayWhen, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import { UtilService } from '../common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
                // commented code is imperative approach
            // more logic in subscribe block leads to nested subscribe which is like callback hell
            // and rxjs was introduced to avoi callback hell.
   // beginnerCourses: Course[];
   // advancedCourses: Course[];
   courses$: Observable<Course[]>;
   beginnerCourses$: Observable<Course[]>;
   advancedCourses$: Observable<Course[]>;
    constructor(private _util: UtilService) { }

    ngOnInit() {
  
      const http$ = this._util.createHttpObservable('/api/Courses');
  
      this.courses$ = http$.pipe(
        tap(() => console.log('http request executed')),
        map(res => Object.values(res['payload'])),
        shareReplay()  // avoids sending multiple API requests for the same observable (without this, following code sends two API requests, for each async pipe)
      );

      // this is reactive design
      this.beginnerCourses$ = this.courses$.pipe(
        map(courses => courses.filter(x=> x.category == 'BEGINNER'))
      );

      this.advancedCourses$ = this.courses$.pipe(
        map(courses => courses.filter(x=> x.category == 'ADVANCED'))
      );
  
    //   courses$.subscribe(
    //     courses => {
    //             //this.beginnerCourses = courses.filter(x=> x.category == 'BEGINNER');
    //             // this.advancedCourses = courses.filter(x=> x.category == 'ADVANCED');
    //     },
    //     noop,
    //     () => console.log('completed')
    //   );
    }

}
