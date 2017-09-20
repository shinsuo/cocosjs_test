
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

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

        return true;
    },

    addSpine:function(pos) {
        var spine = new sp.SkeletonAnimation(res.unit_anime_1280103_json, res.unit_anime_1280103_atlas, 0.25);
        spine.setPosition(cc.p(pos.x, pos.y ));
        spine.setAnimation(0, 'wait', true);
        // spine.setSkin("sakana");
        this.addChild(spine);
    },
    addMouseTouchEvent: function(){
        var self = this;
        if ('mouse' in cc.sys.capabilities) {
            cc.eventManager.addListener(cc.EventListener.create({
                event : cc.EventListener.MOUSE,
                onMouseDown : function(event) {
                    var pos = event.getLocation(); //当前事件发生的光标位置
                    self.addSpine(pos);
                    return true;
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
                    self.addSpine(pos);
                    return true;
                },
                onTouchEnded: function(touch, event) {
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

