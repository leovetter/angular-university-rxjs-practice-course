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

    
    // this.fromEvent();
    this.concat();
    // this.merge();
    

   
  }

  fromEvent() {

    // Create an observable from a click event on the document
    const click$ = fromEvent(document, 'click');

    click$.subscribe(
      evt => console.log(evt),
      err => console.log(err),
      () => console.log("completed")
    )
  }

  concat() {

    // Create three observable
    const source1$ = of(1,2,3);
    const source2$ = of(4,5,6);
    const source3$ = of(7,8,9);
    
    /**
    * Concat the observables. 
    * Next transaction (subscription) cannot start until the previous completes.
    * The subscrition will emit all the values of the first observable
    * then all the values of the second, then the third.
    */
    const result$ = concat(source1$, source2$, source3$)
    result$.subscribe(console.log);
  }

  merge() {

    // Emit values. 0 1 2 3 ...
    const interval1$ = interval(1000);
    // Transform and emit new values. 10 20 30 ...
    const interval2$ = interval1$.pipe(map(val => 10 * val));
    
    // Merge the observables. Subscription will emit new values of both observable as they arrive
    // that is. 0 1 10 2 20 3 30 ...
    const result$ = merge(interval1$, interval2$);
    result$.subscribe(console.log);
  }

  fromObs() {

    // Create observable from request
    const http$ = createHttpObservable('api/courses');
    // Subscribe and log the result
    const sub = http$.subscribe(console.log);

    // Cancel the request
    setTimeout(() => sub.unsubscribe(), 5000);
  }
}
