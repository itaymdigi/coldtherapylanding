import '@testing-library/jest-dom/vitest';

if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
    onchange: null,
    media: '',
  });
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
    }

    observe(element) {
      this.callback([{ isIntersecting: true, target: element }]);
    }

    unobserve() {}

    disconnect() {}
  };
}
