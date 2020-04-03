var engine = Engine.create({
});

var render = Render.create({
                element: document.body,
                engine: engine,
                options: {
                    width: scene.w,
                    height: scene.h,
                    wireframes: false,
                    showAngleIndicator: false,
                    showCollisions: false,
                    background: "transparent"
                }
             });
// add objects to world is done in index.html

clearWorld = function(stop2Render=true){
  engine.events = {};
  Render.stop(render);
  Engine.clear(engine);
  World.clear(engine.world);
  if(stop2Render){
    render.canvas.remove();
    render.canvas = null;
    render.context = null;
    render.textures = {};
  }
}

stop = function(){
  Render.stop(render);
}

freeze = function () {
  engine.timing.timeScale = 0
}

start = function(){
  Render.run(render);
  Engine.run(engine);
  engine.timing.timeScale = 1;
  // move(stimulus.circ, "center", -180, 0.03)
}

show = function(){
  start();
  freeze();
}
