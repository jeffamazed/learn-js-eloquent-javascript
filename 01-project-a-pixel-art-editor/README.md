# Pixel Art Editor

A simple pixel art editor built with JavaScript that lets you draw, erase, fill, and manipulate pixel images in your browser. The app supports undo, loading and saving images, picking colors, and drawing shapes like rectangles, circles, and lines.

## Features

- **Drawing Tools:** Freehand draw, straight line, rectangle, circle, fill, and color picker.
- **Undo:** Step back through your edit history.
- **Color Selection:** Choose any color for your artwork.
- **Load/Save:** Open images from your computer and save your artwork as PNG.
- **Responsive Canvas:** Draw with mouse or touch input.
- **Keyboard Shortcuts:**
  - `Ctrl+Z` or `Cmd+Z`: Undo
  - Hotkeys for tool selection (first letter of the tool name)

## Live Demo

Try it online: **[Pixel Art Editor Live](https://jeffamazed.github.io/pixel-art-editor/)**

## Getting Started

### Run Locally

1. **Clone the repository:**

   ```sh
   git clone https://github.com/jeffamazed/pixel-art-editor.git
   cd pixel-art-editor
   ```

2. **Open `index.html` in your browser.**

That's it! No build step required.

### Folder Structure

```
.
├── index.html
├── index.js
├── classes.js
├── drawingTools.js
└── README.md
```

- `index.js` — Entry point that initializes the app and connects everything.
- `classes.js` — Main app logic, Picture and UI classes.
- `drawingTools.js` — Drawing tool implementations.
- `index.html` — Main entry point.

## Usage

- **Select a tool** from the dropdown or use its hotkey.
- **Choose a color** with the color picker.
- **Draw** on the canvas using your mouse or touch.
- **Save** your artwork as a PNG.
- **Open** a PNG file to continue editing.
- **Undo** recent changes.

## Customization

You can easily add new tools or modify the UI by editing `classes.js`, `drawingTools.js`, or `index.js`.

## License

MIT License

---

Inspired by the [Eloquent JavaScript Pixel Editor](https://eloquentjavascript.net/19_paint.html).
