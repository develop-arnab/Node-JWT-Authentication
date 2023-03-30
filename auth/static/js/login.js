var w = $(window).width() * window.devicePixelRatio;
var h = $(window).height() * window.devicePixelRatio;

// Matter.js module aliases
var Engine = Matter.Engine;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Constraint = Matter.Constraint;
var Composite = Matter.Composite;
var Composites = Matter.Composites;
var MouseConstraint = Matter.MouseConstraint;

// create a Matter.js engine
var engine = Engine.create({
  render: {
    element: document.body,
    options: {
      width: w,
      height: h,
      wireframes: false,
      background: '#1A54FE'
    }
  }
});

// add a mouse controlled constraint
var mouseConstraint = MouseConstraint.create(engine);
World.add(engine.world, mouseConstraint);

var addToWorld = [];

var ropeRenderStyle = {
  fillStyle: '#fff',
  strokeStyle: '#fff',
  lineWidth: 1
}

// create random poly's and a ground
var ranPolygons = Math.random() * 10 + 5 >> 0;
var prevPoly;
for (var i = 0; i < ranPolygons; i++) {
  var polyRadius = Math.random() * 40 + 40 >> 0;
  var polySides = Math.random() * 12 + 3 >> 0;
  var x = Math.random() * (w - polyRadius * 2) + polyRadius >> 0;
  var y = Math.random() * (h / 2 - polyRadius * 2) + polyRadius >> 0;
  var isStatic = Math.random() * 1 < 0.2;

  var poly = Bodies.polygon(x, y, polySides, polyRadius, {
    render: {
      fillStyle: isStatic ? '#0134CB' : makePattern(),
      strokeStyle: isStatic ? 'transparent' : '#fff',
      lineWidth: Math.random() * 5 + 2 >> 0
    },
    density: Math.random() * 0.1,
    isStatic: isStatic,
    restitution: Math.random() * 1
  });
  addToWorld.push(poly);

  // add rope if last poly was static
  if (prevPoly && prevPoly.isStatic && !isStatic) {
    var group = Body.nextGroup(true);

    var segments = Math.random() * 10 + 5 >> 0;
    var ropeA = Composites.stack(prevPoly.position.x, prevPoly.bounds.max.y, 1, segments, 20, 20, function(x, y) {
      return Bodies.rectangle(x, y, 4, 4, {
        collisionFilter: {
          group: group
        },
        render: ropeRenderStyle
      });
    });
    Composites.chain(ropeA, 0.5, 0, -0.5, 0, {
      stiffness: 0.8,
      length: 20,
      render: ropeRenderStyle
    });

    var newPosition = ropeA.bodies[ropeA.bodies.length - 1].position;
    Body.setPosition(poly, {
      x: newPosition.x,
      y: newPosition.y + polyRadius + 4
    });
    poly.collisionFilter.group = group;
    prevPoly.collisionFilter.group = group;

    var connectA = Constraint.create({
      bodyA: prevPoly,
      bodyB: ropeA.bodies[0],
      pointB: {
        x: -2,
        y: 0
      },
      render: ropeRenderStyle,
      stiffness: 0.8
    });
    var connectB = Constraint.create({
      bodyA: poly,
      bodyB: ropeA.bodies[ropeA.bodies.length - 1],
      render: ropeRenderStyle,
      stiffness: 0.8
    });
    addToWorld.push(ropeA);
    addToWorld.push(connectA);
    addToWorld.push(connectB);

  }

  prevPoly = poly;
}

// add borders
var border = 50;
var halfBorder = border / 2;
var borders = [
  Bodies.rectangle(w / 2, halfBorder, w + border, border, {
    isStatic: true,
    render: {
      fillStyle: '#0134CB',
      strokeStyle: 'transparent'
    }
  }),
  Bodies.rectangle(w / 2, h - halfBorder, w + border, border, {
    isStatic: true,
    render: {
      fillStyle: '#0134CB',
      strokeStyle: 'transparent'
    }
  }),
  Bodies.rectangle(halfBorder, h / 2, border, h + border, {
    isStatic: true,
    render: {
      fillStyle: '#0134CB',
      strokeStyle: 'transparent'
    }
  }),
  Bodies.rectangle(w - halfBorder, h / 2, border, h + border, {
    isStatic: true,
    render: {
      fillStyle: '#0134CB',
      strokeStyle: 'transparent'
    }
  }),
];
addToWorld = addToWorld.concat(borders);

// add all of the bodies to the world
World.add(engine.world, addToWorld);

// run the engine
runner = Engine.run(engine)

// gravity variety
function ranGrav() {
  engine.world.gravity.y = Math.random() * 2 - 1;
  engine.world.gravity.x = Math.random() * 2 - 1;
  var nextRanInc = Math.random() * 2000 + 1000;
  setTimeout(ranGrav, nextRanInc);
}
// setTimeout(ranGrav, 2000);

// patterns please
function makePattern(pWidth) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = canvas.height = (pWidth || 10 + Math.random() * 20 >> 0);
  ctx.fillStyle = '#fff';
  if (Math.random() * 2 < 1) {
    ctx.arc(canvas.width / 2 >> 0, canvas.width / 2 >> 0, canvas.width * (Math.random() * 0.5), 0, 2 * Math.PI);
    ctx.fill()
  } else {
    var half = canvas.width / 2;
    var lineHeight = Math.random() * canvas.width >> 0;
    ctx.translate(half, half);
    ctx.rotate(Math.random() * 90 * Math.PI / 180);
    ctx.fillRect(-canvas.width, -lineHeight / 2 >> 0, canvas.width * 2, lineHeight);
  }
  return ctx.createPattern(canvas, 'repeat');
}

$(engine.render.canvas).css({
  width: w * 1 / window.devicePixelRatio + 'px',
  height: h * 1 / window.devicePixelRatio + 'px'
})

// var paused = false;
// $('body').on('click', function(e) {
//   if (!paused) {
//     Matter.Runner.stop(runner);
//   } else {
//     runner = Engine.run(engine);
//   }
//   paused = !paused;
// });