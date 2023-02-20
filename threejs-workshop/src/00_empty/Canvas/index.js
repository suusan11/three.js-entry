import * as THREE from 'three';

// 必要なクラスだけ呼び出して、バンドル後のファイルサイズを縮小できる（↑は全てインポートしてるから）
// import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';
// import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
// import { Scene } from 'three/src/scenes/Scene';
// import { PointLight } from 'three/src/lights/PointLight';
// import { BoxGeometry } from 'three/src/geometries/BoxGeometry';
// import { MeshLambertMaterial } from 'three/src/materials/MeshLambertMaterial';
// import { Mesh } from 'three/src/objects/Mesh';

// このクラス内に three.js のコードを書いていきます
export default class Canvas {
  constructor(elementId) {
    // スクロール量
    this.scrollY = 0;

    // elementIdのついたDOM要素を取得
    this.elementId = document.getElementById(elementId);
    const rect = this.elementId.getBoundingClientRect();

    // マウス座標を保存
    this.mouse = new THREE.Vector2(0, 0);

    this.w = window.innerWidth;
    this.h = window.innerHeight;

    // レンダラーを作成
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
    });
    this.renderer.setSize(this.w, this.h);// 描画サイズ
    this.renderer.setPixelRatio(window.devicePixelRatio);// ピクセル比

    // #canvas-containerにレンダラーのcanvasを追加
    const container = document.getElementById("canvas-container");
    container.appendChild(this.renderer.domElement);

    // カメラを作成 (視野角, 画面のアスペクト比, カメラに映る最短距離, カメラに映る最遠距離)
    // this.camera = new THREE.PerspectiveCamera(60, this.w / this.h, 1, 10);
    // this.camera.position.z = 3;// カメラを遠ざける

    // ウィンドウとWebGLの座標を統一させる = ライトなどの位置やオブジェクトのサイズをpxで扱えるようになる
    // 視野角をラジアンに変換
    const fov = 60;
    const fovRad = (fov / 2) * (Math.PI / 180);
    const dist = (this.h / 2) / Math.tan(fovRad);

    this.camera = new THREE.PerspectiveCamera(fov, this.w / this.h, 1, dist * 2);
    this.camera.position.z = dist;// カメラを遠ざける

    // シーン
    this.scene = new THREE.Scene();

    // ライトを作成
    this.light = new THREE.PointLight(0x00ffff);
    // this.light.position.set(2, 2, 2); // ライトの位置を設定
    // this.light.position.set(400, 400, 400); // ライトの位置を設定(px)
    this.light.position.set(0, 0, 400); // マウス操作に合わせたいからxとyは0にしておく

    // ライトをシーンに追加
    this.scene.add(this.light);

    // 立方体のジオメトリを作成(幅, 高さ, 奥行き)
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const geometry = new THREE.BoxGeometry(300, 300, 300);

    // DOMRectサイズの直方体ジオメトリを作成(幅, 高さ, 奥行き)
    const depth = 300;
    const geometry = new THREE.BoxGeometry(rect.width, rect.height, depth);


    // マテリアルを作成
    const material = new THREE.MeshLambertMaterial({ color: 0xffffff });

    // ジオメトリとマテリアルからメッシュを作成
    this.mesh = new THREE.Mesh(geometry, material);
    // DOMRectのサイズをジオメトリに反映するとき、奥行きの半分前に出ているのを下げる
    // this.mesh.position.z = -depth / 2;

    // ウィンドウ中心からDOMRect中心へのベクトルを求めてオフセットする
    const center = new THREE.Vector2(rect.x + rect.width / 2, rect.y + rect.height / 2);
    const diff = new THREE.Vector2(center.x - this.w / 2, center.y - this.h / 2);
    // this.mesh.position.set(diff.x, -diff.y, -depth/2);
    this.mesh.position.set(diff.x, -(diff.y + this.scrollY), -depth/2);
    this.offsetY = this.mesh.position.y;

    // 回転させる

    // rotationの角度の単位は「radian」なのでMath.PIを使って計算する
    // PI = 180なので 180° / 4 = 45°になる
    // this.mesh.rotation.x = Math.PI / 4;
    // this.mesh.rotation.y = Math.PI / 4;

    // THREE.Math.DEG2RADを使えば度数法で指定することもできる
    // this.mesh.rotation.x = THREE.Math.DEG2RAD * 45;
    // this.mesh.rotation.y = THREE.Math.DEG2RAD * 45;

    // メッシュをシーンに追加
    this.scene.add(this.mesh);

    // 画面に表示
    // this.renderer.render(this.scene, this.camera);

    // 描画ループ開始
    this.render();
  }

  render() {
    // 次のフレームを要求
    requestAnimationFrame(() => {this.render();});

    // ちょっとずつ回転させる
    // this.mesh.rotation.x += 0.01;
    // this.mesh.rotation.y += 0.01;

    // 時間ベースのアニメーション
    // const sec = performance.now() / 1000; // ミリ秒から秒に変換
    // this.mesh.rotation.x = sec * (Math.PI / 4); // 1秒で45°回転する
    // this.mesh.rotation.y = sec * (Math.PI / 4); // 1秒で45°回転する

    // スクロールに追従させる
    // this.mesh.position.y = this.scrollY;
    // DOM要素に合わせて追従させる
    this.mesh.position.y = this.offsetY + this.scrollY;

    this.renderer.render(this.scene, this.camera);
  }

  // マウスイベント
  mouseMoved(x, y) {
    this.mouse.x = x - (this.w / 2); // 原点を中心に持ってくる
    this.mouse.y = -y + (this.h / 2); // 軸を反転して原点を中心に持ってくる

    // ライトの xy座標 をマウス位置にする
    this.light.position.x = this.mouse.x;
    this.light.position.y = this.mouse.y;
  }

  scrolled(y) {
    this.scrollY = y;
  }
};
