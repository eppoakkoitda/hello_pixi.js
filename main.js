var type = "WebGL";
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}
PIXI.utils.sayHello(type);

let stage = new Container();

let renderer = autoDetectRenderer(dpi.x, dpi.y);
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
fitscreen();

document.body.appendChild(renderer.view);

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

window.onresize = () => {
  fitscreen();
};

function fitscreen(){
  var scale = window.innerWidth / dpi.x;
  if(window.innerHeight < scale * dpi.y){
    scale = window.innerHeight / dpi.y;
  }
  stage.scale.x = stage.scale.y = scale;
  renderer.resize(dpi.x * scale, dpi.y * scale);
}

loader
  .add("img/FSM_01-A_01.json")
  .add("img/kokkoro.png")
  .load(setup);

function setup(){
  player.x = 0;
  player.y = 0;

  map.load(player.x, player.y);
  map.addch(stage);

  Characters.add(0, 0, 0, new Chara8("FSM_01-A_01"));
  Characters.remove(0);
  console.log(Characters);
  //let syujinko2 = new Chara8("img/kokkoro.png",400,400);
  let vx = 0, vy = 0;


  gameLoop();
}

function gameLoop(){

  renderer.render(stage);

  requestAnimationFrame(gameLoop);

}

function onKeyDown(e) {
 switch (e.code) {
   case 'ArrowLeft':
   case 'KeyA':
     vx = -50;
     break;
   case 'ArrowRight':
   case 'KeyD':
     vx = 50;
     break;
   case 'ArrowUp':
   case 'KeyW':
     vy = -50;
     break;
   case 'ArrowDown':
   case 'KeyS':
     vy = 50;
     break;
 }
 map.move(vx, vy, stage);

 e.preventDefault();
};

function onKeyUp(e){
  vx = vy = 0;
}
