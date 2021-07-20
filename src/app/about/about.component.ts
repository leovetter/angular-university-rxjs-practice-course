import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    // this.behaviorSubject();
    // this.asyncSubject();
    this.replaySUbject();
  }

  behaviorSubject() {

    // Requires an initial value and emits the current value to new subscribers
    const subject = new BehaviorSubject(0);

    // Derive an observable from the subject
    const series$ = subject.asObservable();

    series$.subscribe(val => console.log('first sub : ' + val));

    subject.next(1);
    subject.next(2);
    subject.next(3);

    subject.complete();

    setTimeout(() => {

      series$.subscribe(val => console.log('late sub : ' + val));

      subject.next(4);

    }, 3000)
  }

  asyncSubject() {

    // Emits its last value on completion
    const subject = new AsyncSubject();

    // Derive an observable from the subject
    const series$ = subject.asObservable();

    series$.subscribe(val => console.log('first sub : ' + val));

    subject.next(1);
    subject.next(2);
    subject.next(3);

    subject.complete();

    setTimeout(() => {

      series$.subscribe(val => console.log('second sub : ' + val));

      // subject.next(4);

    }, 3000)
  }

  replaySUbject() {

    // Replays" or emits old values to new subscribers
    const subject = new ReplaySubject();

    // Derive an observable from the subject
    const series$ = subject.asObservable();

    series$.subscribe(val => console.log('first sub : ' + val));

    subject.next(1);
    subject.next(2);
    subject.next(3);

    // subject.complete();

    setTimeout(() => {

      series$.subscribe(val => console.log('second sub : ' + val));

      subject.next(4);

    }, 3000)
  }

}
