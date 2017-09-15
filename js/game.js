'use strict'

/**
 * Exemplo de mecânicas de controle do personagem/avatar do jogador.
 * Utiliza engine de física embutida na Phaser: Arcade Physics.
 * 
 * - 4/8 direções
 * - rotacionar e mover
 * - acelerar e mover (+ inércia)
 * 
 * OBS: adicionados arquivos de configuração para auto-complete pelo VSCode
 */

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 
    'game-container', {
        preload: preload, 
        create: create,
        update: update, 
        render: render
    }
)

var player
var player2
var background
var bullets
var bullets2
var keys1
var keys2
var speed = 300

function preload() {
    game.load.image('player', 'assets/camel.png')
    game.load.image('background', 'assets/desert.jpg')
    game.load.image('shot', 'assets/shot.png')
}

function create() {
    game.renderer.roundPixels = true
    game.renderer.clearBeforeRender = false

    game.physics.startSystem(Phaser.Physics.ARCADE)

    background = game.add.sprite(0, 0, 'background')

    player = game.add.sprite(800/2, 600/2, 'player')
    player.anchor.setTo(0.5, 0.5)
    // controle polar
    player.moveDirection = 0
    player.moveSpeed = 0
    game.physics.arcade.enable(player)
    player.body.drag.set(100)
    player.body.maxVelocity.set(speed)

    // tiros
    bullets = game.add.group()
    bullets.enableBody = true
    bullets.physicsBodyType = Phaser.Physics.ARCADE
    bullets.createMultiple(20, 'shot')
    bullets.setAll('anchor.x', 0.5)
    bullets.setAll('anchor.y', 0.5)

    keys1 = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.UP),
        down: game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
        left: game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
        right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
        fire: game.input.keyboard.addKey(Phaser.Keyboard.L)
    }

    keys2 = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        fire: game.input.keyboard.addKey(Phaser.Keyboard.G)
    }

    var fullScreenButton = game.input.keyboard.addKey(Phaser.Keyboard.ONE)
    fullScreenButton.onDown.add(toggleFullScreen)
}

function toggleFullScreen() {
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
    if (game.scale.isFullScreen) {
        game.scale.stopFullScreen()
    } else {
        game.scale.startFullScreen(false)
    }
}

function update() {
    //moveInEightDirections()
    //moveAndRotate()
    accelerateAndRotate()
    fireBullet()
}

function fireBullet() {
    if (keys1.fire.isDown) {
        var bullet = bullets.getFirstExists(false)
        if (bullet) {
            bullet.reset(player.x, player.y)
            bullet.lifespan = 2000
            bullet.rotation = player.rotation
            game.physics.arcade.velocityFromRotation(
                bullet.rotation, 400, bullet.body.velocity)
        }
    }
}

function moveAndRotate() {

    if (keys1.up.isDown) {
        player.moveSpeed += 20
    } else {
        // friccao
        player.moveSpeed *= 0.9    
    }
    /*
    if (downKey.isDown) {
        //player.moveSpeed -= 50
    }
    */

    if (keys1.left.isDown) {
        player.moveDirection -= 2//00
    } else
    if (keys1.right.isDown) {
        player.moveDirection += 2//00
    }

    if (player.moveSpeed < 0) {
        player.moveSpeed = 0
    } else 
    if (player.moveSpeed > 400) {
        player.moveSpeed = 400
    }

    game.physics.arcade.velocityFromAngle(
        player.moveDirection, 
        player.moveSpeed, 
        player.body.velocity)
        
    player.angle = player.moveDirection

    screenBounds(player)
}

function accelerateAndRotate() {
    if (keys1.up.isDown) {
        game.physics.arcade.accelerationFromRotation(
            player.rotation, 600, player.body.acceleration)
    } else {
        player.body.acceleration.set(0)
    }

    if (keys1.left.isDown) {
        player.body.angularVelocity = -200
    } else
    if (keys1.right.isDown) {
        player.body.angularVelocity = 200
    } else {
        player.body.angularVelocity = 0
    }

    game.world.wrap(player, 0, true);
}

function moveInEightDirections() {
    player.body.velocity.setTo(0,0)

    if (keys1.up.isDown) {
        player.body.velocity.y = -speed
    } else
    if (keys1.down.isDown) {
        player.body.velocity.y = speed
    }
    
    if (keys1.left.isDown) {
        player.body.velocity.x = -speed
    } else
    if (keys1.right.isDown) {
        player.body.velocity.x = speed
    }

    // rotaciona o sprite de acordo com o vetor velocity
    player.angle = player.body.angle * 180/Math.PI
/*
    // mesma solucao que a linha abaixo, embora mais elegante
    player.body.velocity.setMagnitude(
        Math.min(speed, player.body.velocity.getMagnitude())
    );
*/
    // limitando a velocidade do jogador nas diagonais
    if (player.body.velocity.getMagnitude() > speed) {
        player.body.velocity.setMagnitude(speed)
    }

    // mantem o jogador dentro da tela
    screenBounds(player)
}

function screenBounds(sprite) {
    if (sprite.x < sprite.width/2) {
        sprite.x = sprite.width/2
    } else
    if (sprite.x > game.width - sprite.width/2) {
        sprite.x = game.width - sprite.width/2
    }

    if (sprite.y < sprite.height/2) {
        sprite.y = sprite.height/2
    } else
    if (sprite.y > game.height - sprite.height/2) {
        sprite.y = game.height - sprite.height/2
    }
}

function render() {
}

