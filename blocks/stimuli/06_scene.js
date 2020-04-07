// let engine,
    // render;
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
  return {engine, render}
}

addObjs2World = function(objs, engine){
  objs = [Bottom].concat(objs);
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

// start = function(){
//   Engine.run(engine);
//   engine.timing.timeScale = 1;
//   animationStarted = true;
//   // move(stimulus.circ, "centcreateWorlder", -180, 0.03)
// }

show = function(engine, render){
  // createWorld();
  // setupWorld(objs);
  // run the engine for simulation of our world
  Engine.run(engine);
  // run the renderer for visualization
  Render.run(render);
  freeze(engine);
}

var runAnimation = function (engine) {
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
