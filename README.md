# Hioso NMS OLT

Desktop Electron application for monitoring and managing OLT devices with a React frontend.

## Requirements

- Node.js
- npm

## Install

From the project directory:

```bash
npm install
```

## Run in development

### Windows

Use the included batch file from the project root:

```bat
start-project.bat
```

This script:

- installs dependencies when `node_modules` is missing
- starts the React development server without opening the browser
- waits for `http://localhost:3000`
- starts Electron in development mode

### Manual command

If your shell supports the npm script environment syntax, you can also run:

```bash
npm run electron:dev
```

## Build

```bash
npm run build
```

## Electron packaging

```bash
npm run electron:build
```

Platform-specific builds:

```bash
npm run electron:build:win
npm run electron:build:mac
npm run electron:build:linux
```
