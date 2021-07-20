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
import {merge, fromEvent, Observable, concat, forkJoin} from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { debug } from '../common/debug';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;
    courseId: number;

    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {

        // Get the course id
        this.courseId = this.route.snapshot.params['id'];

        // Create observable from request
        this.course$ = createHttpObservable(`/api/courses/${this.courseId}`).pipe(
            map(res => res as Course)
        );

        const lessons$ = this.loadLessons();

        /**
         * When the two observables completes
         * emit the last emitted values from each
         */
        forkJoin([this.course$, lessons$])
        .pipe(
            tap(([course, lessons]) => {

                console.log(course)
                console.log(lessons)
            })
        )
        .subscribe(res => {

        })
    }

    ngAfterViewInit() {

        // Create an observable from a keyup event on the input
        const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup').pipe(
            // Get the value of the input
            map(event => event.target.value),
            // Emit value '' first
            startWith(''),
            debug( /* RxJsLoggingLevel.INFO */ 0 , "search"),
            // Discard emitted values that take less than the specified time between output
            debounceTime(400),
            // Only emit when the current value is different than the last.
            distinctUntilChanged(),
            // Map to observable, complete previous inner observable, emit values.
            switchMap(search => this.loadLessons(search))
        )

        const intitialLessons$ = this.loadLessons();

        /**
        * Concat the observables. 
        * Next transaction (subscription) cannot start until the previous completes.
        * The subscrition will emit the initial lessions then the search lessons
        */
        this.lessons$ = concat(intitialLessons$, searchLessons$);
    }

    loadLessons(search = ''): Observable<Lesson[]> {

        return createHttpObservable(`api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`).pipe(
            map(res => res['payload'])
        );
    }




}
