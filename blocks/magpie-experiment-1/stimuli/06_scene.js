let animationStarted = false;

createWorld = function(){
  // create engine
  let engine = Engine.create({
    timing: {
      timeScale: 1
    }
  });

  let renderAt = MODE === "experiment" ?
    document.getElementById('animationDiv') : document.body;

  let render = Render.create({
    element: renderAt,
    engine: engine,
    options: {
      width: scene.w,
      height: scene.h,
      // showAngleIndicator: true,
      // showCollisions: true,
      wireframes: false,
      background: 'transparent'
    }
  });
  return {engine, render}
}

addObjs2World = function(objs, engine, bottom=true){
  objs = bottom ? [Bottom].concat(objs) : objs;
  World.add(engine.world, objs);
}

clearWorld = function(engine, render, stop2Render=false){
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

freeze = function (engine) {
  engine.timing.timeScale = 0
}

show = function(engine, render){
  Engine.run(engine);
  Render.run(render);
  freeze(engine);
}

var runAnimation = function (engine) {
  animationStarted = true
  engine.timing.timeScale = 1
}
