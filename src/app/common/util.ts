import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import {  tap } from "rxjs/operators";

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

export enum LoggingLevels {
  TRACE,
  DEBUG,
  INFO,
  ERROR
}

let loggingLevel = LoggingLevels.INFO;

export function setLoggingLevel(level: LoggingLevels) {
  loggingLevel = level;
}

export const debug = (level:number, message: string) =>
    (source: Observable<any>) => source
      .pipe(
        tap(val => {
          if(level >= loggingLevel)
            console.log(message + ': ' , val);
        })
      )