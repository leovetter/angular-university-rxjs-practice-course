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

        // Init the subject with value from the backend
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
        // Return observable that emit only course from given category
        return this.courses$.pipe(
            map(courses => courses.filter(course => course.category === category))
        );
    }

    selectCourseById(courseId: number) {
        // Return observable that emit only course from given id
        return this.courses$.pipe(
            map(courses => courses.find(course => course.id == courseId)),
            filter(course => !!course)
        )
    }

    /**
     * Get the course from the subject. Edit the course with new course. 
     * Call next on the subject with new course
     * Edit the backend
     * @param courseId 
     * @param changes 
     * @returns 
     */
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