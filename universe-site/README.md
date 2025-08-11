# Cosmic Atlas — The Universe & Its Planets

A small, static, responsive website to explore planets of our Solar System. Includes search, type filters, a details modal, and a light/dark theme toggle.

## Quick start

- Open `index.html` directly in your browser, or serve locally:

```sh
# From the project directory
python3 -m http.server 8000
# Then open http://localhost:8000
```

## Features

- Responsive grid of planet cards
- Search box and filter chips (Terrestrial, Gas giant, Ice giant, Dwarf)
- Details modal with key facts
- Light/Dark theme with preference saved
- No external build or dependencies

## Edit content

- Planets are defined in `app.js` in the `planets` array. Add or change properties like `name`, `type`, `radiusKm`, `distanceAu`, etc.
- Colors for each planet icon are defined in `colorMap` in `app.js`.

## Structure

```
universe-site/
  index.html
  styles.css
  app.js
  README.md
```

## License

MIT