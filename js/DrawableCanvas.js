import {Component, Property, Texture} from '@wonderlandengine/api';
import { Pencil } from './Pencil';
/**
 * DrawableCanvas
 */
export class DrawableCanvas extends Component {
    static TypeName = 'DrawableCanvas';
    /* Properties that are configurable in the editor */
    static Properties = {
        material: Property.material(),
    };

    init() {
        this.collider = this.object.getComponent('collision');
        this.collisionContinued = false;
        this.oldX = 0.0;
        this.oldY = 0.0;
        this.actualColor = [0,0,0,1];
    }

    start() {
        
        /* Do your 2D drawing here (this is the example from MDN) */
        this.canvas = document.createElement('canvas');
        this.canvas.width = 300;
        this.canvas.height = 300;

        this.ctx = this.canvas.getContext('2d');

        // White background fill
        this.ctx.beginPath();
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Change fill color back to black
        this.ctx.fillStyle = '#000';
        // Set line width
        this.ctx.lineWidth = 2;

        /* Now wrap the canvas into a Wonderland Engine texture */
        this.canvasTexture = new Texture(this.engine, this.canvas);
        /* Apply the texture to the material */
        this.material.diffuseTexture = this.canvasTexture;
    }

    draw(x, y){
        let newX = ((x-(-1))/(1-(-1)))* 300.0;
        let newY = ((y-3.0)/(1.0-3.0)) * 300.0;

        let color1 = 'rgb(' + (this.actualColor[0] * 255)+ ',' + (this.actualColor[1] * 255)+ ',' + (this.actualColor[2] * 255)+ ', 0.1)';
        // Draw a point in the canvas if there's no collision on previous frame
        if(this.collisionContinued == false){
            this.ctx.moveTo( newX, newY );
            this.ctx.strokeStyle = color1;
            this.ctx.lineTo( newX, newY );
        }else{ // Draw a line in the canvas if there's a collision on previous frame
            this.ctx.moveTo( this.oldX, this.oldY );
            this.ctx.strokeStyle = color1;
            this.ctx.lineTo( newX, newY );
        }
        this.ctx.stroke();
        this.oldX = newX;
        this.oldY = newY;
        this.collisionContinued = true;
    }

    update(dt) {
        const overlaps = this.collider.queryOverlaps();
        for(const otherCollision of overlaps) {
            const otherObject = otherCollision.object;
            // Get the pencil color to apply in the canvas
            this.actualColor = otherObject.getComponent(Pencil,0).color;
            // Draw in the canvas
            this.draw(otherObject.getPositionWorld()[0], otherObject.getPositionWorld()[1]);
            this.canvasTexture.update();
            if(this.collisionContinued)
                return;
        }
		this.ctx.closePath();
        this.collisionContinued = false;
    }
}