import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { fromPromise } from "rxjs/internal-compatibility";
import { Observable } from "rxjs/internal/Observable";
import { filter, map, tap } from "rxjs/operators";
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

    selectCourseById(courseId: number) {
        return this.courses$.pipe(
            map(courses => courses.find(course => course.id == courseId)),
            filter(course => !!course)
        )
    }

    saveCourse(courseId: number, changes) {

        const courses = this.subject.getValue();

        const courseIndex = courses.findIndex(course => course.id == courseId);

        const newCourse = courses.slice(0);

        newCourse[courseIndex] = {
            ...courses[courseIndex],
            ...changes
        };

        this.subject.next(newCourse);

        return fromPromise(fetch(`/api/courses/${courseId}`, {
            method: 'PUT',
            body: JSON.stringify(changes),
            headers: {
                'content-type': 'application/json'
            }
        }))
    }
}