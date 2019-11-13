const DEBUG = true;

class Game {
    constructor(props) {
        $('.game').append('\
            <div id="field">\
                <div id="map"></div>\
                <div id="car"></div>\
            </div>'
        );
        
        $('#map').css({
            backgroundImage: `url(img/game/${props.image}`,
            height: `${props.height}px`,
            width: `${props.width}px`,
        });
        
        this.posX = props.posX;
        this.posY = props.posY;

        this.speed = 0;
        this.maxSpeed = 1;
        this.minSpeed = 0.3;
        this.angle = - 0;
        this.isRotateLeft = this.isRotateRight = false;
        this.player = new Car(props.player);

        this.center = [350 - this.posX, 350 - this.posY];

        const trees = props.trees;
        this.tree = [];
        for (let i = 0; i < trees.length; i++) {
            this.tree[i] = new Tree(trees[i]);
        }

        this.engine = setInterval(() => {
            this.move();
            this.render();
            this.player.angle = this.angle;
            this.player.render();
            this.checkColapse();
        }, 0);

        $(document).keydown((e) => {
            switch(e.keyCode) {
                case 37:
                    this.as = 0.005;
                    break;
                // up
                case 38:
                    this.a = 0.01;
                    break;
                // right
                case 39:
                    this.as = -0.005;
                    break;
                // down
                case 40:
                    this.a = -0.005;
                    break;
                // space
                case 32:
                    this.isStop = true;
                    break;
            }
        }).keyup((e) => {
            switch(e.keyCode) {
                case 37:
                    this.as = 0;
                    break;
                case 38:
                    this.a = 0;
                    break;
                case 39:
                    this.as = 0;
                    break;
                case 40:
                    this.a = 0;
                    break;
                case 32:
                    this.isStop = false;
                    break;
            }
        })
    }

    checkColapse() {
        const cornors = this.player.getHitboxCornors(this.center[0], this.center[1]);
        for (let i = 0; i < cornors.length; i++) {
            const cornor = cornors[i];
            for (let j = 0; j < this.tree.length; j++) {
                if (this.tree[j].check(cornor)) {
                    console.log('hit');
                    return;
                }
            }
        }
    }
    move() {
        if (this.isStop) {
            const stop = 0.04;
            if (this.speed > stop) {
                this.speed -= stop;
            }
            else if (this.speed < - stop) {
                this.speed += stop;
            } else {
                this.speed = 0;
            }
        } else {
            if (this.a)
                this.speed += this.a;
            if (this.speed > this.maxSpeed) {
                this.speed = this.maxSpeed;
            }
            if (this.speed < this.maxSpeed / 2 * -1) {
                this.speed = this.maxSpeed / 2 * -1;
            }

            if (this.speed > this.minSpeed || this.speed < -this.minSpeed) {
                if (this.as) {
                    if (this.speed > 0)
                        this.angle += this.as;
                    if (this.speed < 0)
                        this.angle -= this.as;
                }
            }
            else {
                if (this.as) {
                    const as = this.as * Math.abs(this.speed * 1.5);
                    if (this.speed > 0) {
                        this.angle += as;
                    }
                    else {
                        this.angle -= as;
                    }
                }
                
            }
            
        }

        let dx = this.speed * Math.cos(- this.angle);
        let dy = this.speed * Math.sin(- this.angle);

        this.posX -= dx;
        this.posY -= dy;

        this.center = [350 - this.posX, 350 - this.posY];
    }
    render() {
        $('#map').css({
            left: `${this.posX}px`,
            top: `${this.posY}px`,
        })
    }
}

