
class Gesture {
  current_state = 'hover';
  wander_dir = '';
  wander_origin = {x:-100, y:-100};
  callbacks = {};
  got(event:Event) {
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
        let cp = this.getMousePos(event);
        let wp = this.wander_origin;
        this.wander_dir = '';
        if (cp.y < wp.y) {this.wander_dir += 'N'}
        if (cp.y > wp.y) {this.wander_dir += 'S'}
        if (cp.x < wp.x) {this.wander_dir += 'W'}
        if (cp.x > wp.x) {this.wander_dir += 'E'}
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
  }
  set(mode:string) {
    let transition_label = this.current_state+"-->"+mode;
    var gesture_out = document.getElementById('gesture_out');
    gesture_out.innerHTML = transition_label + '  ' + this.wander_dir;
    this.current_state = mode;
    if (this.callbacks[transition_label]) {
      this.callbacks[transition_label].call(null, this.wander_dir);
    }
  }
  register_transition_cb(state1:string, state2:string, fn:Function) {
    let transition_label = state1+"-->"+state2;
    this.callbacks[transition_label] = fn;
  }
  getMousePos(evt) {
    var rect = evt.target.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
}

class FPCanvas {
  canvas:HTMLCanvasElement;
  cx:CanvasRenderingContext2D;
  constructor(selector_id:string) {
    this.canvas = document.getElementById(selector_id);
    this.cx = this.canvas.getContext('2d');
  }
}

class Palette extends FPCanvas {
  gest:Gesture;
  constructor(selector_id:string) {
    super(selector_id);
    this.last_color = chroma('red');
    this.last_p_pos = {x:-200, y:-200};
    this.last_p_color = null;

    this.gest = new Gesture();
    this.gest.register_transition_cb('down', 'palette_mode', function(wander){
      //alert('down-->palette_mode '+wander);
    });
    let that = this;
    this.canvas.addEventListener('mousemove', function(evt) {
      that.gest.got(evt);
    }, false);

    this.canvas.addEventListener('mouseout', function(evt) {
      that.gest.got(evt);
    }, false);

    this.canvas.addEventListener('mousedown', function(evt) {
      that.gest.got(evt);
    }, false);

    this.canvas.addEventListener('mouseup', function(evt) {
      that.gest.got(evt);
    }, false);

  }

}
