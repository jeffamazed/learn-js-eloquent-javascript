# SkillShare Server

A simple Node.js web application for sharing and commenting on talks.

## Features

- Add, view, and delete talks
- Comment on talks
- Real-time updates (long-polling)
- Simple in-browser interface

## Usage

1. Install dependencies:
   ```
   npm install
   ```
2. Start the server:
   ```
   node skillsharing_server.js
   ```
3. Open your browser at [http://localhost:8000](http://localhost:8000)

## Project Structure

- `skillsharing_server.js` – Main server and frontend code
- `public/` – Static frontend assets

---

Inspired by [Eloquent JavaScript](https://eloquentjavascript.net/).
