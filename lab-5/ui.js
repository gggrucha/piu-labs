// moduł manipulacji DOM, subskrybuje store

import { store } from './store.js';

const DOM = {
  addSquareBtn: document.getElementById('addSquare'),
  addCircleBtn: document.getElementById('addCircle'),
  recolorSquaresBtn: document.getElementById('recolorSquares'),
  recolorCirclesBtn: document.getElementById('recolorCircles'),
  cntSquares: document.getElementById('cntSquares'),
  cntCircles: document.getElementById('cntCircles'),
  board: document.getElementById('board'),
};

function createShapeElement(shapeData) {
  const el = document.createElement('div');
  el.className = `shape ${shapeData.type}`;
  el.dataset.id = shapeData.id; 
  el.style.backgroundColor = shapeData.color;
  return el;
}

function syncShapesWithDOM(shapes) {
  const existingElements = Array.from(DOM.board.children);
  const existingIds = new Set(existingElements.map(el => el.dataset.id));
  const newIds = new Set(shapes.map(s => s.id));

  existingElements.forEach(el => {
    if (!newIds.has(el.dataset.id)) {
      el.remove();
    }
  });

  shapes.forEach(shape => {
    let el = existingElements.find(e => e.dataset.id === shape.id);

    if (!el) {
      el = createShapeElement(shape);
      DOM.board.appendChild(el);
    } else {
      if (el.style.backgroundColor !== shape.color) {
        el.style.backgroundColor = shape.color;
      }
    }
  });
}

function updateCounters(storeInstance) {
  DOM.cntSquares.textContent = storeInstance.squaresCount;
  DOM.cntCircles.textContent = storeInstance.circlesCount;
}

function render(storeInstance) {
  updateCounters(storeInstance);
  syncShapesWithDOM(storeInstance.shapes);
}

export function initUI() {
  DOM.addSquareBtn.addEventListener('click', () => store.addShape('square'));
  DOM.addCircleBtn.addEventListener('click', () => store.addShape('circle'));
  DOM.recolorSquaresBtn.addEventListener('click', () => store.recolor('square'));
  DOM.recolorCirclesBtn.addEventListener('click', () => store.recolor('circle'));

  DOM.board.addEventListener('click', (e) => {
    const shapeEl = e.target.closest('.shape');
    if (shapeEl) {
      const id = shapeEl.dataset.id;
      store.removeShape(id);
    }
  });
  store.subscribe(render);
}