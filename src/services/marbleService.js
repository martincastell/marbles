import { Observable } from 'rxjs/Observable';

export function getMarbles$() {
  return Observable.create((subscriber) => {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onmessage = function (event) {
      subscriber.next(event.data);
    };

    ws.onopen = function () {
      ws.send('Hello Server');
    };

    return () => ws.close();
  });
}

