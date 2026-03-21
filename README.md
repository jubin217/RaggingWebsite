# RaggingGuard Web Dashboard

This is the real-time, responsive web application for monitoring the RaggingGuard AI System. It is built using **React, Vite, Firebase, and Framer Motion**.

## How to Clone and Run on another Computer

Because this is a JavaScript/Node.js project, it **does not use a `requirements.txt` file**. Instead, all of its dependencies are strictly defined in the `package.json` file (which is already in this folder).

To run this dashboard on any other computer after cloning from GitHub, simply follow these two steps:

### 1. Install Dependencies
Make sure you have [Node.js](https://nodejs.org/) installed on that computer. Then open a terminal inside this `web_dashboard` folder and run:
```bash
npm install
```
*(This is the exact JavaScript equivalent of running `pip install -r requirements.txt`. It will read your `package.json` file and install React, Firebase, Chart.js, etc.)*

### 2. Start the Deployment Server
Once everything is installed, launch the web app by running:
```bash
npm run dev
```
It will give you a local URL (e.g. `http://localhost:5173`) that you can open in your browser or phone!
