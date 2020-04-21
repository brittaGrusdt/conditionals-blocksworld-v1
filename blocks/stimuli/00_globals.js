var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;
    Body = Matter.Body;
    Constraint = Matter.Constraint;
    Events = Matter.Events;

cols = {
      'red': '#E74C3C',
      'turquois': '#38FCFF',
      'blue': '#2471A3',
      'royal': '#0496FF',
      'green': '#28B463',
      'very_green': '#8DDE19',
      'pinkish': "#D81159",
      'light_green': '#51DE19',
      'purple': '#AF7AC5',
      'brown': '#B05D3A',
      'darkbrown': '#874400',
      'grey': '#E3DFDC',
      'darkgrey': '#938F8E',
      'darkbrown': '#642F17',
      'black': '#191817',
      'olive': '#53553B',
      'orange': '#E2A818',
      'yellow': '#F3ED2B',
      'bordeaux': '#D81159',
      'darkyellow': '#FFBC42',
      'darkgreen': '#119533'
    };
cols.plank = cols.blue
cols.test_blocks = [cols.green, cols.royal];
cols.train_blocks = [cols.bordeaux, cols.darkyellow];
