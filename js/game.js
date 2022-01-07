let app;
let gameOverScreen;
let end;

let bgBack;
let bgMiddle;
let bgFront;
let rocks;
let bgX = 0;
let bgSpeed = 1;

let player;
let enemies = [];
let projectiles = [];
let explosion;
let keys = {};
    
let scaleX = 0.3;
let scaleY = 0.3;
let playerSpeed = 5;
let enemySpeed = 3;
let projectileSpeed = 10;

window.onload = function() {
    app = new PIXI.Application(
        {
                width: 800,
                height: 600,
                backgroundColor: 0x37474F
        }
    );


    document.querySelector("#gameDiv").appendChild(app.view);
    app.stage.interactive = true;

    app.loader.baseUrl = "assets";
    app.loader
        .add("bgBack", "background/Background.png")
        .add("rocks","background/Rocks.png")
        .add("explosionSheet","particles/explosion_sheet.png")
    app.loader.onComplete.add(initScene);
    app.loader.load();
    
    // game over screen
    gameOverScreen = new PIXI.Container();
    gameOverScreen.visible = false;
    app.stage.addChild(gameOverScreen);

    end = new PIXI.Sprite.from("images/end.png");
    end.anchor.set(0.5);
    end.x = app.view.width /2;
    end.y = app.view.height /2;

    gameOverScreen.addChild(end);

    // player sprite
    player = new PIXI.Sprite.from("assets/player/player.png");
    player.anchor.set(0.5);
    player.x = 50;
    player.y = app.view.height /2;
    player.scale.set(scaleX, scaleY);

    app.stage.addChild(player);
        
    // I've added some mouse movement as well just for fun ^^ .
    // mouse movement
    // app.stage.interactive = true;
    // app.stage.on("pointermove", movePlayer)
        

    // keyboard event handlers
    window.addEventListener("keydown", keysDown);
    window.addEventListener("keyup", keysUp);

    //shooting event handler
    document.querySelector("#gameDiv").addEventListener("pointerdown", fireProjectile);

}

/********************* Mouse Movement *********************\
// function movePlayer(e) 
// {
//     let pos = e.data.global;

//     player.x = pos.x;
//     player.y = pos.y;
// }
\************************************************************/

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
    app.stage.addChildAt(tiling,0);

    return tiling;
}

function createExplosion(texture,position)
{
    let explosionRect = new PIXI.Rectangle(0,0,64,64);
    texture.frame = explosionRect;

    let explosion = new PIXI.Sprite(texture);

    let explode = setInterval(function() {
        if (explosionRect.x >= 64 * 3)
        {
            explosionRect.x = 0;
        }
        explosion.texture.frame = explosionRect;
        explosionRect.x += 64;
    }, 110);

    explosion.scale.set(1.2,1.2);
    explosion.x = position.x;
    explosion.y = position.y;
    app.stage.addChild(explosion);

    setTimeout(function () {app.stage.removeChild(explosion)} , 111);

    return explosion;
}

function updateBg()
{
    //parallexe scrolling effect from right to left.
    bgX = (bgX + bgSpeed);
    rocks.tilePosition.x = -bgX;
    bgBack.tilePosition.x = -bgX / 2;
}

function keysDown(e)
{
    keys[e.keyCode] = true;
}

function keysUp(e)
{
    keys[e.keyCode] = false;
}

//spawn enemy every 2 seconds
window.setInterval(function(){
    let enemy = createEnemy();
    enemies.push(enemy)
}, 2000);

function createEnemy()
{
    let enemy = new PIXI.Sprite.from("assets/enemies/enemy_v2.png");
    enemy.anchor.set(0.5);
    enemy.x = app.view.width - 10;
    enemy.y = Math.floor(Math.random() * app.view.height - 10);
    enemy.scale.set(scaleX, scaleY);
    enemy.speed = enemySpeed;
    enemy.interactable = true;
    app.stage.addChild(enemy);

    return enemy;
}

