import Canvas from './Canvas';

// このクラス内に ページごとのcanvas外の処理を書いていきます
export default class Page00 {
  constructor() {
    const canvas = new Canvas();

    canvas.scrolled(window.scrollY);

    window.addEventListener('mousemove', e => {
      canvas.mouseMoved(e.clientX, e.clientY);
    });

    window.addEventListener('scroll', e => {
      canvas.scrolled(window.scrollY);
    });
  }
};