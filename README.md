# path-measurement-tool

A program to click a polygon on the desktop, enter a scale, and save the calculated distances.

![screenshot](./screenshot.jpg)

Shortcuts:

|Key|Function
|---|---|
|Z|undo|
|space|new path|
|Ctrl + N|reset|

## Development

Install nodejs.

Run in shell:

```sh
npm install
npx electron .
```

To distribute, run `npx create-electron-app dist`.
