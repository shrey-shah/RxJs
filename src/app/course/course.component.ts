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
        this.lessons$ = this.loadLessons();
    }

    ngAfterViewInit() {
        fromEvent<any>(this.input.nativeElement, 'keyup')
        .pipe(
            map(event => event.target.value),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(search => this.loadLessons(search)) // cancels the current observable if any new observable arrives. best suitable in search filtering
        )
        .subscribe(console.log);
    }

    loadLessons(filter = '') {
        return this._util.createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${filter}`)
        .pipe(
            map(res => res["payload"])
        );
    }




}
