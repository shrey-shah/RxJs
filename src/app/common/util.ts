import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class UtilService {
    
      createHttpObservable(url: string) {
        return Observable.create(observer => {
          fetch(url)
            .then(res => {
              return res.json();
            })
            .then(body => {
              observer.next(body);
              observer.complete();
            })
            .catch(err => {
              observer.console.error((err));
              
            })
        });
      }
}