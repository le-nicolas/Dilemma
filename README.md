# Dilemma Studio

Dilemma Studio is a browser-based decision playground for balancing:

- `Cost`
- `Risk`
- `Performance`

It replaces the old Python plotting script with a fully interactive static app that runs anywhere (including GitHub Pages).

## Features

- Live trade-off sliders that always sum to `100%`
- Interactive ternary-style chart with a moving decision point
- Preset scenarios plus random scenario generation
- Instant analysis:
  - dominant driver
  - balance score
  - strategy guidance

## Run Locally

No build step is required.

1. Clone the repo
2. Open `index.html` in a browser

Optional local server:

```bash
# Node (if installed)
npx serve .
```

## Publish on GitHub Pages

1. Push to `main`
2. In GitHub repo settings:
   - open `Pages`
   - source: `Deploy from a branch`
   - branch: `main` and `/ (root)`
3. Save and wait for the Pages URL to appear

## Stack

- HTML
- CSS
- Vanilla JavaScript
