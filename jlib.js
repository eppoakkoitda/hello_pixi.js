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
    y: 720,
    scale: 1
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
        console.log("mapload");
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
    //player.x += x;
    //player.y += y;
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        map.tex[i][j].x -= x;
        map.tex[i][j].y -= y;
      }
    }
    if(map.tex[1][1].x < -dpi.x || map.tex[1][1].x > dpi.x){
      console.log("reload =>");
      map.rmvch(container);
      map.load(Characters.data[0].map_x, Characters.data[0].map_y);
      map.addch(container);
    }else if(map.tex[1][1].y < -dpi.y || map.tex[1][1].y > dpi.y){
      console.log("reload =>");
      map.rmvch(container);
      map.load(Characters.data[0].map_x, Characters.data[0].map_y);
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

let Characters = {//id:0は主人公のidということにしよう
  data: [],
  load: (x,y) => {

  },
  add: (id, CharaObject) => {
    Characters.data[id] = CharaObject;
  },
  remove: (id) => {
    Characters.data[id] = null;
  },
  move: (id, x, y) => {
    Characters.data[id].move(x, y);
  },
  moveAll: (x, y) => {
    for(let i=1; i < Characters.data.length; i++){
      Characters.move(x, y);
    }
  }
}

class Character{
  constructor(parameters) {
    this.InitCharacter(parameters);
    console.log(this.animatedSprite);
  }

  InitCharacter(parameters){
    this.container = sPlayer;

    this.ImagePass = parameters[0];
    this.x = parameters[1];
    this.y = parameters[2];
    this.direction = parameters[3];
    this.speed = parameters[4];
    this.AnimeSpeed = parameters[5];
    this.map_x = parameters[6];
    this.map_y = parameters[7];

    let texArray = [];
    this.animatedSprite = [];
    for(let i = 0; i < 4; i++){
      for(let j = 0; j < 2; j++){
        texArray[i+j*4] = [];
        for(let k = 0; k < 3; k++){
          texArray[i+j*4][k] = Texture.from(this.ImagePass + "_" + i + "_" + ( k + j*3 ) + ".png");
        }
        texArray[i+j*4][3] = texArray[i+j*4][1];

        this.animatedSprite[i+(j*4)] = new AnimatedSprite(texArray[i+j*4]);
        this.animatedSprite[i+(j*4)].play();
        this.animatedSprite[i+(j*4)].animationSpeed = this.AnimeSpeed;
        this.animatedSprite[i+(j*4)].x = this.x;
        this.animatedSprite[i+(j*4)].y = this.y;
        this.animatedSprite[i+(j*4)].visible = false;
        this.container.addChild(this.animatedSprite[i+(j*4)]);

      }
    }
    this.animatedSprite[this.direction].visible = true;
  }

  move(x, y){
    for(let i=0; i<8; i++){
      this.animatedSprite[i].x += x;
      this.animatedSprite[i].x += y;
    }
  }

  turn(dir){
    for(let i=0; i<8; i++){
      this.animatedSprite[i].visible = false;
    }
    this.animatedSprite[dir].visible = true;
  }

  containsArea(position0, position1){
    if(position0.x<this.map_x && this.map_x < position1.x){
      if(position0.y<this.map_y && this.map_y < position1.y){
        return 1;
      }
    }
    return 0;
  }
}

class Player extends Character{
  constructor(parameters1, parameters2){
    super(parameters1);
    this.InitPlayer(parameters2);
  }

  InitPlayer(parameters){
    this.HP = parameters[0];
    this.MaxHP = parameters[0];
    this.MP = parameters[1];
    this.MaxMP = parameters[1];
    this.skill = 0;
    this.dx = 0;
    this.dy = 0;
    this.dxy = 0;
    this.xxyyl = 0;
    this.nxy = 0;
    this.angle = 0;
  }

  initialize(parameters1, parameters2){
    this.InitCharacter(parameters1);
    this.InitPlayer(parameters2);
  }

  setDTT(touch_x, touch_y){
    this.nxy = 0;
    let xl = touch_x - dpi.x/2;
    let yl = touch_y - dpi.y/2;
    this.xxyyl = Math.sqrt(xl * xl + yl * yl);
    this.angle = Math.atan2(yl, xl);
    this.dx = this.speed * Math.cos(this.angle);
    this.dy = this.speed * Math.sin(this.angle);
    this.dxy = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    if(this.angle >= 0){
      if(this.angle < 0.375){
        this.turn(2);
      }else if(this.angle < 0.375 * 3){
        this.turn(5);
      }else if(this.angle < 0.375 * 5){
        this.turn(0);
      }else if(this.angle < 0.375 * 7){
        this.turn(4);
      }else{
        this.turn(1);
      }
    }else{
      if(this.angle > -0.375){
        this.turn(2);
      }else if(this.angle > -0.375 * 3){
        this.turn(7);
      }else if(this.angle > -0.375 * 5){
        this.turn(3);
      }else if(this.angle > -0.375 * 7){
        this.turn(6);
      }else{
        this.turn(1);
      }
    }
  }

  moving(){
    if(this.nxy < this.xxyyl){
      this.nxy += this.dxy;
      Characters.data[0].map_x += this.dx;
      Characters.data[0].map_y += this.dy;
      map.move(this.dx, this.dy, stage);
    }
  }

}

class Enemy extends Character{
  constructor(parameters1, parameters2){
    super(parameters1);
    this.InitEnemy(parameters2);
  }
  InitEnemy(parameters){

  }
  moving(id){
    if(this.nxy < this.xxyyl){
      this.nxy += this.dxy;
      Characters.data[id].map_x += this.dx;
      Characters.data[id].map_y += this.dy;
    }
  }
}

class bullet {
  constructor(imgPass){
    this.x;
    this.y;
    this.map_x;
    this.map_y;
    this.imgPass = imgPass;
  }
}
