/**
* We have included the IntroState just to detail that if you wanted to have a main-menu then this would be the place to put it.
* 
* Currently we just switch straight to the 'play' state.
* 
*/

var IntroState = new Kiwi.State('IntroState');


IntroState.create = function () {

    //This state is currently skipped, but can be used as a main menu page.
    game.states.switchState("PlayState", PlayState, null, { characterParts: { head: 0,arms: 0,  chest: 0, legs: 0  } });

}
/**
* The Loading State is going to be used to load in all of the in-game assets that we need in game.
*
* Because in this blueprint the user can only 'dress-up' a single "character" we are going to load in all of 
* the asset's at this point.
*
* If you have multiple states however, I would recommend have loading the other graphics as they are required by their states, 
* Otherwise the loading times maybe a bit long. 
*
*/

var LoadingState = new Kiwi.State('LoadingState');

/**
* This preload method is responsible for preloading all of our in game assets.
*
* @method preload
*/
LoadingState.preload = function () {

    //Load in the chest/head graphics
    this.addSpriteSheet('head', 'assets/img/head.png', 150, 117);
    this.addSpriteSheet('chest', 'assets/img/chest.png', 150, 117);
    this.addSpriteSheet('arms', 'assets/img/arms.png', 150, 117);
    this.addSpriteSheet('legs', 'assets/img/legs.png', 150, 117);

    //Load in the Buttons we require
    this.addSpriteSheet('CameraBtn', 'assets/img/buttons/CameraBtn.png', 100, 100);
    this.addSpriteSheet('RandomBtn', 'assets/img/buttons/RandomBtn.png', 100, 100);
    this.addSpriteSheet('ResetBtn', 'assets/img/buttons/ResetBtn.png', 100, 100);

    this.addSpriteSheet('NextBtn', 'assets/img/buttons/NextBtn.png', 63, 63);
    this.addSpriteSheet('PrevBtn', 'assets/img/buttons/PrevBtn.png', 63, 63);

    this.addSpriteSheet('BackBtn', 'assets/img/buttons/BackBtn.png', 100, 100);
    this.addSpriteSheet('PrintBtn', 'assets/img/buttons/PrintBtn.png', 100, 100);
    this.addSpriteSheet('SaveBtn', 'assets/img/buttons/SaveBtn.png', 100, 100);

    /**
    * Create our Background Image and any assets that we want to display to the user as the game is loading.
    * Also adds a on-click event.
    */
    this.bg = new Kiwi.GameObjects.Sprite(this, this.textures.kiwiImg, 390, 280);
    this.addChild(this.bg);
    
    this.bg.input.onUp.add(this.pressIntro);
};


/**
* This create method is executed when the Kiwi game enters the loading state after all the assets have been loaded.
* At this point we can switch to our 'intro' state.

* @method create
*
*/
LoadingState.create = function () {

    game.states.switchState("IntroState");

};


/**
* This method is executed if the user clicks on the screen as the graphics are loading.
* Will make the browser go our website!
* @method create
* @private 
*/
LoadingState.pressIntro = function () {
    window.open("http://www.kiwijs.org");
}


/*
* If you want to include a 'process' or a loading graphic telling the user how many bytes/files/e.t.c are being loaded
* Then you can make use of the 'loadProgress' method. 
*/
LoadingState.loadProgress = function (percent, bytesLoaded, file) {
  
}

var PlayState = new Kiwi.State('PlayState');


/**
* The PlayState in the core state that is used in the game. 
*
* It is the state where majority of the functionality occurs 'in-game' occurs.
* 
*/


