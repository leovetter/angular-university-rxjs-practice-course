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

        const courses$ = http$.pipe(
            tap(() => console.log("request executed")),
            map(res => Object.values(res['payload'] as Course[])),
            // Share source and replay specified number of emissions on subscription.
            shareReplay(),
            retryWhen(errors => errors.pipe(
                delayWhen(() => timer(2000))
            ))
        );

        this.beginnerCourses$ = courses$.pipe(map(courses => courses.filter(course => course.category == 'BEGINNER')));
        this.advancedCourses$ = courses$.pipe(map(courses => courses.filter(course => course.category == 'ADVANCED')));
    }
}
