var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Gesture = (function () {
    function Gesture() {
        this.current_state = 'hover';
        this.wander_dir = '';
        this.wander_origin = { x: -100, y: -100 };
        this.callbacks = {};
    }
    Gesture.prototype.got = function (event) {
        if (event.type === 'mousedown') {
            this.wander_origin = this.getMousePos(event);
            if (this.current_state === 'hover') {
                this.set('down');
            }
            else {
                this.set('error');
                this.set('hover');
            }
        }
        else if (event.type === 'mousemove') {
            if (this.current_state === 'down') {
                var cp = this.getMousePos(event);
                var wp = this.wander_origin;
                this.wander_dir = '';
                if (cp.y < wp.y) {
                    this.wander_dir += 'N';
                }
                if (cp.y > wp.y) {
                    this.wander_dir += 'S';
                }
                if (cp.x < wp.x) {
                    this.wander_dir += 'W';
                }
                if (cp.x > wp.x) {
                    this.wander_dir += 'E';
                }
                if (this.wander_dir.length === 2) {
                    this.set('palette_mode');
                }
            }
        }
        else if (event.type === 'mouseup') {
            if (this.current_state === 'down') {
                this.set('hover');
            }
            else if (this.current_state === 'palette_mode') {
                this.set('hover');
            }
            else {
                this.set('error');
                this.set('hover');
            }
        }
    };
    Gesture.prototype.set = function (mode) {
        var transition_label = this.current_state + "-->" + mode;
        var gesture_out = document.getElementById('gesture_out');
        gesture_out.innerHTML = transition_label + '  ' + this.wander_dir;
        this.current_state = mode;
        if (this.callbacks[transition_label]) {
            this.callbacks[transition_label].call(null, this.wander_dir);
        }
    };
    Gesture.prototype.register_transition_cb = function (state1, state2, fn) {
        var transition_label = state1 + "-->" + state2;
        this.callbacks[transition_label] = fn;
    };
    Gesture.prototype.getMousePos = function (evt) {
        var rect = evt.target.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };
    return Gesture;
})();
var FPCanvas = (function () {
    function FPCanvas(selector_id) {
        this.canvas = document.getElementById(selector_id);
        this.cx = this.canvas.getContext('2d');
    }
    return FPCanvas;
})();
var Palette = (function (_super) {
    __extends(Palette, _super);
    function Palette(selector_id) {
        _super.call(this, selector_id);
        this.last_color = chroma('red');
        this.last_p_pos = { x: -200, y: -200 };
        this.last_p_color = null;
        this.gest = new Gesture();
        this.gest.register_transition_cb('down', 'palette_mode', function (wander) {
        });
        var that = this;
        this.canvas.addEventListener('mousemove', function (evt) {
            that.gest.got(evt);
        }, false);
        this.canvas.addEventListener('mouseout', function (evt) {
            that.gest.got(evt);
        }, false);
        this.canvas.addEventListener('mousedown', function (evt) {
            that.gest.got(evt);
        }, false);
        this.canvas.addEventListener('mouseup', function (evt) {
            that.gest.got(evt);
        }, false);
    }
    return Palette;
})(FPCanvas);
