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
import { Store } from '../common/store.service';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;

    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute,
                private store: Store) {


    }

    ngOnInit() {

        const courseId = this.route.snapshot.params['id'];

        this.course$ = this.store.selectCourseById(courseId);

    }

    ngAfterViewInit() {




    }




}
