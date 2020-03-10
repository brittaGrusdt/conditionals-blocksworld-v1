// Module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;
    Events = Matter.Events;
    Runner = Matter.Runner;
    Mouse = Matter.Mouse;
    MouseConstraint = Matter.MouseConstraint;

let engine;
let render;

let globalObjPropsBefore = {};
let globalObjPropsAfter = {};

clearWorld = function(worldObjects){
  removeBodies(worldObjects);
  // // World.clear(engine.world, deep = true) // doesn't remove static objects
  engine.events = {};
  Engine.clear(engine);
}

savePositionsAfterSimulation = function(){
  engine.world.bodies.forEach(function (body) {
    globalObjPropsAfter[body.label] = JSON.parse(JSON.stringify(body.position));
  });
  // document.getElementById("greenAfterX").innerHTML = "X after:" + globalObjPropsAfter["block1"].x
  // document.getElementById("greenAfterY").innerHTML = "Y after:" + globalObjPropsAfter["block1"].y
}

addStopRenderAndClearWorldEvent = function(){
  // after duration of simulation, freeze and save data
  Events.on(engine, 'afterUpdate', function (event) {
    // only do this once after specified nb of ms passed
    if (engine.timing.timestamp >= SIMULATION.duration) {
      console.log(engine.timing.timestamp)
      freezeAnimation();
      // document.getElementById("timestamp").innerHTML = "timestamp:" + engine.timing.timestamp;
      // This freezes what is rendered at this point in time
      Render.stop(render);
      // save body positions + labels after animation
      savePositionsAfterSimulation();
      clearWorld(worldObjects);
    }
  });
}

setupEngineWithRenderer = function(place2Render){
  // create engine
  engine = Engine.create({
    timing: {
      timeScale: 1
    }
  });

  render = Render.create({
    element: place2Render,
    engine: engine,
    options: {
      width: CANVAS.width,
      height: CANVAS.height,
      // showAngleIndicator: true,
      // showCollisions: true,
      // showVelocity: true,
      wireframes: false,
      background: 'transparent'
    }
  });
}

setupEngine = function(place2Render){
  // create engine
  engine = Engine.create({
    timing: {
      timeScale: 1
    }
  });
}

var freezeAnimation = function () {
  engine.timing.timeScale = 0
}


/**
 * shows world to model with given objects.
 *
 * animation is started but directly freezed.
 *
 * @param {Array<Matter.Bodies>} worldObjects
 * @param {Element} place2Render
 */
var setupWorld = function(worldObjects, place2Render=null){
  place2Render === null ? setupEngine() : setupEngineWithRenderer(place2Render);
  // setupEngine(place2Render);
  worldObjects.forEach(function(obj){
    if(obj.add2World){
      World.add(engine.world, obj)
    }
  })
  // save start positions of objects + labels
  engine.world.bodies.forEach(function (body) {
    globalObjPropsBefore[body.label] = JSON.parse(JSON.stringify(body.position));
  });
  // document.getElementById("greenBeforeX").innerHTML = 'before x: ' + globalObjPropsBefore["block1"].x
  // document.getElementById("greenBeforeY").innerHTML = 'before y: ' + globalObjPropsBefore["block1"].y
}

// show simulated world
var showScene = function (){
  Render.run(render);
}

/**
 * runs animation of the simulated world;requires prior call of setupWorld.
 */
var runAnimation = function () {
  addStopRenderAndClearWorldEvent();
  Engine.run(engine);
}

function removeBodies(arr) {
	for (var i=0;i<arr.length;i++) {
		var body = arr[i];
		World.remove(engine.world, body);
	}
}

var forwardAnimation = function(worldObjects){
  var n = 0
  while(n < 500) {
    Engine.update(engine, 10.0)
    n = n + 1
  }
  savePositionsAfterSimulation();
}

/**
* Determines whether relevant objects fell during simulation.
*
* Adds ratio of x/y-values, and based on this whether object fell, of all bodies
* other than ground or platforms.
*
* @return {Array<Object>} list of objects containing the objects label, whether
* it fell, whether it touches the ground, how much it moved in x-direction and
* how much it moved in y-direction.
*/
var simulationEffects = function(){
  let results = {};
  let dataBlocks = _.pick(globalObjPropsBefore, 'block1', 'block2');
  var entries = Object.entries(dataBlocks);
  for (var i=0; i< entries.length; i++){
      let label = entries[i][0];
      // console.log(label)
      let posBefore = entries[i][1];
      var posAfter = globalObjPropsAfter[label]
      // console.log(posAfter)

      // does the block touch the ground? (lies either on long or short side)
      let yHorizontal = GROUND.y - GROUND.height / 2 - BLOCKS.width / 2;
      let yVertical = GROUND.y - GROUND.height / 2 - BLOCKS.height / 2;
      let onGroundVertical = Math.round(posAfter.y - yVertical) == 0;
      let onGroundHorizontal = Math.round(posAfter.y - yHorizontal) == 0;
      let onGround = onGroundVertical || onGroundHorizontal;

      // how much did the block move?
      var movedX = Math.abs(Math.round(posAfter.x - posBefore.x))
      var movedY = Math.round(posAfter.y - posBefore.y)

      // did the block fall?
      var fell = movedY != 0;

      results[label] = {onGround, fell, movedX, movedY};
  }
  return(results)
}
