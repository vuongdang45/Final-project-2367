import {Component, Property} from '@wonderlandengine/api';

/**
 * Picture_Frame
 */
export class PictureFrame extends Component {
    static TypeName = 'Picture_Frame';
    /* Properties that are configurable in the editor */
    static Properties = {
        param: Property.float(1.0)
    };

    start() {
        console.log('start() with param', this.param);
    }

    update(dt) {
        /* Called every frame. */
    }
}
