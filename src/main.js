require('file-loader?name=index.html!./index.html');
require('!style-loader!css-loader!normalize.css/normalize.css');
import './app.css';
import Rx from 'rxjs/Rx';
import { Scheduler } from 'rxjs/Scheduler';
import * as marbleService from './services/marbleService';
import * as marbleGrid from './views/marbleGrid';

if (module.hot) {
  module.hot.accept();
}

const marbleRadius = 25;
const gridEl = document.querySelector('.grid');
const offset = gridEl.getBoundingClientRect();
const colorEl = document.getElementById('color');
const sourceEl = document.querySelectorAll('[name="source"]');
const random = (min, max) => Math.floor(Math.random() * max) + min;
const randomX = (offset) => random(0, offset.right);
const randomY = (offset) => random(0, offset.bottom);
const randomColor = () => `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
const buildMarble = ({ clientX, clientY }, color) => ({
  x: clientX - marbleRadius,
  y: clientY - offset.top - marbleRadius,
  color});
const getColor$ = () => Rx.Observable
  .fromEvent(colorEl, 'change')
  .map((event) => event.target.value)
  .startWith(colorEl.value);

const gridSize$ = Rx.Observable
  .fromEvent(window, 'resize')
  .debounceTime(300)
  .map(() => gridEl.getBoundingClientRect())
  .startWith(offset);

const sources = {
  mousemove: () => Rx.Observable
    .fromEvent(document.documentElement, 'mousemove')
    .throttleTime(50)
    .withLatestFrom(getColor$(), buildMarble),
  websocket: () =>  marbleService.getMarbles$(),
  random: () =>
    Rx.Observable
      .combineLatest(Rx.Observable.interval(500), gridSize$)
      .map(([_, offset]) => ({ x: randomX(offset), y: randomY(offset), color: randomColor() })),
  click: () => Rx.Observable.fromEvent(gridEl, 'click')
    .withLatestFrom(getColor$(), buildMarble),
};

const source$ = Rx.Observable.fromEvent(sourceEl, 'change')
  .map((event) => event.target.value)
  .startWith('click')
  .switchMap((sourceName) => sources[sourceName]());

const marble$ = source$
  .scan((acc, marble) => [...acc, marble], []);

const animationFrame$ = Rx.Observable.interval(0, Scheduler.animationFrame);
animationFrame$
  .withLatestFrom(marble$, (_frame, marble) => marble)
  .distinctUntilChanged()
  .subscribe((marbles) => {
    marbleGrid.render(gridEl, marbles);
  });
