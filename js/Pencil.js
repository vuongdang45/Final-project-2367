import {Component, Property} from '@wonderlandengine/api';

/**
 * Pencil
 */
export class Pencil extends Component {
    static TypeName = 'Pencil';
    /* Properties that are configurable in the editor */
    static Properties = {
        color: Property.color(0,0,0,1),
    };

    start() {

    }

    setColor(otherColor){
        this.color = otherColor;
    }

    update(dt) {
        /* Called every frame. */
    }
}