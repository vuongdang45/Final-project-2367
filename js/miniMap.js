import { Component, Property, Texture } from '@wonderlandengine/api';

export class MyCanvasTexture extends Component {
    static TypeName = 'mini-map';
    static Properties = {
        material: Property.material(),
        player: Property.object(),
    };

    start() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 595;
        this.canvas.height = 595;
        this.ctx = this.canvas.getContext('2d');

        
        this.img = new Image();
        this.img.onload = () => {
            this.loaded = true;
            this.ctx.drawImage(this.img, 0, 0);
                 
            this.canvasTexture = new Texture(this.engine, this.canvas);
            this.material.diffuseTexture = this.canvasTexture;
        };
        this.img.src = "map.png";

        this.playerLocationX = this.player.getPositionWorld()[0] + 22;
        this.playerLocationZ = this.player.getPositionWorld()[2] + 22;

    }

    update(dt)
    {
        this.ctx.drawImage(this.img, 0, 0);
        this.playerLocationX = this.player.getPositionWorld()[0]+22;
        this.playerLocationZ = this.player.getPositionWorld()[2]+22;
        this.drawAdditionalShapes(this.ctx);
       
        if (this.loaded)
            this.canvasTexture.update();
    }

    drawAdditionalShapes(ctx) {

        let radius = 10

        // Draw a circle
        ctx.fillStyle = 'rgba(1, 0, 0, 1)';
        ctx.beginPath();
        ctx.arc(this.playerLocationX/44 * 595, this.playerLocationZ/44 * 595, radius, 0, Math.PI*2);
        ctx.stroke();
       
       
    }
}