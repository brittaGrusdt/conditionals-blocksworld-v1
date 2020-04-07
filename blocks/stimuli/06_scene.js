let engine,
    render;
let animationStarted = false;

createWorld = function(){
  // create engine
  engine = Engine.create({
    timing: {
      timeScale: 1
    }
  });

  let renderAt = MODE === "experiment" ?
    document.getElementById('animationDiv') : document.body;

  render = Render.create({
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

  // after duration of simulation freeze and save data
  // Events.on(engine, 'afterUpdate', function (event) {
  //   if (animationStarted && engine.timing.timestamp >= SIMULATION.duration) {
  //     freeze();
  //     Render.stop(render)
  //
  //     // Stop animation and clear world
  //     World.clear(engine.world)
  //     Engine.clear(engine);
  //     animationStarted = false;
  //   }
  // });
}

addObjs2World = function(objs){
  objs = [Bottom].concat(objs);
  World.add(engine.world, objs);
}

clearWorld = function(stop2Render=false){
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

freeze = function () {
  engine.timing.timeScale = 0
}

// start = function(){
//   Engine.run(engine);
//   engine.timing.timeScale = 1;
//   animationStarted = true;
//   // move(stimulus.circ, "centcreateWorlder", -180, 0.03)
// }

show = function(){
  // createWorld();
  // setupWorld(objs);
  // run the engine for simulation of our world
  Engine.run(engine);
  // run the renderer for visualization
  Render.run(render);
  freeze();
}

var runAnimation = function () {
  animationStarted = true
  engine.timing.timeScale = 1
}


// addStopRenderAndClearWorldEvent = function(){
//   // after duration of simulation, freeze and save data
//   Events.on(engine, 'afterUpdate', function (event) {
//     // only do this once after specified nb of ms passed
//     if (engine.timing.timestamp >= SIMULATION.duration) {
//       freeze();
//       Render.stop(render);
//       clearWorld(stop2Render=false);
//     }
//   });
// }

// var runAnimation = function () {
//   addStopRenderAndClearWorldEvent();
//   Engine.run(engine);
// }
