# Security Vision 3D

> A 3D network visualisation of biometric AI data collected through the Security Vision project.

## Quickstart

1. Go to project: `cd ./security-vision-3d`
2. Initialise the project: `yarn`
3. Bundle the code (this builds the `dist/bundle.js` file):
   1. If you want to build the project, run `yarn build`.
   2. If you want to develop the project, running `yarn watch` will have changes to the code alter the view. 
4. You can view the project by opening `index.html` in your browser.

## Update data

This repository has a sister repository, securityvisionr, for getting and cleaning the data from the Security Vision database. It creates a file, `wiki.json` that should be placed in `security-vision-3d/data`.
