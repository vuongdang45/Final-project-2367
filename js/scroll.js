import {Component,Property, Type} from '@wonderlandengine/api';
import { HowlerAudioSource } from '@wonderlandengine/components';
import { CanvasUI } from './CanvasUI.js';

export class textScroller extends Component {
    static TypeName = 'textScroller';
    static Properties = {
        speed: {type: Type.Float, default: 15},
		panel: Property.enum(['inform'], 'simple'),
		message: Property.string(),
    };
	static onRegister(engine){
        engine.registerComponent( HowlerAudioSource );
    }

    init() {
        this.time = 0.0;
        this.textLength = 0;
		this.messageDisplayed=false;
    }

	start() {
        this.target = this.object.getComponent('cursor-target');
        this.target.addHoverFunction(this.onHover.bind(this));
        this.target.addUnHoverFunction(this.onUnHover.bind(this));
        this.target.addMoveFunction(this.onMove.bind(this));
        this.target.addDownFunction(this.onDown.bind(this));
        this.target.addUpFunction(this.onUp.bind(this));
        
        this.soundClick = this.object.addComponent(HowlerAudioSource, {src: 'sfx/click.wav', spatial: true});
        this.soundUnClick = this.object.addComponent(HowlerAudioSource, {src: 'sfx/unclick.wav', spatial: true});
		switch ( this.panel ){
           case 0://information
           this.infoPanel();
		   break;
		}
	}
	
	infoPanel(){
		const onInform = () => {
			if(!this.messageDisplayed){
            const msg = this.message;
            console.log(msg);
            this.ui.updateElement("info", msg);
			
			
			const messageLength = msg.length;
			const panelHeight = 600; // Adjust this value based on your panel's height
			const overflow = Math.max(messageLength - 100, 0); // Adjust the threshold as needed
			const offsetY = overflow * 2; // Adjust the offset factor as needed
			this.ui.config.infoPanel.position.top = Math.min(60 - offsetY, 60); // Adjust the initial position as needed
			this.ui.updateConfig();
			
			this.messageDisplayed=true;
			}
        };
		
		const config = {
			body: {
                backgroundColor: "#131"
            },
            panelSize: {
                width: 0.9,
                height: 0.8,
				backgroundColor: "blue"
            },
            height: 600,
			infoPanel: { // Add a container for the info text element
				type: "div",
				position: { left: 6, top: 60 },
				width: 500,
				height: 200,
				backgroundColor: "#fff",
				//overflow:"scroll"
			},
            info: {
                type: "text",
                position:{ left: 6, top: 60},
                width: 500,
                height: 500,
				overflow:"scroll",
                backgroundColor: "#fff",
                fontColor: "green",
				
				
            },			
			inform: {
                type: "button",
                position:{ top: 0, left: 150 },
                width: 200,
                height: 52,
                fontColor: "#fff",
                backgroundColor: "blue",
                hover: "#3df",
                onSelect: onInform
            }
		};
		
		const content = {
            info: "",
            inform: "Information"
		}

        this.ui = new CanvasUI( content, config, this.object, this.engine );
        this.ui.update();
		
		
	}

	onHover(_, cursor) {
        console.log('onHover');
        if (this.ui){
            const xy = this.ui.worldToCanvas(cursor.cursorPos);
            this.ui.hover(0, xy);
        }

        if(cursor.type == 'finger-cursor') {
            this.onDown(_, cursor);
        }

        this.hapticFeedback(cursor.object, 0.5, 50);
    }

    onMove(_, cursor) {
        if (this.ui){
            const xy = this.ui.worldToCanvas(cursor.cursorPos);
            this.ui.hover(0, xy);
        }

        //this.hapticFeedback(cursor.object, 0.5, 50);
    }

    onDown(_, cursor) {
        console.log('onDown');
        this.soundClick.play();

        this.hapticFeedback(cursor.object, 1.0, 20);
    }

    onUp(_, cursor) {
        console.log('onUp');
        this.soundUnClick.play();

        if (this.ui) this.ui.select( 0, true );

        this.hapticFeedback(cursor.object, 0.7, 20);
    }

    onUnHover(_, cursor) {
        console.log('onUnHover');
        
        if (this.ui) this.ui.hover(0);

        this.hapticFeedback(cursor.object, 0.3, 50);
    }

    onHoverKeyboard(_, cursor) {
        //console.log('onHover');
        if (!this.ui || !this.ui.keyboard || !this.ui.keyboard.keyboard) return;

        const ui = this.ui.keyboard.keyboard;
        const xy = ui.worldToCanvas(cursor.cursorPos);
        ui.hover(0, xy);

        if(cursor.type == 'finger-cursor') {
            this.onDown(_, cursor);
        }

        this.hapticFeedback(cursor.object, 0.5, 50);
    }

    onMoveKeyboard(_, cursor) {
        if (!this.ui || !this.ui.keyboard || !this.ui.keyboard.keyboard) return;

        const ui = this.ui.keyboard.keyboard;
        const xy = ui.worldToCanvas(cursor.cursorPos);
        ui.hover(0, xy);

        this.hapticFeedback(cursor.object, 0.5, 50);
    }

    onUpKeyboard(_, cursor)  {
        console.log('onUpKeyboard');
        this.soundUnClick.play();

        if (this.ui && this.ui.keyboard && this.ui.keyboard.keyboard) this.ui.keyboard.keyboard.select(0);

        this.hapticFeedback(cursor.object, 0.7, 20);
    }

    onUnHoverKeyboard(_, cursor) {
        console.log('onUnHoverKeyboard');
        
        if (this.ui && this.ui.keyboard && this.ui.keyboard.keyboard) this.ui.keyboard.keyboard.hover(0);

        this.hapticFeedback(cursor.object, 0.3, 50);
    }

    hapticFeedback(object, strength, duration) {
        const input = object.getComponent('input');
        if(input && input.xrInputSource) {
            const gamepad = input.xrInputSource.gamepad;
            if(gamepad && gamepad.hapticActuators) gamepad.hapticActuators[0].pulse(strength, duration);
        }
    }
	
	update(dt) {
        if (this.messageDisplayed && this.ui) {
        const timePerCharacter = 1 / this.speed; // Time taken to display one character
        this.time += dt;
        const charactersToShow = Math.floor(this.time / timePerCharacter);
        const displayedMessage = this.message.substring(0, charactersToShow);
        this.ui.updateElement("info", displayedMessage);
		

        // Reset the time and text length if the message has been fully displayed
        if (charactersToShow >= this.message.length) {
            this.time = 0;
            this.textLength = 0;
			//this.messageDisplayed=false;
        }
		
    }
	if (this.ui) this.ui.update();
    }
}