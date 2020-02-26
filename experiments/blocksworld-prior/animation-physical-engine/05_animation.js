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

let objPropsBefore = {};
let objPropsAfter = {};

clearWorld = function(worldObjects){
  removeBodies(worldObjects);
  // // World.clear(engine.world, deep = true) // doesn't remove static objects
  engine.events = {};
  Engine.clear(engine);
}

savePositionsBodies = function(){
  engine.world.bodies.forEach(function (body) {
    objPropsAfter[body.label] = JSON.parse(JSON.stringify(body.position));
  });
  // document.getElementById("greenAfterX").innerHTML = "X after:" + objPropsAfter["block1"].x
  // document.getElementById("greenAfterY").innerHTML = "Y after:" + objPropsAfter["block1"].y
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
      savePositionsBodies();
      clearWorld(worldObjects);
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
var setupWorld = function(worldObjects, place2Render){
  setupEngine(place2Render);
  worldObjects.forEach(function(obj){
    if(obj.add2World){
      World.add(engine.world, obj)
    }
  })
  // save start positions of objects + labels
  engine.world.bodies.forEach(function (body) {
    objPropsBefore[body.label] = JSON.parse(JSON.stringify(body.position));
  });
  // document.getElementById("greenBeforeX").innerHTML = 'before x: ' + objPropsBefore["block1"].x
  // document.getElementById("greenBeforeY").innerHTML = 'before y: ' + objPropsBefore["block1"].y
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
  savePositionsBodies();
  let results = addSimulationEffects(objPropsBefore, objPropsAfter);
  clearWorld(worldObjects);
  return(results)
}

/**
* Determines whether relevant objects fell during simulation.
*
* Adds ratio of x/y-values, and based on this whether object fell, of all bodies
* other than ground or platforms.
*
* @param {Object<string, Object>} objPropsBefore position of objects for each
* block before (single) simulation, keys are labels of blocks, e.g.'greenBlock'
* @param {number} objPropsBefore.x x position of block
* @param {number} objPropsBefore.y y position of block
*
* @param {Object<string, Object>} objPropsAfter position of objects for each
* block after (single) simulation, keys are labels of blocks, e.g.'greenBlock'
* @param {number} objPropsAfter.x x position of block
* @param {number} objPropsAfter.y y position of block
*
* @return {Array<Object>} objPropsAfter with the following added properties
* for relevant blocks in world (i.e. not ground or platforms):
* ratioX, ratioY, fallen.
*/
var addSimulationEffects = function(objPropsBefore, objPropsAfter){
  let results = [];
  let dataBlocks = _.pick(objPropsBefore, 'block1', 'block2');
  var entries = Object.entries(dataBlocks);
  for (var i=0; i< entries.length; i++){
      let label = entries[i][0];
      let obj = entries[i][1];
      let posBefore = objPropsBefore[label];
      if(label !== "block1" && label !== "block2"){
        continue;
      }
      var posAfter = objPropsAfter[label]
      var movementX = Math.abs(Math.round(posAfter.x) - posBefore.x)
      var movementY = Math.round(posAfter.y) - posBefore.y
      results.push({label, movedX: movementX, movedY: movementY});
  }
  return(results)
}