/**
* When this state is switched to a 'characterParts' parameter will be passed.
* If passed this parameter will contains a number for a particular 'part' (Arm/Leg/Torso/e.t.c) that should be used. 
*
* 
* @method create
* @param characterParts{Object} The list of character parts with corresponding variables.
* @private
*/
PlayState.create = function (characterParts) {

    //Get the character parts and store them in a property to be used later on.
    this.characterParts = characterParts;


    /**
    * Automatically generated cycle button positioning variables.
    */
    var leftButtonX = 0;
    var rightButtonX = 273;
    var buttonGapY = 70;
    var yDiff = 0;


    if (characterParts != undefined) {


        //Loop through the parts that were passed.
        for (var i in characterParts) {

            /*
            * Add dress up elements dynamically via characterParts.
            *
            * Note: The texture for the particular dress up element we are creating (in this case) has the excat same name as the element itself.  
            * Also we are always going to add the dress up elements at the bottom. That way the first elements added will be at the top.
            */
            this[i] = new Kiwi.GameObjects.Sprite(this, this.textures[i], 100, 80);
            this.addChildAt(this[i], 0);
            this[i].name = i;
            this[i].animation.switchTo(characterParts[i]);
            

            //Create a new left button that we will use to cycle to the previous part of the type we just generated.
            this[i + 'LeftBtn'] = new Kiwi.GameObjects.Sprite(this, this.textures.PrevBtn, leftButtonX, yDiff);
            this.addChild(this[i + 'LeftBtn']);
            this[i + 'LeftBtn'].tag = i;        //Store which element this left button is for.
            this[i + 'LeftBtn'].input.onUp.add(this.pressLeft, this);


            //Create a new right button that we will use to cycle to the next part of the type we just generated. 
            this[i + 'RightBtn'] = new Kiwi.GameObjects.Sprite(this, this.textures.NextBtn, rightButtonX, yDiff);
            this.addChild(this[i + 'RightBtn']);
            this[i + 'RightBtn'].tag = i;       //Store which element this right button is for
            this[i + 'RightBtn'].input.onUp.add(this.pressRight, this);

            yDiff += buttonGapY;

        }

    }


    //Create the 'random' button with an event listener for when it is clicked
    this.randomButton = new Kiwi.GameObjects.Sprite(this, this.textures.RandomBtn, 0, 289);
    this.addChild(this.randomButton);
    this.randomButton.input.onUp.add(this.randomizeCharacter, this);
    

    //Create the 'reset' button with an event listener for when it is clicked
    this.resetButton = new Kiwi.GameObjects.Sprite(this, this.textures.ResetBtn, 118, 289);
    this.addChild(this.resetButton);
    this.resetButton.input.onUp.add(this.resetCharacter, this);
    

    //Create the 'camera' button with an event listener for when it is clicked
    this.showButton = new Kiwi.GameObjects.Sprite(this, this.textures.CameraBtn, 235, 289);
    this.addChild(this.showButton);
    this.showButton.input.onUp.add(this.showCharacter, this);
}


/**
* Updates all of the characters frames via the characterParts variables.
* Used when a clicks on a dress-up element and so whole character updates. 
*
* @method updateCharacter
* @public
* 
*/
PlayState.updateCharacter = function () {
    for (var i in this.characterParts) {
        this[i].animation.switchTo( this.characterParts[i] );
    }
}


/**
* This method gets executed when the user clicks on a 'left' button. 
* So they want a dress-up element to go to its 'previous' frame.
*
* @method pressLeft
* @public
*/

PlayState.pressLeft = function (piece) {

    //Get the name of the dress-up element we want to go next.
    var clip = this[piece.tag];
    
    //Updates the relevant character part with the new frame
    if (clip.animation.frameIndex == 0) {
        this.characterParts[piece.tag] = clip.animation.currentAnimation.length - 1;
    } else {
        this.characterParts[piece.tag]--;
    }

    //Update the character
    this.updateCharacter();
}

/**
* This method gets executed when the user clicks on a 'right' button. 
* So they want a dress-up element to go to its 'next' frame.
*
* @method pressRight
* @public
* 
*/

PlayState.pressRight = function (piece) {

    //Get the name of the dress-up element we want to go next.
    var clip = this[piece.tag];

    //Updates the relevant character part with the new frame
    if (clip.animation.frameIndex == (clip.animation.currentAnimation.length - 1)) {
        this.characterParts[piece.tag] = 0;
    } else {
        this.characterParts[piece.tag]++;
    }

    //Update the character
    this.updateCharacter();
}


/**
* Randomize character based on the amount of frames each dress up element has.
* 
* @method randomizeCharacter
* @public
*/
PlayState.randomizeCharacter = function () {
    for (var i in this.characterParts) {
        var clip = this[i];
        var r = Math.floor(Math.random() * clip.animation.currentAnimation.length);
        this.characterParts[i] = r;
    }
    this.updateCharacter();
}


/**
* Set all dress up element animations to their first frame (which is the default).a
*
* @method resetCharacter
* @public 
*/
PlayState.resetCharacter = function () {
    for (var i in this.characterParts) {
        this.characterParts[i] = 0;
    }
    this.updateCharacter();
}


/**
* Remove all dress up navigation and give print and save options. 
* These functionalities are stored on the 'show' state. 
*
* @method showCharacter
* @public
*/
PlayState.showCharacter = function () {
    game.states.switchState("ShowState", ShowState, null, { characterParts: this.characterParts });
}
/**
* The preload state is used purely to load all files required by the loader.
* 
* E.g. Any loading gifs/background graphics that are displayed to the user 'in-game' while they are waiting for the game to load.
*/


//Create the Preload State
var Preloader = new Kiwi.State('Preloader');


//Load in the Preloading Graphic.
Preloader.preload = function () {
	 
    this.addImage('kiwiImg', 'assets/img/loadingImage.png');

};


