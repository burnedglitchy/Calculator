# Clay Mechanical Calculator

A polished React calculator with a tactile clay-inspired interface, spring-animated 3D keycaps, keyboard support, and a recessed LCD-style display.

The project focuses on making a familiar utility feel physical and delightful while keeping the implementation small, readable, and easy to extend.

## Key Features

- **Tactile mechanical UI** with domed keycaps, animated side-wall collapse, responsive shadows, and a warm clay housing.
- **Physics-based key feedback** powered by Framer Motion springs, including visual press/release states for both pointer and keyboard input.
- **LCD-style display** with ghost digits, animated value refreshes, operator indication, and error coloring.
- **Full calculator behavior** for digits, decimals, addition, subtraction, multiplication, division, percent, sign toggle, clear, backspace, and repeated equals.
- **Keyboard controls** for fast desktop use: number keys, operators, `Enter`, `=`, `Escape`, `Backspace`, decimal, and percent.
- **Reducer-driven calculator logic** with a two-operand state machine and no `eval()` or dynamic code execution.
- **Responsive layout** that keeps the calculator compact and usable across desktop and mobile viewports.
- **Motion accessibility consideration** through reduced-motion handling for the key spring configuration.

## Tech Stack

- **React 19** for component-based UI
- **Vite** for fast local development and production builds
- **Framer Motion** for spring physics, animated transforms, and display transitions
- **ESLint** with React Hooks and React Refresh rules
- **CSS custom properties** for shared visual tokens and responsive tuning

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Usage

Use the calculator with either the on-screen keys or the keyboard.

| Input | Action |
| --- | --- |
| `0`-`9` | Enter digits |
| `.` | Decimal |
| `+`, `-`, `*`, `/` | Operators |
| `Enter` or `=` | Calculate |
| `Escape` | Clear |
| `Backspace` | Delete last digit |
| `%` | Percent |

## Project Structure

```text
.
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Calculator.jsx
│   │   ├── Display.jsx
│   │   ├── DisplayBezel.jsx
│   │   ├── Key.jsx
│   │   └── Keypad.jsx
│   ├── constants/
│   │   └── keymap.js
│   ├── hooks/
│   │   ├── useCalculator.js
│   │   └── useKeyboardInput.js
│   ├── styles/
│   │   └── globals.css
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

## Architecture

The app is intentionally split into focused pieces:

- `Calculator.jsx` wires state, display, keypad, and keyboard-driven visual feedback.
- `useCalculator.js` owns the calculator state machine, operation handling, formatting, repeated equals behavior, and error recovery.
- `useKeyboardInput.js` maps physical keyboard events to the same action strings used by the on-screen keypad.
- `keymap.js` defines the visible keypad layout, button variants, actions, and grid spans in one place.
- `Key.jsx` contains the tactile motion system: press intent, spring smoothing, keycap compression, wall-height animation, and shadow composition.

This structure keeps the visual layer and calculator logic separate while allowing every input path to share the same behavior.

## UI/UX Details

The interface is built to feel like a small physical object rather than a flat web form. The housing uses layered shadows for depth, keys compress with spring-based motion, and the display uses a dark recessed panel with dim ghost digits to echo real calculator screens.

Keyboard input also triggers the same key animation as pointer input, so the UI remains visually connected even when operated from the keyboard.

## Screenshots or Demo

No screenshot is included in the repository yet. After running `npm run dev`, open the local Vite URL in a browser to view the interactive calculator.

## Development Notes

- Calculator operations are implemented with explicit parsing and arithmetic logic instead of `eval()`.
- Results are capped for the compact 10-character display and switch to exponential formatting for longer values.
- Division by zero and non-finite results enter an error state displayed as `E`; `AC` clears the error.
- The visual key animation uses Framer Motion `MotionValue` transforms instead of CSS-only shadow animation for smoother coordinated movement.

## Deployment / Hosting

This is a standard Vite application and can be hosted on static platforms such as Vercel, Netlify, GitHub Pages, Cloudflare Pages, or any static file server.

For a production build, run:

```bash
npm run build
```

The generated `dist/` directory contains the deployable static assets.

## Contributing

Contributions are welcome. A good workflow is:

1. Fork or branch from the repository.
2. Install dependencies with `npm install`.
3. Make focused changes.
4. Run linting before opening a pull request:

```bash
npm run lint
```

## License

No license file is currently included. Add a license before distributing or reusing the project publicly.
