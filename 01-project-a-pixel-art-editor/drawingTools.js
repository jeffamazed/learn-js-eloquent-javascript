// DRAWING TOOLS
function drawLine(from, to, color) {
  let points = [];
  let dx = Math.abs(from.x - to.x);
  let dy = Math.abs(from.y - to.y);

  if (dx > dy) {
    if (from.x > to.x) [from, to] = [to, from];
    let slope = (to.y - from.y) / (to.x - from.x);
    for (let { x, y } = from; x <= to.x; x++) {
      points.push({ x, y: Math.round(y), color });
      y += slope;
    }
  } else {
    if (from.y > to.y) [from, to] = [to, from];
    let slope = (to.x - from.x) / (to.y - from.y);
    for (let { x, y } = from; y <= to.y; y++) {
      points.push({ x: Math.round(x), y, color });
      x += slope;
    }
  }
  return points;
}

function draw(pos, state, dispatch) {
  function connect(newPos, state) {
    let line = drawLine(pos, newPos, state.color);
    pos = newPos;
    dispatch({ picture: state.picture.draw(line) });
  }
  connect(pos, state);
  return connect;
}

function line(pos, state, dispatch) {
  return (end) => {
    let line = drawLine(pos, end, state.color);
    dispatch({ picture: state.picture.draw(line) });
  };
}

function rectangle(start, state, dispatch) {
  function drawRectangle(pos) {
    let xStart = Math.min(start.x, pos.x);
    let yStart = Math.min(start.y, pos.y);
    let xEnd = Math.max(start.x, pos.x);
    let yEnd = Math.max(start.y, pos.y);
    let drawn = [];
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        drawn.push({ x, y, color: state.color });
      }
    }
    dispatch({ picture: state.picture.draw(drawn) });
  }
  drawRectangle(start);
  return drawRectangle;
}

function circle(start, state, dispatch) {
  function drawCircle(to) {
    let radius = Math.sqrt((to.x - start.x) ** 2 + (to.y - start.y) ** 2);
    let radiusC = Math.ceil(radius);
    let drawn = [];

    for (let dy = -radiusC; dy <= radiusC; dy++) {
      for (let dx = -radiusC; dx <= radiusC; dx++) {
        let distSq = dy ** 2 + dx ** 2;
        if (distSq > radius ** 2) continue;

        let y = start.y + dy,
          x = start.x + dx;
        if (
          y < 0 ||
          y >= state.picture.height ||
          x < 0 ||
          x >= state.picture.width
        )
          continue;
        drawn.push({ x, y, color: state.color });
      }
    }
    dispatch({ picture: state.picture.draw(drawn) });
  }
  drawCircle(pos);
  return drawCircle;
}

const around = [
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
];

function fill({ x, y }, state, dispatch) {
  let targetColor = state.picture.pixel(x, y);
  let drawn = [{ x, y, color: state.color }];
  let visited = new Set();

  for (let done = 0; done < drawn.length; done++) {
    for (let { dx, dy } of around) {
      let x = drawn[done].x + dx,
        y = drawn[done].y + dy;
      if (
        x >= 0 &&
        x < state.picture.width &&
        y >= 0 &&
        y < state.picture.height &&
        !visited.has(x + "," + y) &&
        state.picture.pixel(x, y) === targetColor
      ) {
        drawn.push({ x, y, color: state.color });
        visited.add(x + "," + y);
      }
    }
  }
  dispatch({ picture: state.picture.draw(drawn) });
}

function pick(pos, state, dispatch) {
  dispatch({ color: state.picture.pixel(pos.x, pos.y) });
}

export { draw, line, rectangle, circle, fill, pick };
