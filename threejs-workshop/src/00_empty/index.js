import Canvas from './Canvas';

// このクラス内に ページごとのcanvas外の処理を書いていきます
export default class Page00 {
  constructor() {
    // const canvas = new Canvas();
    
    // DOM要素を取得するために、コンストラクタでidを引数で取ってくる
    const canvas = new Canvas('scroll-container_title');

    canvas.scrolled(window.scrollY);

    window.addEventListener('mousemove', e => {
      canvas.mouseMoved(e.clientX, e.clientY);
    });

    window.addEventListener('scroll', e => {
      canvas.scrolled(window.scrollY);
    });
  }
};