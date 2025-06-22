function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child !== "string") dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }

  return dom;
}

class Picture {
  constructor(width, height, pixels) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }

  static empty(width, height, color) {
    let pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
  }

  pixel(x, y) {
    return this.pixels[x + y * this.width];
  }

  draw(pixels) {
    let copy = this.pixels.slice();
    for (let { x, y, color } of pixels) {
      copy[x + y * this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
  }
}

const scale = 10;

class PictureCanvas {
  constructor(picture, pointerDown) {
    this.dom = elt("canvas", {
      onmousedown: (event) => this.mouse(event, pointerDown),
      ontouchstart: (event) => this.touch(event, pointerDown),
    });
    this.syncState(picture);
  }

  syncState(picture) {
    if (this.picture === picture) return;
    // if (!picture) return;
    drawPicture(picture, this.dom, scale, this.picture);

    this.picture = picture;
  }
}

function drawPicture(picture, canvas, scale, previous) {
  if (
    previous == null ||
    previous.width !== picture.width ||
    previous.height !== picture.height
  ) {
    canvas.width = picture.width * scale;
    canvas.height = picture.height * scale;
    previous = null;
  }

  let c = canvas.getContext("2d");
  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      let color = picture.pixel(x, y);

      if (previous == null || previous.pixel(x, y) !== color) {
        c.fillStyle = color;
        c.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }
}

PictureCanvas.prototype.mouse = function (downEvent, onDown) {
  if (downEvent.button !== 0) return;
  let pos = pointerPosition(downEvent, this.dom);
  let onMove = onDown(pos);
  if (!onMove) return;

  let move = (moveEvent) => {
    if (moveEvent.buttons === 0) {
      this.dom.removeEventListener("mousemove", move);
    } else {
      let newPos = pointerPosition(moveEvent, this.dom);
      if (newPos.x === pos.x && newPos.y === pos.y) return;
      pos = newPos;
      onMove(newPos);
    }
  };
  this.dom.addEventListener("mousemove", move);
};

PictureCanvas.prototype.touch = function (startEvent, onDown) {
  let pos = pointerPosition(startEvent.touches[0], this.dom);
  let onMove = onDown(pos);
  startEvent.preventDefault();
  if (!onMove) return;

  let move = (moveEvent) => {
    let newPos = pointerPosition(moveEvent.touches[0], this.dom);
    if (newPos.x === pos.x && newPos.y === pos.y) return;
    pos = newPos;
    onMove(newPos);
  };
  let end = () => {
    this.dom.removeEventListener("touchmove", move);
    this.dom.removeEventListener("touchend", end);
  };

  this.dom.addEventListener("touchmove", move);
  this.dom.addEventListener("touchend", end);
};

function pointerPosition(pos, domNode) {
  let rect = domNode.getBoundingClientRect();
  return {
    x: Math.floor((pos.clientX - rect.left) / scale),
    y: Math.floor((pos.clientY - rect.top) / scale),
  };
}

class PixelEditor {
  constructor(state, config) {
    let { tools, controls, dispatch } = config;
    this.state = state;

    this.canvas = new PictureCanvas(state.picture, (pos) => {
      let tool = tools[this.state.tool];
      let onMove = tool(pos, this.state, dispatch);

      if (onMove) return (pos) => onMove(pos, this.state);
    });

    this.controls = controls.map((Control) => new Control(state, config));

    this.dom = elt(
      "div",
      {
        tabIndex: 0,
        onkeydown: (event) => this.keyDown(event, config),
      },
      this.canvas.dom,
      elt(
        "div",
        { className: "ui-panel" },
        ...this.controls.reduce((a, c) => a.concat(c.dom), []),
      ),
    );
  }

  keyDown(event, config) {
    if (event.key.toLowerCase() === "z" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      config.dispatch({ undo: true });
    } else if (
      event.key.toLowerCase() === "s" &&
      (event.ctrlKey || event.metaKey)
    ) {
      event.preventDefault();
      document.getElementById("save").click();
    } else if (
      event.key.toLowerCase() === "o" &&
      (event.ctrlKey || event.metaKey)
    ) {
      event.preventDefault();
      document.getElementById("open").click();
    } else if (!event.ctrlKey && !event.metaKey && !event.altKey) {
      for (let tool of Object.keys(config.tools)) {
        if (tool[0] === event.key) {
          event.preventDefault();
          config.dispatch({ tool });
        }
      }
    }
  }

  syncState(state) {
    this.state = state;
    this.canvas.syncState(state.picture);
    for (let ctrl of this.controls) ctrl.syncState(state);
  }
}

class ToolSelect {
  constructor(state, { tools, dispatch }) {
    this.select = elt(
      "select",
      {
        onchange: () => dispatch({ tool: this.select.value }),
      },
      ...Object.keys(tools).map((name) =>
        elt("option", { selected: name === state.tool }, name),
      ),
    );
    this.dom = elt("label", null, "🖌 Tool: ", this.select);
  }

  syncState(state) {
    this.select.value = state.tool;
  }
}

class ColorSelect {
  constructor(state, { dispatch }) {
    this.input = elt("input", {
      type: "color",
      value: state.color,
      onchange: () => dispatch({ color: this.input.value }),
    });
    this.dom = elt("label", null, "🎨 Color: ", this.input);
  }

  syncState(state) {
    this.input.value = state.color;
  }
}

class SaveButton {
  constructor(state) {
    this.picture = state.picture;
    this.dom = elt(
      "button",
      {
        onclick: () => this.save(),
        id: "save",
      },
      "💾 Save",
    );
  }

  save() {
    let canvas = elt("canvas");
    drawPicture(this.picture, canvas, 1);
    let link = elt("a", {
      href: canvas.toDataURL(),
      download: "pixelart.png",
    });
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  syncState(state) {
    this.picture = state.picture;
  }
}

class OpenButton {
  constructor(_, { dispatch }) {
    this.dom = elt(
      "button",
      {
        onclick: () => startLoad(dispatch),
        id: "open",
      },
      "📁 Open",
    );
  }

  syncState() {}
}

function startLoad(dispatch) {
  let input = elt("input", {
    type: "file",
    onchange: () => finishLoad(input.files[0], dispatch),
  });
  document.body.appendChild(input);
  input.click();
  input.remove();
}

function finishLoad(file, dispatch) {
  if (file === null) return;
  let reader = new FileReader();
  reader.addEventListener("load", () => {
    let image = elt("img", {
      onload: () =>
        dispatch({
          picture: pictureFromImage(image),
          done: [],
          doneAt: 0,
        }),
      src: reader.result,
    });
  });
  reader.readAsDataURL(file);
}

function pictureFromImage(image) {
  let width = Math.min(120, image.width);
  let height = Math.min(120, image.height);
  let canvas = elt("canvas", { width, height });
  let c = canvas.getContext("2d");
  c.drawImage(image, 0, 0);
  let pixels = [];
  let { data } = c.getImageData(0, 0, width, height);

  function hex(n) {
    return n.toString(16).padStart(2, "0");
  }

  for (let i = 0; i < data.length; i += 4) {
    let [r, g, b] = data.slice(i, i + 3);
    pixels.push("#" + hex(r) + hex(g) + hex(b));
  }
  return new Picture(width, height, pixels);
}

class UndoButton {
  constructor(state, { dispatch }) {
    this.dom = elt(
      "button",
      {
        onclick: () => dispatch({ undo: true }),
        disabled: state.done.length === 0,
      },
      "⮪ Undo",
    );
  }

  syncState(state) {
    this.dom.disabled = state.done.length === 0;
  }
}

export {
  Picture,
  PictureCanvas,
  PixelEditor,
  ToolSelect,
  ColorSelect,
  SaveButton,
  OpenButton,
  UndoButton,
};
