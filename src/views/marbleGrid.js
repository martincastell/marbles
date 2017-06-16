import './marbleGrid.css';

function buildMarbleEl(marble) {
  const el = document.createElement('span');
  el.classList.add('marble');
  el.style.cssText = `background-color: ${marble.color}; left: ${marble.x}px; top: ${marble.y}px`;
  return el;
}

function buildMarbles(marbles) {
  return marbles
    .map(buildMarbleEl)
    .reduce((fragment, el) => {
      fragment.appendChild(el);
      return fragment;
    }, document.createDocumentFragment());
}

export function render(el, marbles) {
  el.innerHTML = '';
  el.appendChild(buildMarbles(marbles));
}
