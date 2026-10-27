# NetDino

**[Play NetDino](https://netdino.vercel.app)**

NetDino is a browser-based endless runner inspired by the classic offline dinosaur game. Choose a character, jump over cactus groups, duck under low-flying birds, and keep going as the pace picks up.

## Features

- 16 selectable runners, including animals, sports figures, public figures, and an astronaut
- Original colorful vector figurines shown in the character picker and on the track
- Random cactus groups and flying birds at different heights
- Increasing game speed and a saved best score
- Keyboard and touch controls
- Optional sound
- No build step or external game libraries required

## Play

Open `index.html` in a modern browser, or serve the folder locally:

```sh
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## Controls

| Action | Desktop | Mobile |
| --- | --- | --- |
| Start or jump | Space or ↑ | Tap the track or **Jump** |
| Duck | Hold ↓ | Hold **Duck** |
| Choose a runner | Select the runner menu | Tap the runner menu |

The **mute** button toggles sound. Your best score is stored in the browser on your device.

## Project files

- `index.html` — game page and controls
- `style.css` — layout, responsive styles, and touch controls
- `game.js` — characters, obstacles, collision handling, score, and game loop

## Character lineup

Dino, Rat, Monkey, Lion, Cockroach, Lizard, Snake, Human, Panda, Fox, Virat Kohli, MS Dhoni, Narendra Modi, Lionel Messi, Taylor Swift, and Astronaut.