/* 
* Once the graphic has been loaded, switch to the Loading State 
* which will handle the Loading of all other in-game assets.
*/
Preloader.create = function () {

	//Resize the game stage to the correct size.
    game.stage.resize(340, 400);
    game.states.switchState("LoadingState");

};


/**
* The 'show' state is the state that is used when the user wants to 'print out' or 'save' their person.
*
* The difference between this state and the 'play' state is that this one doesn't contain next/previous buttons.
* 
*/

var ShowState = new Kiwi.State('ShowState');


/**
* This create method is executed when the Kiwi game changes to the show state.
* 
* @method create
* @param characterParts{object} The characterParts containing any dress up information
* @private
*/
ShowState.create = function (characterParts) {

    //Is the character being printed out?
    this.printing = false;
    this.capturing = false;

    //Get the character parts
    this.characterParts = characterParts;

    if (characterParts != undefined) {
        
        //Loop through the parts and show them onscreen.
        for (var i in characterParts) {
            this[i] = new Kiwi.GameObjects.Sprite(this, this.textures[i], 100, 80);
            this.addChildAt(this[i], 0);
            this[i].animation.switchTo(characterParts[i]);
        }

    }

    //Display the print button
    this.printButton = new Kiwi.GameObjects.Sprite(this, this.textures.PrintBtn, 0, 289);
    this.addChild(this.printButton);
    this.printButton.input.onUp.add(this.printImg, this);

    //Display the save button
    this.saveButton = new Kiwi.GameObjects.Sprite(this, this.textures.SaveBtn, 118, 289);
    this.addChild(this.saveButton);
    this.saveButton.input.onUp.add(this.saveImg, this);

    //Display the back button
    this.backButton = new Kiwi.GameObjects.Sprite(this, this.textures.BackBtn, 235, 289);
    this.addChild(this.backButton);
    this.backButton.input.onUp.add(this.goBack, this);
}


/**
* This method is executed when the print button was clicked.
* Hides the buttons and sets the printing to true.
* 
*/
ShowState.printImg = function () {
    this.printButton.visible = false;
    this.saveButton.visible = false;
    this.backButton.visible = false;

    this.printing = true;
}


/**
* This method is executed when the print button was clicked.
* Hides the buttons and sets the capturing to true.
* 
*/
ShowState.saveImg = function () {
    this.printButton.visible = false;
    this.saveButton.visible = false;
    this.backButton.visible = false;

    this.capturing = true;
}


/**
* The post render method is executed immediately after the stage has been rednered. 
* 
* We need this otherwise when it comes to 'saving' the canvas the buttons will still be visible (which we don't want).
*
*/
ShowState.postRender = function () {

    //Did the user want to print the stage?
    if (this.printing) {

        //Convert the canvas to an Image.
        var dataUrl = this.game.stage.canvas.toDataURL();

        //Create the new windows HTML.
        var windowContent = '<!DOCTYPE html>';
        windowContent += '<html>'
        windowContent += '<head><title>Your Dress Up</title></head>';
        windowContent += '<body>'
        windowContent += '<img src="' + dataUrl + '">';
        windowContent += '</body>';
        windowContent += '</html>';

        //Open that 'html' in a new window.
        var printWin = window.open('', '', 'width=1280,height=960');
        printWin.document.open();
        printWin.document.write(windowContent);
        printWin.document.close();

        //Focus that window and print.
        printWin.focus();
        printWin.print();
        printWin.close();

        //Show UI again.
        this.printButton.visible = true;
        this.saveButton.visible = true;
        this.backButton.visible = true;
        this.printing = false;
    }

    //Did the user want to 'save' the canvas.
    if (this.capturing) {

        //Get the canvas information
        var img = this.game.stage.canvas.toDataURL("image/octet-stream");
        
        //Open it up in a new window.
        window.open(img, "toDataURL() image", "width=1280, height=960");

        //Show UI again.
        this.printButton.visible = true;
        this.saveButton.visible = true;
        this.backButton.visible = true;
        this.capturing = false;
    }
}


/**
* Is executed when the user wants to go back to the 'play' state.
* 
*/
ShowState.goBack = function () {
    game.states.switchState("PlayState", PlayState, null, { characterParts: this.characterParts });
}




/**
* The core Dress-up blueprint game file.
* 
* This file is only used to initalise (start-up) the main Kiwi Game 
* and add all of the relevant states to that Game.
*
*/


//Initialise the Kiwi Game. 
var game = new Kiwi.Game('content', 'DressUpGame', null, { renderer: Kiwi.RENDERER_CANVAS });


//Add all the States we are going to use.
game.states.addState(Preloader);
game.states.addState(LoadingState);
game.states.addState(IntroState);
game.states.addState(PlayState);
game.states.addState(ShowState);


//Switch to/use the Preloader state. 
game.states.switchState("Preloader");