class Tree {
    constructor(treeSetting) {
        this.width = treeSetting.width;
        this.height = treeSetting.height;
        this.image = treeSetting.image;
        this.posX = treeSetting.posX;
        this.posY = treeSetting.posY;

        this.id = treeSetting.element;
        let tree = document.createElement('div');
        tree.id = treeSetting.element;
        document.getElementById('map').appendChild(tree);
        this.element = document.getElementById(treeSetting.element);

        this.hitboxRadius = treeSetting.hitbox;


        
        this.hitboxId = `${this.id}-hitbox`;
        this.element.innerHTML = `<div id="${this.hitboxId}"></div>`;
        this.hitbox = document.getElementById(this.hitboxId);
        this.c = '#f00';

        this.render();
        this.renderHitbox(DEBUG);
    }
    check(point) {
        const length = Math.sqrt(Math.pow(point[0] - (this.posX + parseInt(this.width) / 2), 2) + Math.pow(point[1] - (this.posY + parseInt(this.height) / 2), 2));
        console.log(length);
        if (length < this.hitboxRadius) {
            this.c = '#0f0';
            this.render();
            this.renderHitbox(DEBUG);
            return true;
        } else {
            this.c = '#f00';
            this.render();
            this.renderHitbox(DEBUG);
            return false;
        }
    }
    renderHitbox(deb) {

        this.hitbox.style.position = 'absolute';
        this.hitbox.style.top = '50%';
        this.hitbox.style.left = '50%';
        this.hitbox.style.transform = 'translate(-50%, -50%)';
        this.hitbox.style.width = `${this.hitboxRadius * 2}px`;
        this.hitbox.style.height = `${this.hitboxRadius * 2}px`;
        this.hitbox.style.borderRadius = '50%';
        if (deb) {
            this.hitbox.style.background = this.c;
        }
    }
    render() {
        this.element.style.position = 'absolute';
        this.element.style.top = this.posY + 'px';
        this.element.style.left = this.posX + 'px';
        this.element.style.width = this.width;
        this.element.style.height = this.height;
        this.element.style.backgroundImage = `url(img/game/${this.image})`;
        this.element.style.backgroundSize = 'contain';
        this.element.style.backgroundRepeat = 'no-repeat';
        this.element.style.backgroundPosition = '50% 50%';
    }
}
class Car {
    constructor(carSettings) {
        const {width, height, image, element, posX, posY} = carSettings;


        this.width = width;
        this.height = height;
        this.image = image;
        this.element = document.getElementById(element);

        this.posX = posX;
        this.posY = posY;

        this.render();
        this.hitboxRender(DEBUG);
    }

    hitboxRender(deb) {
        let hitbox = `${this.element.id}-hitbox`;
        this.element.innerHTML = `<div id="${hitbox}"></div>`;

        this.hitbox = document.getElementById(hitbox);

        if (deb) {
            this.hitbox.style.width = this.width;
            this.hitbox.style.height = this.height;
            this.hitbox.style.boxSizing = 'border-box';
            this.hitbox.style.border = "1px solid #f00";
        }
    }

    getHitboxCornors(posx, posy) {
        const halfW = parseInt(this.width) / 2;
        const halfH = parseInt(this.height) / 2;
        const a = this.angle;
        const b = Math.atan(halfH / halfW);
        const dy1 = Math.sin(a - b) * Math.sqrt(halfW * halfW + halfH * halfH);
        const dx1 = Math.cos(a - b) * Math.sqrt(halfW * halfW + halfH * halfH);
        const dy2 = Math.cos(Math.PI / 2 - a - b) * Math.sqrt(halfW * halfW + halfH * halfH);
        const dx2 = Math.sin(Math.PI / 2 - a - b) * Math.sqrt(halfW * halfW + halfH * halfH);
        return [
            [posx + dx1, posy + dy1],
            [posx + dx2, posy + dy2],
            [posx - dx1, posy - dy1],
            [posx - dx2, posy - dy2],
        ]
    }

    render() {
        this.element.style.position = 'absolute';
        this.element.style.top = '50%';
        this.element.style.left = '50%';
        this.element.style.width = this.width;
        this.element.style.height = this.height;
        this.element.style.marginLeft = - parseInt(this.width) / 2 + 'px';
        this.element.style.marginTop =  - parseInt(this.height) / 2 + 'px';
        this.element.style.backgroundImage = `url(img/game/${this.image})`;
        this.element.style.backgroundSize = 'contain';
        this.element.style.backgroundRepeat = 'no-repeat';
        this.element.style.backgroundPosition = '50% 50%';
        this.element.style.transform = `rotate(${- this.angle * 180 / Math.PI}deg)`
    }
}
const game = new Game(gameProps[0])
