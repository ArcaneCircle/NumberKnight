# Number Knight

Have you ever seen this fake ad for a mobile game? You know, the one with a small knight in his tower, and you have to kill monsters from other towers.
"Number Knight" is a full complete game based on this fake ad!

Kill monsters and absorb their power to become more and more powerful!
But beware, you'll soon discover fire, water or plant monsters, and your attacks will have to be a little more tactical...

**NOTE:** This is a port to WebXDC of https://github.com/adrien-gueret/number_knight

## Developing

### Installing Dependencies

After cloning this repo, install dependecies:

```
pnpm i
```

### Checking the code format

```
pnpm check
```

### Testing the app in the browser

To test your work in your browser (with hot reloading!) while developing:

```
pnpm dev-mini
# Alternatively to test in a more advanced WebXDC emulator:
pnpm dev
```

### Building

To package the WebXDC file:

```
pnpm build
```

The resulting optimized `.xdc` file is saved in `dist-xdc/` folder.

### Releasing

To automatically build and create a new GitHub release with the `.xdc` file:

```
git tag -a v1.0.1
git push origin v1.0.1
```
