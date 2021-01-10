var dog, dogImg, happyDog, hungryDog, database, foodS, foodStockRef;
var fedTime, lastFed, foodObj, currentTime;
var milk, input, name;
var gameState = "hundry";
var gameStateRef;
var bedRoomIMG, gardenIMG, washroomIMG, sleepIMG, runIMG, feed, addFood,input, button;

function preload() {
  hungryDog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  bedRoomIMG = loadImage("images/Bed Room.png");
  gardenIMG = loadImage("images/Garden.png");
  washroomIMG = loadImage("images/Wash Room.png");
  sleepIMG = loadImage("images/Lazy.png");
  runIMG = loadImage("images/running.png");
}

function setup() {
	createCanvas(1200, 500);
  database = firebase.database();

  foodObj=new Food();

  dog = createSprite(width/2+250,height/2,10,10);
  dog.addAnimation("hungryDog",hungryDog);
  dog.addAnimation("happyDog",happyDog);
  dog.addAnimation("bedRoomDog",bedRoomIMG);
  dog.addAnimation("sleepIMG",sleepIMG);
  dog.addAnimation("runIMG",runIMG);
  dog.scale = 0.15;

  getGameState();

  feed = createButton("Feed the Dog");
  feed.position(950,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Feed the Dog");
  addFood.position(800,95);
  addFeed.mousePressed(addFoods);
}

function draw() {
  currentTime = hour(); 
  if(currentTime === lastFed + 1) {
    gameState = "playing";
    updateGameState();
    foodObj.garden();
  } 

  else if(currentTime === lastFed +2 ) {
    gameState = "sleeping";
    updateGameState();
    foodObj.bedroom();  
  }

  else if(currentTime > lastFed +2 && currentTime <= lastFed +4 ) {
    gameState = "bathing";
    updateGameState();
    foodObj.washroom();
  }

  else {
    gameState = "hungry";
    updateGameState();
    foodObj.display();
  }
  foodObj.getFoodStock();
  getGameState();

  fedTime = database.ref("FeedTime");
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  if(gameState = "hungry") {
    feed.show();
    addFood.show();
    dog.addAnimation("hungry",hungryDog);
  }

  else {
    feed.hide();
    addFood.hide();
    dog.remove();
  } 
 

drawSprites();
fill("red");
textSize(32);
text("Last fed:" + lastFed+":00",300,95);
text("Time since last fed :" + (currentTime - lastFed),300,125);
}


function feedDog() {
  foodObj.deductFood();
  foodObj.updateFoodStock();
  dog.changeAnimation("happy",happyDog);
  gameState = "happy";
  updateGameState();
}

function addFoods() {
  foodObj.addFood();
  foodObj.updateFoodStock();
  }

  async function hour() {
    var site = await fetch("http://worldtimeapi.org/timezone/America/New_York");
    var siteJSON = await site.json();
    var datetime = siteJSON.datetime;
    var hourtime = datetime.slice(11,13);
  }

  function createName() {
    input.hide();
    button.hide();

    name.input.value();
    var greeting = createElement("h3");
    greeting.html("Pet's name :", +name);
    greeting.position(width/2+850,height/2+200);
  }

  function gameState() {
    gameStateRef = database.Ref('gameState');
    gameStateRef.on("value",function(data) {
      gameState = data.val();
    });
  };

  function updateGameState() {
    database.ref ('/').update ({
      gameState: State
    });
  }
