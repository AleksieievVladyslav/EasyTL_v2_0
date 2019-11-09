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
        this.angle = - 0;
        this.player = new Car(props.player);

        this.engine = setInterval(() => {
            this.move();
            this.render();
            this.player.angle = this.angle;
            this.player.render();
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
                    this.a = -0.02;
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
            }
        })
    }
    move() {
        if (this.a)
            this.speed += this.a;
        if (this.as)
            this.angle += this.as;
        let dx = this.speed * Math.cos(- this.angle);
        let dy = this.speed * Math.sin(- this.angle);

        this.posX -= dx;
        this.posY -= dy;
    }
    render() {
        $('#map').css({
            left: `${this.posX}px`,
            top: `${this.posY}px`,
        })
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
        this.hitboxRender(false);
    }

    hitboxRender(DEBUG) {
        let hitbox = `${this.element.id}-hitbox`;
        this.element.innerHTML = `<div id="${hitbox}"></div>`;

        this.hitbox = document.getElementById(hitbox);

        if (DEBUG) {
            this.hitbox.style.width = this.width;
            this.hitbox.style.height = this.height;
            this.hitbox.style.boxSizing = 'border-box';
            this.hitbox.style.border = "1px solid #f00";
        }
    }

    getHitboxCornors() {
        return [
            [this.posX, this.posY],                                                 // top left
            [this.posX + parseInt(this.width), this.posY],                          // top right
            [this.posX + parseInt(this.width), this.posY + parseInt(this.height)],  // bottom right 
            [this.posX, this.posY + parseInt(this.height)],                         // bottom left
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