function updateEnemy(delta)
{
    let Ysigne = 1;
    for (let i = 0; i < enemies.length; i++)
    {
        enemies[i].position.x -= enemies[i].speed;
         
        window.setInterval(function(){
            if (enemies[i].position.y >= 50 && enemies[i].position.y < app.view.height - 50)
            {
                enemies[i].position.y += enemies[i].speed * Ysigne;
                Ysigne *= -Ysigne
            }
        }, 1000);

        if (detectCollision(player, enemies[i]))
        {
            if (!enemies[i].dead)
            {
                enemies[i].dead = true
                Explosion(player, enemies[i]);
            }  
        }

    }

}

function createProjectile()
{
    let projectile = new PIXI.Sprite.from("assets/player/projectile.png");
    projectile.anchor.set(0.5);
    projectile.x = player.x;
    projectile.y = player.y;
    projectile.speed = projectileSpeed;
    app.stage.addChild(projectile);

    return projectile;
}

function fireProjectile(e)
{
    let projectile = createProjectile();
    projectiles.push(projectile);
}

function updateProjectiles(delta)
{
    for (let i = 0; i < projectiles.length; i++)
    {
        projectiles[i].position.x += projectiles[i].speed;
        
        if (projectiles[i].position.x > app.view.width )
        {
            projectiles[i].dead = true;
        }
        for (let j = 0; j < enemies.length; j++)
        {
            if (detectCollision(projectiles[i], enemies[j]))
            {
                if (!enemies[j].dead)
                {
                    projectiles[i].dead = true;
                    enemies[j].dead = true;
                    hitEnemy(enemies[j]);
                }
            }
        }
        
        
    }

    for (let i = 0; i < projectiles.length; i++)
    {   
        if (projectiles[i].dead)
        {
            app.stage.removeChild(projectiles[i]);
            projectiles.splice(i,1);
        }
    }
}

function detectCollision(a, b)
{
    let aBox = a.getBounds();
    let bBox = b.getBounds();

    return aBox.x + aBox.width > bBox.x &&
           aBox.x < bBox.x + bBox.width &&
           aBox.y + aBox.height > bBox.y &&
           aBox.y < bBox.y + bBox.height;
}

function hitEnemy(enemy)
{
    explosion = createExplosion(app.loader.resources["explosionSheet"].texture,enemy);
    app.stage.removeChild(enemy);
}

function Explosion(a, b)
{
    app.stage.removeChild(a);
    app.stage.removeChild(b);
    explosion = createExplosion(app.loader.resources["explosionSheet"].texture,a);
    gameOverScreen.visible = true;
    setTimeout(function () {
        window.location.href = '/';
    } , 2000);
}

// the game game update function.
function gameLoop(delta)
{   
    /************************ Key Codes *****************************\
    //  °38: The ASCII code for the Up arrow in the keyboard.
    //  °40: The ASCII code for the down arrow in the keyboard.
    //  °39: The ASCII code for the right arrow in the keyboard.
    //  °37: The ASCII code for the left arrow in the keyboard.
    //  °32: The ASCII code for the space in the keyboard.
    /********************** azerty Keyboards *************************\
    //  °90: The ASCII code for the "z" letter in the keyboard.
    //  °83: The ASCII code for the "s" letter in the keyboard.
    //  °81: The ASCII code for the "q" letter in the keyboard.
    //  °68: The ASCII code for the "d" letter in the keyboard.
    /********************** qwerty Keyboards *************************\
    //  °87: The ASCII code for the "w" letter in the keyboard.
    //  °83: The ASCII code for the "s" letter in the keyboard.
    //  °65: The ASCII code for the "a" letter in the keyboard.
    //  °68: The ASCII code for the "d" letter in the keyboard.
    \*****************************************************************/
    
    // Background parallexe effect
    updateBg();

    // moving up or down :
    if (keys["90"] || keys["87"] || keys["38"])
    {
        if (player.y >= 20 )
        {
            player.y -= playerSpeed
        } 
    }
    if (keys["83"] || keys["40"]) 
    {
        if (player.y <= (app.view.height - 20) )
        {
            player.y += playerSpeed
        }
    }
    
    // moving right or left :
    if (keys["68"] || keys["39"])
    {
        if (player.x <= (app.view.width - 50) )
        {
            player.x += playerSpeed
        }
    }
    if (keys["81"] || keys["65"] || keys["37"]) 
    {
        if (player.x >= 50 )
        {
            player.x -= playerSpeed
        }
    }
   
    updateEnemy(delta);

    updateProjectiles(delta);

}
