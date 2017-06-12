require('file-loader?name=index.html!./index.html');
import * as marbleService from './services/marbleService';

if (module.hot) {
  module.hot.accept();
}

marbleService.getMarbles$()
  .subscribe((data) => {
    let hello = document.getElementById('hello');
    hello.innerHTML = data;
  });
