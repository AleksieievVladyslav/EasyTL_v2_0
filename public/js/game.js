class Game {
    constructor(props) {
        $('.game').append('\
            <div id="field">\
                <div id="car"></div>\
            </div>'
        );
        this.posX = props.posX;
        this.posY = props.posY;
        $('#field').css({
            backgroundImage: `url(img/game/${props.image}`,
            backgroundSize: `${props.backgroundSize}`,
        });
        this.render();
        this.isMove = false;
        this.renderInterval = setInterval(() => {
            if(this.isMove) {
                this.posX += -1
            }
            this.render();
        }, 4);
        this.player = new Car(props.player);
        $(document).click(() => {
            this.isMove = !this.isMove;
        })
    }
    render() {
        $('#field').css({
            backgroundPositionX: `${this.posX}px`,
            backgroundPositionY: `${this.posY}px`,
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
    }
}

