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
    concatAll, shareReplay, first
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, forkJoin} from 'rxjs';
import {Lesson} from '../model/lesson';
import { Store } from '../common/store.service';
import { createHttpObservable } from '../common/util';
import { debug } from '../common/debug';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId: number;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;

    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute,
                private store: Store) {


    }

    ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];

        this.course$ = this.store.selectCourseById(this.courseId);

        this.loadLessons().pipe(
            withLatestFrom(this.course$)
        ).subscribe(([lessons, course]) => {
            console.log(lessons)
            console.log(course)
        })

        // this.course$ = this.store.selectCourseById(this.courseId).pipe(
        //     first()
        // );

        // forkJoin(this.course$, this.loadLessons()).subscribe(res => {
        //     console.log(res)
        // })

    }

    ngAfterViewInit() {

        const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup').pipe(
            map(event => event.target.value),
            startWith(''),
            debug( /* RxJsLoggingLevel.INFO */ 0 , "search"),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(search => this.loadLessons(search))
        )

        const intitialLessons$ = this.loadLessons();

        this.lessons$ = concat(intitialLessons$, searchLessons$);
    }

    loadLessons(search = ''): Observable<Lesson[]> {

        return createHttpObservable(`api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`).pipe(
            map(res => res['payload'])
        );
    }




}
