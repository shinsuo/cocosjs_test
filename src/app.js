
var updateStepValue = 60;
var WALLS_WIDTH = 5;
var WALLS_ELASTICITY = 1;
var WALLS_FRICTION = 0;
var DIVIDE = 10;

var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    isDraw:false,
    controller:null,
    space:null,
    winSize:null,
    tarPos:null,
    phDebugNode:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;
        this.winSize = size;
        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        // position the label on the center of the screen
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2 + 200;
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);

        // add "HelloWorld" splash screen"
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);

        this.addMouseTouchEvent();

        this.controller = this;
        this.initPhysics();
        this.initDebugMode(this.controller);
        this.scheduleUpdate();


        this.addWallsAndGround();
        this.addPhysicsCircle();
        return true;
    },

    initPhysics:function() {
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, 0);
        this.space.iterations = 30;
        this.space.sleepTimeThreshold = Infinity;
        this.space.collisionSlop = Infinity;
    },

    initDebugMode:function(controller) {
        this.phDebugNode = new cc.PhysicsDebugNode(this.space);
        controller.addChild(this.phDebugNode, 10);
    },


    update:function (dt) {
        this.space.step(dt);
        this.drawLine();
    },

    drawLine:function(){
        if(this.isDraw){
            // this.space.segmentQueryFirst(this.phNode.getPosition(), this.tarPos,,);
            this.phDebugNode.drawSegment(this.phNode.getPosition(), this.tarPos, 1, new cc.Color(255,255,255));
        }
    },

    addWallsAndGround:function() {
        var less = 1/DIVIDE;
        var large = 1-less;
        this.leftWall = new cp.SegmentShape(this.space.staticBody, new cp.v(this.winSize.width*less, this.winSize.height*less), new cp.v(this.winSize.width*less, this.winSize.height*large), WALLS_WIDTH);
        this.leftWall.setElasticity(WALLS_ELASTICITY);
        this.leftWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(this.leftWall);

        this.rightWall = new cp.SegmentShape(this.space.staticBody, new cp.v(this.winSize.width*large, this.winSize.height*large), new cp.v(this.winSize.width*large, 0), WALLS_WIDTH);
        this.rightWall.setElasticity(WALLS_ELASTICITY);
        this.rightWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(this.rightWall);

        this.bottomWall = new cp.SegmentShape(this.space.staticBody, new cp.v(this.winSize.width*less, this.winSize.height*less), new cp.v(this.winSize.width*large, this.winSize.height*less), WALLS_WIDTH);
        this.bottomWall.setElasticity(WALLS_ELASTICITY);
        this.bottomWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(this.bottomWall);

        this.upperWall = new cp.SegmentShape(this.space.staticBody, new cp.v(this.winSize.width*less, this.winSize.height*large), new cp.v(this.winSize.width*large, this.winSize.height*large), WALLS_WIDTH);
        this.upperWall.setElasticity(WALLS_ELASTICITY);
        this.upperWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(this.upperWall);
    },

    addPhysicsCircle:function () {
        //#1
        var circle = cc.Sprite.create("res/circle.png");
        var mass = 10;

        //#2
        var nodeSize = circle.getContentSize(),
            phBody = null,
            phShape = null,
            scaleX = 1,
            scaleY = 1;
        nodeSize.width *= scaleX;
        nodeSize.height *= scaleY;
        this.phNode = cc.PhysicsSprite.create("res/circle.png"),

        //#3
        phBody = this.space.addBody(new cp.Body(mass, cp.momentForBox(mass, nodeSize.width, nodeSize.height)));
        phBody.setPos(cc.p(this.winSize.width * 0.5, this.winSize.height * 0.5));

        //#4
        phShape = this.space.addShape(new cp.CircleShape(phBody, nodeSize.width * 0.5, cc.p(0, 0)));
        phShape.setFriction(0);
        phShape.setElasticity(1);

        //#5
        this.phNode.setBody(phBody);
        this.phNode.setRotation(0);
        this.phNode.setScale(1);

        this.controller.addChild(this.phNode);
    },

    addSprite:function(pos) {
        var sp = new cc.Sprite(res.unit_anime_1280103_png);
        sp.scale = 0.25;
        sp.setPosition(cc.p(pos.x, pos.y ));
        this.addChild(sp);
    },

    addSpine:function(pos) {
        arr = [
            "20007_skill_rank_3_full",
            // "20007_skill_rank_3",
            // "attack_beast_2000705",
            // "effect_water",
            "unit_anime_1280103",
            "unit_anime_2000705"
        ];
        for (var index = 0; index < arr.length; index++) {
            var element = arr[index];
            
            var spine = new sp.SkeletonAnimation("res/"+element+".json", "res/"+element+".atlas", 0.25);
            spine.setPosition(cc.p(pos.x, pos.y ));
            spine.setAnimation(0, 'wait', true);
            // spine.setSkin("sakana");
            this.addChild(spine);
        }
        
    },
    addMouseTouchEvent: function(){
        var self = this;
        if ('mouse' in cc.sys.capabilities) {
            cc.eventManager.addListener(cc.EventListener.create({
                event : cc.EventListener.MOUSE,
                onMouseDown : function(event) {
                    var pos = event.getLocation(); //当前事件发生的光标位置
                    // self.addSpine(pos);
                    self.isDraw = true;
                    return true;
                },
                onMouseMove:function (event) {
                    var pos = event.getLocation();
                    if(self.isDraw){
                        self.tarPos = pos;
                    }
                },
                onMouseUp:function (event) {
                    var pos = event.getLocation();
                    self.isDraw = false;
                }
            }), this);
        }
        else if ('touches' in cc.sys.capabilities) {
            self._listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan: function(touch, event){
                    //cc.log("touchbegan...");
                    var pos = touch.getLocation(); //当前事件发生的光标位置
                    // self.addSpine(pos);
                    self.isDraw = true;
                    return true;
                },
                onTouchMoved:function(touch, event){
                    if(isDraw){
                        self.tarPos = pos;
                    }
                },
                onTouchEnded: function(touch, event) {
                    self.isDraw = false;
                }
            });
            cc.eventManager.addListener(self._listener, -9999999);
        }
    },
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

