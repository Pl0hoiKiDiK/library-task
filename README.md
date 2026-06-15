# The Library — Book Catalog

A simple book catalog web application built with vanilla HTML, CSS, and JavaScript (no frameworks).
Uses the [Open Library API](https://openlibrary.org/) to search for books.

## Task

Full task description: https://drive.google.com/file/d/1RBRcuH-_oAvtjem5Xs0c4NXZ8I38aYyH/view?usp=sharing

## How to Run the App

### Prerequisites
- Node.js v18+
- npm v9+

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

Output will be in the `dist/` folder:
- `dist/index.html` — main HTML file
- `dist/index.js` — bundled JavaScript
- `dist/assets/` — icons and styles

### Preview Production Build

```bash
npm run preview
```

## Features

- Search books by title, author, or keyword via Open Library API
- Book cards with cover image, title, author, and publication year
- Placeholder for books without a cover
- Add / remove books to Favorites
- Favorites are saved in localStorage and restored on page reload
- Loading, error, empty input, and no results states
- Author filter (client-side, no extra API calls)
- Live search with debounce (300ms)
- Light / dark theme switcher with localStorage persistence
- Responsive layout — 5 columns on desktop, 2 on mobile

## Project Structure

```
book-catalog/
├── index.html
├── vite.config.js
├── package.json
├── public/
│ └── favicon.svg
└── src/
├── main.js
├── api/
│ └── openLibrary.js
├── components/
│ ├── bookCard.js
│ ├── favorites.js
│ └── loader.js
├── styles/
│ └── main.css
└── utils/
├── debounce.js
├── storage.js
└── theme.js
```

## API

- Search: `https://openlibrary.org/search.json?q={query}`
- Covers: `https://covers.openlibrary.org/b/id/{cover_id}-M.jpg`