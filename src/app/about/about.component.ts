import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { concat, fromEvent, interval, merge, noop, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    const click$ = fromEvent(document, 'click');

    // click$.subscribe(
    //   evt => console.log(evt),
    //   err => console.log(err),
    //   () => console.log("completed")
    // )

    // const source1$ = of(1,2,3);
    // const source2$ = of(4,5,6);
    // const source3$ = of(7,8,9);
    
    // const result$ = concat(source1$, source2$, source3$)
    // result$.subscribe(console.log);

    // const interval1$ = interval(1000);
    // const interval2$ = interval1$.pipe(map(val => 10 * val));
    
    // const result$ = merge(interval1$, interval2$);
    // result$.subscribe(console.log);

    const http$ = createHttpObservable('api/courses');
    const sub = http$.subscribe(console.log);

    setTimeout(() => sub.unsubscribe(), 0);
  }
}
