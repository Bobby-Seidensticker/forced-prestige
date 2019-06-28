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

# Notes

As of 2019-06-27 I have a main loop that updates the game model and then updates a view. Currently just has a Worker that follows a path, improving tiles proportional to how long is spent on them.  Workers move faster the more the tiles are improved.

The view shows tiles -10, -10 through 10, 10 on a static 500x500 px canvas.

To do:

Click and drag to set a worker's path
???
Profit
