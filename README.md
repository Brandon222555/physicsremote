# PhysicsRemote

> Under-the-radar remote jobs for physicists who code.

A static site that lists curated, high-pay, fully-remote roles for physics grads with
ML/data skills. Hand-picked seed, refreshed every 2 weeks.

Stack: plain HTML + CSS + vanilla JS + a single `jobs.json`. No build step, no framework,
no backend. Deploys in under 5 minutes on GitHub Pages.

---

## Running locally

Because the page uses `fetch()` to load `jobs.json`, you need a local server:

```bash
# Python
python3 -m http.server 8000
# or Node
npx serve .
```

Then visit http://localhost:8000.

---

## How to add a role manually

Edit `assets/jobs.json`. Add an object to the `jobs` array:

```json
{
  "co": "Example Labs",
  "role": "ML Research Engineer",
  "cat": "Physics-native AI",
  "min": 160,
  "max": 240,
  "tags": ["remote-US", "simulation"],
  "fit": 5,
  "why": "One-sentence reason a physics grad is a good fit.",
  "url": "https://example.com/careers"
}
```

Then bump `lastUpdated` to today's date. Commit and push.

---

## File structure

```
physicsremote/
├── index.html
├── about.html
├── submit.html
├── 404.html
├── assets/
│   ├── styles.css
│   ├── app.js
│   ├── jobs.json
│   └── favicon.svg
├── robots.txt
├── sitemap.xml
├── .nojekyll
├── LICENSE
└── README.md
```

---

## License

MIT
