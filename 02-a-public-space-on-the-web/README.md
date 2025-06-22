# Public Space on the Web

**Public Space on the Web** is a collaborative, live-editable website: anyone can visit, view, and edit the site's files directly from the browser. It's a minimal, hackable playground for sharing and remixing HTML, CSS, JavaScript, or any text file—powered by a simple Node.js HTTP server.

> **Note:** This is a public, open, and intentionally insecure demo space. Anything you or others edit is instantly live for everyone.

---

## ✨ Features

- **Edit the webpage from the webpage itself:**  
  Browse and edit files (including HTML, CSS, JS) using a web-based editor.
- **Live updates:**  
  Changes are saved instantly and visible to all visitors.
- **Minimal server:**  
  Handles GET, PUT, DELETE, and MKCOL (make directory) requests for file manipulation.
- **No authentication:**  
  Anyone can read or write files. Perfect for play, demos, and experimenting.

---

## 🚀 Getting Started

### 1. Clone and Install

```sh
git clone https://github.com/jeffamazed/public-space-on-the-web.git
cd public-space-on-the-web
npm install  # Install dependencies (mime-types)
```

### 2. Start the Server

From the root of your project folder, run:

```sh
node server.js
```

By default, the server listens on port **8000**.

### 3. Visit in Your Browser

Open [http://localhost:8000/](http://localhost:8000/)  
You'll see a file selector and a text editor for direct, in-browser file editing.

---

## 🛠️ How it Works

- Select a file from the dropdown.
- Edit its contents in the textarea.
- Click **Save** to update the file on the server.
- Changes are immediately available to everyone visiting the site.

---

## ⚠️ Security Notice

**This project is NOT secure.**  
There is no authentication, authorization, or sandboxing.  
Anyone who can access the server can read, modify, or delete all files.  
**Do NOT use in production or for sensitive files.**

---

## 🌍 Use Cases

- Classroom demos of live web editing
- Collaborative coding
- Hackable digital bulletin board
- Temporary "public notepad" or code sharing

---

## 📖 API Overview

| Method | Path    | Description               |
| ------ | ------- | ------------------------- |
| GET    | `/file` | Fetch a file or directory |
| PUT    | `/file` | Save/overwrite a file     |

- All paths are relative to the project root.
- File uploads and edits are raw text.
- The web interface currently only supports GET and PUT.

---

## 🙏 Credits & Inspirations

- Inspired by [Eloquent JavaScript's file server chapter](https://eloquentjavascript.net/20_node.html)
- Fonts: [Fira Code](https://github.com/tonsky/FiraCode)

---

## License

MIT License
