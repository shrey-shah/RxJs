import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import { UtilService } from '../common/util';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;
    courseId: string;
    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute,private _util: UtilService) {
    }

    ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];
        this.course$ = this._util.createHttpObservable(`/api/courses/${this.courseId}`);
       // this.lessons$ = this.loadLessons();
    }

    ngAfterViewInit() {
        // const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
        // .pipe(
        //     map(event => event.target.value),
        //     debounceTime(400),
        //     distinctUntilChanged(),
        //     switchMap(search => this.loadLessons(search)) // cancels the current observable if any new observable arrives. best suitable in search filtering
        // )
        // //.subscribe(console.log);

        // const initialLessons$ = this.loadLessons();

        // this.lessons$ = concat(initialLessons$, searchLessons$);

        this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
        .pipe(
            map(event => event.target.value),
            startWith(''),  // trigger observable with empty string (alternative of concating for initial and filtered data)
            debounceTime(400), // read debouncing vs throttling
            distinctUntilChanged(),
            switchMap(search => this.loadLessons(search)) // cancels the current observable if any new observable arrives. best suitable in search filtering
        )
    }

    loadLessons(filter = ''): Observable<Lesson[]> {
        return this._util.createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${filter}`)
        .pipe(
            map(res => res["payload"])
        );
    }




}
