import { Observable } from "rxjs";

export function createHttpObservable(url: string) {

    /**
    * Create an observable.
    * Take a function as argument
    */
    const http$ = new Observable(observer => {
      /**
       * The observer argument (private) allow to emit out new values,
       * error out the observable or complete the observable
       */

      // An abort controller allow to abort the request
      const controller = new AbortController();
      // If signal is true then the fetch request is aborted
      const signal = controller.signal;

        fetch(url, {signal}).then(response => {
  
          if(response.ok) {
            return response.json();
          } else {
            observer.error('Request failed with status code : ' + response.status);
          }
          
        }).then(body => {
  
          // The observable emit the body of the response then complete
          observer.next(body);
          observer.complete();
        }).catch(err => {
  
          // Error out our observable
          observer.error(err);
        })

        /**
         * Cancelation function. Calling unsubscribe on this observable call this function
         * which in turn cancel the fetch request
         */
        return () => controller.abort();
      });

      return http$;
}

