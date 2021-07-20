import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { Course } from "../model/course";

@Injectable({
    providedIn: 'root'
})
export class Store {

    private subject = new BehaviorSubject<Course[]>([]);

    courses$: Observable<Course[]> = this.subject.asObservable();

    init() {

    }
}