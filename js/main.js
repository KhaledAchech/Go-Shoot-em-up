let app;
let splashScreen;
let mainScreen;

let bgBack;
let bgMiddle;
let bgFront;
let rocks;
let bgX = 0;
let bgSpeed = 1;

let logo;
let scaleX = 0.5;
let scaleY = 0.5;

let menuLogo;
let game1Btn;
let game2Btn;
let game3Btn;
let exitBtn;

let menuScaleY = 0.1;
let menuScaleX = 0.1;
let btnScaleY = 0.5;
let btnScaleX = 1; 

window.onload = function() {
    app = new PIXI.Application(
        {
                width: 800,
                height: 600,
                backgroundColor: 0x37474F
        }
    );
    
    document.querySelector("#mainDiv").appendChild(app.view);

    // Create the screens :
    splashScreen = new PIXI.Container();
    mainScreen = new PIXI.Container();

    mainScreen.visible = false;

    app.stage.addChild(splashScreen);
    app.stage.addChild(mainScreen);
 
    logo = new PIXI.Sprite.from("images/logo.png");
    logo.anchor.set(0.5);
    logo.x = app.view.width /2;
    logo.y = app.view.height /2 - 60;
    logo.scale.set(scaleX, scaleY);

    menuLogo = new PIXI.Sprite.from("images/menu_logo.png")
    menuLogo.anchor.set(0.5);
    menuLogo.x = app.view.width /2 ;
    menuLogo.y = app.view.height /2 - 140;
    menuLogo.scale.set(menuScaleX, menuScaleY);
    
    game1Btn = new PIXI.Sprite.from("images/game1_btn.png");
    game1Btn.anchor.set(0.5);
    game1Btn.x = app.view.width /2 ;
    game1Btn.y = app.view.height /2 - 60;
    game1Btn.scale.set(btnScaleX, btnScaleY);
    game1Btn.interactive = true;
    game1Btn.buttonMode = true;
    game1Btn.on("pointerup",startGame)

    game2Btn = new PIXI.Sprite.from("images/game2_btn.png");
    game2Btn.anchor.set(0.5);
    game2Btn.x = app.view.width /2 ;
    game2Btn.y = app.view.height /2 - 10;
    game2Btn.scale.set(btnScaleX, btnScaleY);
    game2Btn.interactive = true;
    game2Btn.buttonMode = true;
    game2Btn.on("pointerup",startGame)
    
    game3Btn = new PIXI.Sprite.from("images/game3_btn.png");
    game3Btn.anchor.set(0.5);
    game3Btn.x = app.view.width /2 ;
    game3Btn.y = app.view.height /2 + 40;
    game3Btn.scale.set(btnScaleX, btnScaleY);
    game3Btn.interactive = true;
    game3Btn.buttonMode = true;
    game3Btn.on("pointerup",startGame)

    exitBtn = new PIXI.Sprite.from("images/exit_btn.png");
    exitBtn.anchor.set(0.5);
    exitBtn.x = app.view.width /2 ;
    exitBtn.y = app.view.height /2 + 90;
    exitBtn.scale.set(btnScaleX, btnScaleY);
    exitBtn.interactive = true;
    exitBtn.buttonMode = true;
    exitBtn.on("pointerup",exit)

    // setup splash screen
    splashScreen.addChild(logo);


    // for the main screen animation i decided to implement the same parallex scrolling effect.
    /* starting with loading the assets */
    app.loader.baseUrl = "assets";
    app.loader
        .add("bgBack", "background/Background.png")
        .add("rocks","background/Rocks.png")
    app.loader.onComplete.add(initScene);
    app.loader.load();

    // setup main screen
    mainScreen.addChild(menuLogo);
    mainScreen.addChild(game1Btn);
    mainScreen.addChild(game2Btn);
    mainScreen.addChild(game3Btn);
    mainScreen.addChild(exitBtn);
    

    // going to the main menu after 2 seconds from the splash screen:
    setTimeout(function () {switchContainer()} , 2000);

    
}

function gameLoop(delta)
{
    updateBg()
}

function initScene() 
{
    rocks = createBg(app.loader.resources["rocks"].texture);
    bgBack = createBg(app.loader.resources["bgBack"].texture);
    
    app.ticker.add(gameLoop);
}

function createBg(texture)
{
    let tiling = new PIXI.TilingSprite(texture,800,600);
    tiling.position.set(0,0);
    mainScreen.addChildAt(tiling,0);

    return tiling;
}

function updateBg()
{
    //parallexe scrolling effect from right to left.
    bgX = (bgX + bgSpeed);
    rocks.tilePosition.x = -bgX;
    bgBack.tilePosition.x = -bgX / 2;
}

function switchContainer()
{

    mainScreen.visible = true;
    splashScreen.visible = false;
}

function startGame()
{
    window.location.href = '/game.html';
}

function exit()
{
    window.location.href = 'https://www.playngo.com/games';
}