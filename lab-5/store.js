// moduł zarządzania stanem

import { getRandomColor, generateId } from './helpers.js';

class Store {
  #state = {
    shapes: []
  };
  #subscribers = new Set();
  #STORAGE_KEY = 'shapes-app-state';

  constructor() {
    this.#loadFromStorage();
  }

  get shapes() {
    return [...this.#state.shapes];
  }

  get squaresCount() {
    return this.#state.shapes.filter(s => s.type === 'square').length;
  }

  get circlesCount() {
    return this.#state.shapes.filter(s => s.type === 'circle').length;
  }

  addShape(type) {
    const newShape = {
      id: generateId(),
      type: type,
      color: getRandomColor()
    };
    this.#state.shapes.push(newShape);
    this.#notify();
  }

  removeShape(id) {
    this.#state.shapes = this.#state.shapes.filter(shape => shape.id !== id);
    this.#notify();
  }

  recolor(typeToRecolor) {
    this.#state.shapes = this.#state.shapes.map(shape => {
      if (shape.type === typeToRecolor) {
        return { ...shape, color: getRandomColor() };
      }
      return shape;
    });
    this.#notify();
  }

  subscribe(callback) {
    this.#subscribers.add(callback);
    callback(this); 
    return () => this.#subscribers.delete(callback);
  }

  #notify() {
    this.#saveToStorage();
    for (const callback of this.#subscribers) {
      callback(this); 
    }
  }

  //local storage
  #saveToStorage() {
    try {
      localStorage.setItem(this.#STORAGE_KEY, JSON.stringify(this.#state));
    } catch (e) {
      console.error('Błąd zapisu do localStorage', e);
    }
  }

  #loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.#STORAGE_KEY);
      if (stored) {
        this.#state = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Błąd odczytu z localStorage', e);
    }
  }
}

export const store = new Store();