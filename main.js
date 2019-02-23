var type = "WebGL";
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}
PIXI.utils.sayHello(type);

let stage = new Container();
let sPlayer = new Container();
let sUI = new Container();

let renderer = autoDetectRenderer(dpi.x, dpi.y);
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
fitscreen();

let debugmsg = new PIXI.Text(word, style);

var word = "Hello World!";
var style = {font:'bold 60pt Arial', fill:'black'};
var textobj = new PIXI.Text(word, style);
textobj.position.x = 60;
textobj.position.y = 60;
sUI.addChild(textobj);

let psi0 = {x:400,y:400};
let psi1 = {x:500,y:500};

document.body.appendChild(renderer.view);

document.body.addEventListener( "touchstart", function( event ) {
	var touchObject = event.changedTouches[0] ;
	var x = touchObject.pageX / dpi.scale ;
	var y = touchObject.pageY / dpi.scale;
  Characters.data[0].setDTT(x, y);
} ) ;

window.onresize = () => {
  fitscreen();
};

function fitscreen(){
  dpi.scale = window.innerWidth / dpi.x;
  if(window.innerHeight < dpi.scale * dpi.y){
    dpi.scale = window.innerHeight / dpi.y;
  }
  stage.scale.x = stage.scale.y = dpi.scale;
  renderer.resize(dpi.x * dpi.scale, dpi.y * dpi.scale);
}

loader
  .add("img/FSM_01-A_01.json")
  .add("img/kokkoro.png")
  .load(setup);

function setup(){
  test_parameta = ["FSM_01-A_01",640,360,0,10,0.1,0,0];
  test_parameta2 = [640,360];
  Characters.add(0, new Player(test_parameta, test_parameta2));
  console.log(Characters);

  map.load(Characters.data[0].map_x, Characters.data[0].map_y);
  map.addch(stage);

  console.log(textobj);

  Characters.moveAll();

  gameLoop();
}

function gameLoop(){

  Characters.data[0].moving();

  textobj.text = Math.floor(Characters.data[0].map_x) + "," + Math.floor(Characters.data[0].map_y) + "," + Characters.data[0].containsArea(psi0, psi1);
  stage.addChild(sPlayer);
  stage.addChild(sUI);
  renderer.render(stage);

  requestAnimationFrame(gameLoop);

}
