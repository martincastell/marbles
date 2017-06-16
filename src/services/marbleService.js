// import { Observable } from 'rxjs/Observable';
import {WebSocketSubject} from 'rxjs/observable/dom/WebSocketSubject';


const websocket = WebSocketSubject.create({
  url: 'ws://localhost:3000',
  resultSelector: (event) => event.data,
});

export function getMarbles$() {
  return websocket.asObservable();
}

export function sendMarble(marble) {
  websocket.next(marble);
}
