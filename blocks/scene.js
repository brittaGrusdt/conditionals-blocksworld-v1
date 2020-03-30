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

Engine.run(engine);
Render.run(render);

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
