# Installation

Make sure you have node > 10, latest npm, and latest firebase-tools installed
globally.

To install:

```
source tools/use
configure-project
```

To run locally:

```
firebase serve
```

To build, be in the root dir and:

```
make all
```

Current deployed version is on [firebase](https://forced-prestige.firebaseapp.com/)

# Notes

As of 2019-06-27 I have a main loop that updates the game model and then updates a view. Currently just has a Worker that follows a path, improving tiles proportional to how long is spent on them.  Workers move faster the more the tiles are improved.

The view shows tiles -10, -10 through 10, 10 on a static 500x500 px canvas.

To do:

Render the worker's current position
Render the worker's path
Click and drag to set a worker's path
???
Profit
