//PIXI置き換え
let Container = PIXI.Container,
autoDetectRenderer = PIXI.autoDetectRenderer,
loader = PIXI.loader,
resources = PIXI.loader.resources,
Sprite = PIXI.Sprite,
Rectangle = PIXI.Rectangle;

let dpi_x = 1280,
    dpi_y = 720;

let player = {
  x: 0,
  y: 0
};

let map = {
  tex: [0,0,0,0],
  x: 0,
  y: 0,
  x_dir: 0,
  y_dir: 0,
  x_disp: 0,
  y_disp: 0,
  load: (x, y) => {
    let tx;
    let ty;
    map.x = Math.floor(x / dpi_x);
    map.y = Math.floor(y / dpi_y);
    tx = map.x_disp = x % dpi_x;
    ty = map.y_disp = y % dpi_y;
    map.x_dir = (map.x_disp >= dpi_x / 2) ? 1 : -1;
    map.y_dir = (map.y_disp >= dpi_y / 2) ? 1 : -1;
    console.log("mapload :");
    console.log("img/base_" + map.x + "_" + map.y + ".png");
    console.log("img/base_" + (map.x + map.x_dir) + "_" + map.y + ".png");
    console.log("img/base_" + map.x + "_" + (map.y + map.y_dir) + ".png");
    console.log("img/base_" + (map.x + map.x_dir) + "_" + (map.y + map.y_dir) + ".png");
    map.tex[0] = Sprite.fromImage("img/base_" + map.x + "_" + map.y + ".png");
    map.tex[1] = Sprite.fromImage("img/base_" + (map.x + map.x_dir) + "_" + map.y + ".png");
    map.tex[2] = Sprite.fromImage("img/base_" + map.x + "_" + (map.y + map.y_dir) + ".png");
    map.tex[3] = Sprite.fromImage("img/base_" + (map.x + map.x_dir) + "_" + (map.y + map.y_dir) + ".png");
    // loader
    //   .add("img/base_" + map_x + "_" + map_y + ".png")
    //   .add("img/base_" + (map_x + x_dir) + "_" + map_y + ".png")
    //   .add("img/base_" + map_x + "_" + (map_y + y_dir) + ".png")
    //   .add("img/base_" + (map_x + x_dir) + "_" + (map_y + y_dir) + ".png");
    map.tex[0].position.set(tx,ty);
    map.tex[1].position.set(tx + (dpi_x * map.x_dir), ty);
    map.tex[2].position.set(tx, map.y + ty + (dpi_y * map.y_dir));
    map.tex[3].position.set(tx + (dpi_x * map.x_dir), ty + (dpi_y * map.y_dir));
  },
  addch: (container) => {
    container.addChild(map.tex[0]);
    container.addChild(map.tex[1]);
    container.addChild(map.tex[2]);
    container.addChild(map.tex[3]);
  }
}
