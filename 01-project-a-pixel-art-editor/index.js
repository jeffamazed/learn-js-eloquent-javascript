import {
  Picture,
  PictureCanvas,
  PixelEditor,
  ToolSelect,
  ColorSelect,
  SaveButton,
  OpenButton,
  UndoButton,
} from "./classes.js";

import { draw, line, rectangle, circle, fill, pick } from "./drawingTools.js";

function updateState(state, action) {
  return { ...state, ...action };
}
function historyUpdateState(state, action) {
  if (action.undo === true) {
    if (state.done.length === 0) return state;
    return {
      ...state,
      picture: state.done[0],
      done: state.done.slice(1),
      doneAt: 0,
    };
  } else if (action.picture && state.doneAt < Date.now() - 1000) {
    return {
      ...state,
      done: [state.picture, ...state.done],
      doneAt: Date.now(),
      ...action,
    };
  } else {
    return { ...state, ...action };
  }
}

const startState = {
  tool: "draw",
  color: "#000000",
  picture: Picture.empty(100, 50, "#f0f0f0"),
  done: [],
  doneAt: 0,
};

const baseTools = { draw, line, fill, rectangle, circle, pick };

const baseControls = [
  ToolSelect,
  ColorSelect,
  OpenButton,
  SaveButton,
  UndoButton,
];

function startPixelEditor({
  state = startState,
  tools = baseTools,
  controls = baseControls,
}) {
  let app = new PixelEditor(state, {
    tools,
    controls,
    dispatch(action) {
      state = historyUpdateState(state, action);
      app.syncState(state);
    },
  });
  return app.dom;
}

document.querySelector("div").appendChild(startPixelEditor({}));
