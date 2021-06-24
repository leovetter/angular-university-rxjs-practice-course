import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delayWhen, finalize, map, retry, retryWhen, shareReplay, tap} from 'rxjs/operators';
import { createHttpObservable } from '../common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnerCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;

    constructor() {

    }

    ngOnInit() {

        const http$ = createHttpObservable('/api/courses');

        // const courses$ = http$.pipe(
        //     tap(() => console.log("request executed")),
        //     map(res => Object.values(res['payload'] as Course[])),
        //     shareReplay(),
        //     catchError(err => of([{
        //         id: 1,
        //         description: "Angular for Beginners",
        //         iconUrl: 'https://angular-academy.s3.amazonaws.com/thumbnails/angular2-for-beginners-small-v2.png',
        //         courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
        //         longDescription: "Establish a solid layer of fundamentals, learn what's under the hood of Angular",
        //         category: 'BEGINNER',
        //         lessonsCount: 10
        //     }])));

        // const courses$ = http$.pipe(
        //     tap(() => console.log("request executed")),
        //     map(res => Object.values(res['payload'] as Course[])),
        //     shareReplay(),
        //     catchError(err => {
        //         console.log(err)
        //         return throwError(err)
        //     }),
        //     finalize(() => {

        //         console.log('Finalize executed');
        //     }));

        // const courses$ = http$.pipe(
        //     catchError(err => {
        //         console.log(err)
        //         return throwError(err)
        //     }),
        //     finalize(() => {

        //         console.log('Finalize executed');
        //     }),
        //     tap(() => console.log("request executed")),
        //     map(res => Object.values(res['payload'] as Course[])),
        //     shareReplay(),
        // );

        const courses$ = http$.pipe(
            tap(() => console.log("request executed")),
            map(res => Object.values(res['payload'] as Course[])),
            shareReplay(),
            retryWhen(errors => errors.pipe(
                delayWhen(() => timer(2000))
            ))
        );

        this.beginnerCourses$ = courses$.pipe(map(courses => courses.filter(course => course.category == 'BEGINNER')));
        this.advancedCourses$ = courses$.pipe(map(courses => courses.filter(course => course.category == 'ADVANCED')));
    }
}
