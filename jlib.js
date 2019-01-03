//PIXI置き換え
let Container = PIXI.Container,
autoDetectRenderer = PIXI.autoDetectRenderer,
loader = PIXI.loader,
resources = PIXI.loader.resources,
Sprite = PIXI.Sprite,
Rectangle = PIXI.Rectangle,
Texture = PIXI.Texture,
Texfrom = PIXI.Texture.from,
AnimatedSprite = PIXI.extras.AnimatedSprite;

let dpi = {
    x: 1280,
    y: 720
};

let player = {
  x: 0,
  y: 0,
};

let map = {
  tex: [[0,0,0],[0,0,0],[0,0,0]],//まあ、textureというよりspriteの方が正しいわけだが
  x: 0,
  y: 0,
  load: (x, y) => {
    let tx;
    let ty;
    map.x = Math.floor(x / dpi.x);
    map.y = Math.floor(y / dpi.y);
    if(map.x > -1 && map.x < 2){//マップ端ではロードしない　バグる
      if(map.y > -1 && map.y < 1){
        tx = x % dpi.x - dpi.x / 2;
        ty = y % dpi.y - dpi.y / 2;
        console.log("mapload")
        document.dispatchEvent(ev_mapload);
        for(let i = 0; i < 3; i++){
          for(let j = 0; j < 3; j++){
            var pass = "img/base_" + (map.x + i - 1) + "_" + (map.y + j - 1) + ".png";
            map.tex[i][j] = new Sprite.from(pass);
            map.tex[i][j].position.set(-tx + dpi.x * (i - 1), -ty + dpi.y * (j - 1));
          }
        }
      }
    }
  },
  addch: (container) => {
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        container.addChild(map.tex[i][j]);
      }
    }
  },
  rmvch: (container) => {
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        container.removeChild(map.tex[i][j]);
      }
    }
  },
  move: (x, y, container) =>{
    player.x += x;
    player.y += y;
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        map.tex[i][j].x -= x;
        map.tex[i][j].y -= y;
      }
    }
    if(map.tex[1][1].x < -dpi.x || map.tex[1][1].x > dpi.x){
      console.log("reload =>");
      map.rmvch(container);
      map.load(player.x, player.y);
      map.addch(container);
    }else if(map.tex[1][1].y < -dpi.y || map.tex[1][1].y > dpi.y){
      console.log("reload =>");
      map.rmvch(container);
      map.load(player.x, player.y);
      map.addch(container);
    }
  }
}

document.addEventListener('mapload', function(e) { console.log(e, e.detail); }, false);

let ev_mapload = new CustomEvent('mapload', {
  detail: {
    x: map.x,
    y: map.y
  }
});

let Characters = {
  data: [],
  load: (x,y) => {

  },
  add: (id, x, y, CharaObject) => {
    Characters.data[id] = CharaObject;
  },
  remove: (id) => {
    Characters.data[id] = null;
  },
  move: (id, x, y) => {
    Characters.data[id].move(x, y);
  }
}

class Chara8{
  constructor(pass) {
    let texArray = [];
    this.animatedSprite = [];
    for(let i = 0; i < 4; i++){
      for(let j = 0; j < 2; j++){
        texArray[i+j*4] = [];
        for(let k = 0; k < 3; k++){
          texArray[i+j*4][k] = Texture.from(pass + "_" + i + "_" + ( k + j*3 ) + ".png");
        }
        texArray[i+j*4][3] = texArray[i+j*4][1];

        this.animatedSprite[i+(j*4)] = new AnimatedSprite(texArray[i+j*4]);
        this.animatedSprite[i+(j*4)].play();
        this.animatedSprite[i+(j*4)].animationSpeed = 0.1;
        this.animatedSprite[i+(j*4)].x = 50*i;
        this.animatedSprite[i+(j*4)].y = 50*j;
        stage.addChild(this.animatedSprite[i+(j*4)]);
      }
    }
    console.log(texArray);
    console.log(this.animatedSprite);
  }
  move(x, y){
    
  }

}
