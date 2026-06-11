# Sinking Ships

Sinking Ships is a small, web-based grid game inspired by the Legend of Zelda: Wind Waker mini-game and classic Battleship mechanics. Hideous sea monsters and enemy ships lurk below — use your radar to find and sink them before your turns run out.

How to play
- Choose a difficulty (Easy / Medium / Hard) or use Custom to set the number of rows, columns, and ships.
- Click a grid cell to fire a shot. Hits show a yellow star (✹); misses show a blue X.
- Sink all ships before your guess counter (the bomb) reaches zero to win.

Difficulty summary
- Easy: 6×6 grid, ships length 3 (one ship by default).
- Medium: 8×8 grid, ships length 3–4.
- Hard: 10×10 grid, ships length 3–5.

Run locally
1. Open a terminal in the project folder (where `index.html` is located).
2. Start a simple server, for example with Python:

```bash
py -m http.server 8000
# or
python -m http.server 8000
```

3. Open `http://localhost:8000` in your browser.

Files of interest
- `index.html` — game page
- `javascript.js` — game logic and grid handling
- `splooshstyles.css` — layout and styling

Assets: images and sounds are in the `images/` and `sounds/` folders and are used by the game.
