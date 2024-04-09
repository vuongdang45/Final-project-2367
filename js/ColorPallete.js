import {Component, Property} from '@wonderlandengine/api';
import { Pencil } from './Pencil';

/**
 * ColorPallete
 */
export class ColorPallete extends Component {
    static TypeName = 'ColorPallete';
    /* Properties that are configurable in the editor */
    static Properties = {
        paletteColor: Property.color(0,0,0,1),
    };

    init(){
        this.collider = this.object.getComponent('collision');
    }

    start() {
        
    }

    update(dt) {
        const overlaps = this.collider.queryOverlaps();
        for(const otherCollision of overlaps) {
            const otherObject = otherCollision.object;
            if(otherObject.getComponent(Pencil,0))
            otherObject.getComponent(Pencil,0).setColor(this.paletteColor);
        }
    }
}