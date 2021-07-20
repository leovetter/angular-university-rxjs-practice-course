import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { map, tap } from "rxjs/operators";
import { Course } from "../model/course";
import { createHttpObservable } from "./util";

@Injectable({
    providedIn: 'root'
})
export class Store {

    private subject = new BehaviorSubject<Course[]>([]);

    courses$: Observable<Course[]> = this.subject.asObservable();

    init() {

        const http$ = createHttpObservable('/api/courses');

        http$.pipe(
            tap(() => 'Http request executed'),
            map(res => Object.values(res['payload']))
        ).subscribe(
            (courses: Course[]) => this.subject.next(courses)
        )
    }

    selectBeginnerCourses() {
        return this.filterByCategory('BEGINNER');
    }

    selectAdvancedCourses() {
        return this.filterByCategory('BEGINNER');
    }

    filterByCategory(category: string) {
        return this.courses$.pipe(
            map(courses => courses.filter(course => course.category === category))
        );
    }
}