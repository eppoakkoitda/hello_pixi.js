var type = "WebGL";
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}
PIXI.utils.sayHello(type);

let stage = new Container();

stage.scale.x = stage.scale.y = window.innerWidth / dpi_x;

let renderer = autoDetectRenderer(dpi_x, dpi_y);
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(dpi_x * (window.innerWidth / dpi_x), dpi_y * (window.innerWidth / dpi_x));

document.body.appendChild(renderer.view);

map.load(1280 + 639, 720 + 359);

map.addch(stage);

let i = 0;

gameLoop();

function gameLoop(){

  i++;

  map.load(1280 + 639 - i, 720 + 359 - i);

  map.addch(stage);

  renderer.render(stage);

  requestAnimationFrame(gameLoop);

}
