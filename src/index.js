// style
import "./style.css";
import "./dat-gui.css";

// import * as three from "three";
import ForceGraph3D from "3d-force-graph";
import {
  TextureLoader,
  RepeatWrapping,
  EquirectangularReflectionMapping,
  Mesh,
  SphereGeometry,
  IcosahedronGeometry,
  MeshPhysicalMaterial,
  DoubleSide,
  BoxGeometry,
  Vector2,
  Vector3,
  LineBasicMaterial,
  MeshBasicMaterial,
  Object3D,
  BufferGeometry,
  Line,
  ShapeGeometry,
  Group,
} from "three";
import SpriteText from "three-spritetext";
import { assignNodeColors } from "./assignNodeColors.js";

import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";

import * as dat from "dat.gui";

import forceLimit from "d3-force-limit";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// This function resizes the graph to match the size of the container element.
function resizeGraph() {
  // Check if the graph exists.
  if (Graph) {
    // Get the height and width of the container element.
    var height = document.getElementById("graph-3d").clientHeight;
    var width = document.getElementById("graph-3d").clientWidth;

    // Set the width and height of the graph.
    Graph.width(width);
    Graph.height(height);

    // Resize the graph's controls to match the new size.
    Graph.controls().handleResize();
  }
}

// Call the resizeGraph function whenever the window is resized.
window.onresize = resizeGraph;

// This function resets the graph's camera position and orientation.
function resetGraphView() {
  // Set the camera position to look at the center of the graph.
  Graph.cameraPosition({ x: 0, y: 0, z: 1500 });

  // Set the camera orientation to be upright.
  Graph.camera().up = new Vector3(0, 1, 0);
}

// The code below loads and sets properties for several textures used in the app. It also defines two background colors for the scene, one for light mode and one for dark mode.

// Load an HDR equirectangular texture and set it to be used as a reflection map.
const hdrEquirect = new RGBELoader().load(
  "./src/empty_warehouse_01_1k.hdr",
  () => {
    hdrEquirect.mapping = EquirectangularReflectionMapping;
  }
);

// Load a normal map texture and set its properties.
const textureLoader = new TextureLoader();
const normalMapTexture = textureLoader.load("./lib/normal.jpg");
normalMapTexture.wrapS = RepeatWrapping;
normalMapTexture.wrapT = RepeatWrapping;
normalMapTexture.repeat.set(1, 1);

// Load and set properties for textures to be used for the blackhole material.
const baseColorLoader = new TextureLoader();
const baseColorTexture = baseColorLoader.load(
  "./src/organic-textures/Abstract_Organic_003_basecolor.jpg"
);
baseColorTexture.wrapS = RepeatWrapping;
baseColorTexture.wrapT = RepeatWrapping;
baseColorTexture.repeat.set(3, 3);

const heightLoader = new TextureLoader();
const heightTexture = heightLoader.load(
  "./src/organic-textures/Abstract_Organic_003_height.png"
);
heightTexture.wrapS = RepeatWrapping;
heightTexture.wrapT = RepeatWrapping;
heightTexture.repeat.set(3, 3);

const normalLoader = new TextureLoader();
const normalTexture = normalLoader.load(
  "./src/organic-textures/Abstract_Organic_003_normal.png"
);
normalTexture.wrapS = RepeatWrapping;
normalTexture.wrapT = RepeatWrapping;
normalTexture.repeat.set(3, 3);

const roughnessLoader = new TextureLoader();
const roughnessTexture = roughnessLoader.load(
  "./src/organic-textures/Scene_-_Root_metallicRoughness.png"
);
// roughnessTexture.wrapS = RepeatWrapping;
// roughnessTexture.wrapT = RepeatWrapping;
roughnessTexture.repeat.set(3, 3);

// Define two background colors for the scene, one for light mode and one for dark mode.
let backgroundDarkMode = "#444444"; //   #0000ff  "#171717"
let backgroundLightMode = "#ffffff";

// Create a 3D force graph using ForceGraph3D library
// Select the HTML element with ID "graph-3d" as the target for the graph
const Graph = ForceGraph3D()(document.getElementById("graph-3d"))

  // Set the ID property of each node to be "id"
  .nodeId("id")

  // Set the source of each link to be "from"
  .linkSource("from")

  // Set the target of each link to be "to"
  .linkTarget("to")

  // Set the label of each node to be "name"
  .nodeLabel("name")

  // Set the size of each node based on the "size" property
  // of the node using a power function
  .nodeVal((n) => {
    return 1.4 ** n.size;
  })

  // Define a custom 3D object for each node
  .nodeThreeObject((n) => {
    // Create a new Three.js Group object
    const group = new Group();

    // Create a Three.js Mesh object for the node
    // The mesh will be a sphere or an icosahedron depending on the node's category
    const ball = new Mesh(
      n.category == "institution" || n.category == "person"
        ? new SphereGeometry(1 + n.size, 10)
        : new IcosahedronGeometry(1 + n.size, 10),

      // Set the material of the mesh to be a physical material
      // The color of the material will be assigned based on the node's category and institution type
      new MeshPhysicalMaterial({
        color: n.unknown
          ? 0x171717
          : assignNodeColors(n.category, n.institution_type),
      })
    );
    // const sprite = new SpriteText(
    //   Math.round(`${n.latitude}`) + "\n" + Math.round(`${n.longitude}`),
    //   16,
    //   "black"
    // );

    // Create a SpriteText object to display the node's name
    const sprite = new SpriteText(n.size > 3.5 ? `${n.name}` : "", 16, "black");

    // Add the mesh and the SpriteText to the group
    group.add(ball);
    group.add(sprite.translateZ(27));

    // Return the group as the 3D object for the node
    return group;
  })
  // .nodeThreeObject((node) => {
  //   const nodeEl = document.createElement("div");
  //   nodeEl.textContent = node.id;
  //   nodeEl.style.color = node.color;
  //   nodeEl.className = "node-label";
  //   return new CSS3DObject(nodeEl);
  // })
  // .nodeThreeObject((n) => {
  //   const sprite = new SpriteText(`${n.name}`);
  //   return sprite;
  // })
  // .nodeThreeObjectExtend(true)

  // Set the opacity of each node to be 0.7
  .nodeOpacity(0.7)

  // Automatically assign colors to each node based on its category
  .nodeAutoColorBy("category")

  // Set the label of each link to be "edge_type"
  .linkLabel("edge_type")

  // Automatically assign colors to each link based on its edge type
  .linkAutoColorBy("edge_type")

  // Set the width of each link based on its "edge_importance_normalised" property
  // Add 0.4 to the width for visual clarity
  .linkWidth((e) => e.edge_importance_normalised + 0.4)

  // Set the curvature of each link to be 0.2
  .linkCurvature(0.2)

  // Set the opacity of each link to be 0.5
  .linkOpacity(0.5)
  // .linkCurvature(({ id }) => Math.random() * 0.7)
  // .linkCurveRotation(({ id }) => Math.random() * 2 * Math.PI)
  // .linkResolution(2)

  // Set the background color of the graph to be "backgroundDarkMode"
  .backgroundColor(backgroundDarkMode)

  // Disable node dragging
  .enableNodeDrag(false)

  // Set up an event listener for when a node is clicked
  .onNodeClick((node) => {
    // Calculate the distance to the node
    const distance = 40;

    // Declare a variable "distRatio" and set it to 1 plus the distance divided by the hypotenuse of the node's position in 3D space.
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

    // Call the "cameraPosition" method of the Graph object with three arguments:
    // 1. An object representing the new position of the camera in 3D space. This object has three properties: x, y, and z. The values of these properties are based on the node's position and the "distRatio" value.
    // 2. The "node" parameter, which the camera will look at.
    // 3. The duration of the transition animation in milliseconds (set to 3000).
    Graph.cameraPosition(
      {
        // new position
        x: node.x * distRatio,
        y: node.y * distRatio,
        z: node.z * distRatio,
      },
      node, // lookAt ({ x, y, z })
      3000 // ms transition duration
    );
  });

// initialise in 3d mode
// This code block initializes the graph visualization in 3D mode and adds a tick listener to the Graph object that shows the 3D mode.

Graph.onEngineTick(() => {
  show3dMode();
  Graph.onEngineTick(() => {});
});

// // get data
// This code block retrieves data from a JSON file using the fetch API and assigns it to the constant variable gData. The data is in the form of a JSON object.

const gData = fetch("./data/wiki.json").then((r) => r.json());

// Graph.graphData(data) is then called on the JSON data to add it to the Graph object.

gData.then((data) => Graph.graphData(data));

// Passes
// These code blocks create and add post-processing passes to the Graph object.

// The FilmPass adds film grain and scanlines to the visualization.
// const filmPass = new FilmPass(
// 0.2, // noise intensity
// 0, // scanline intensity
// 0, // scanline count
// false // grayscale
// );
// Graph.postProcessingComposer().addPass(filmPass);

// The BokehPass adds a depth-of-field effect to the visualization.
// var bokehPass = new BokehPass(Graph.scene(), Graph.camera(), {
// focus: 100,
// aperture: 0.00001,
// maxblur: 0.01,
// width: 1500,
// height: 1200,
// });
// Graph.postProcessingComposer().addPass(bokehPass);

// Add event listener for when a key is pressed
document.addEventListener("keydown", onDocumentKeyDown, false);

// Function to handle keydown events
function onDocumentKeyDown(event) {
  var keyCode = event.which;

  // If the q key is pressed, refit the view
  if (keyCode == 81) {
    Graph.zoomToFit(
      3000 // ms transition duration
    );
  }
  // If the r key is pressed, set the Z position
  else if (keyCode == 82) {
    setZPosition();
  }
  // If the s key is pressed, filter nodes that have an unknown value
  else if (keyCode == 83) {
    Graph.graphData(gData.nodes.filter((n) => n.unknown));
  }
}

// // unknown center
// const blob = new GLTFLoader();
// blob.load(
//   "./src/scene.gltf",
//   function (object) {
//     // object.traverse((child) => {
//     //   if (child.material)
//     //     child.material = new MeshPhysicalMaterial({
//     //       color: 0x777777,
//     //       roughness: 0.2,
//     //       transmission: 1,
//     //       thickness: 1,
//     //       reflectivity: 0.1,
//     //       envMap: hdrEquirect,
//     //       envMapIntensity: 0.5,
//     //       // normalScale: new THREE.Vector2(1),
//     //       // normalMap: normalMapTexture,
//     //       // clearcoatNormalMap: normalMapTexture,
//     //       // clearcoatNormalScale: new THREE.Vector2(1),
//     //     });
//     // });

//     scene.add(object.scene);
//   },
//   undefined,
//   function (error) {
//     console.error(error);
//   }
// );

// const blackholeGeometry = new SphereGeometry(80, 3200, 1600);
// const blackholeMaterial = new MeshPhysicalMaterial({
//   roughness: 0.7,
//   // transmission: 0.5,
//   // thickness: 0.1, // Add refraction!
//   reflectivity: 0.2,
//   clearcoatRoughness: 1,
//   metalness: 0,
//   // envMap: hdrEquirect,
//   // envMapIntensity: 0.2,
//   // alphaMap: normalMapTexture,
//   map: baseColorTexture,
//   normalMap: normalTexture,
//   normalScale: new Vector2(1),
//   roughnessMap: roughnessTexture,
//   // clearcoatNormalMap: normalMapTexture,
//   // clearcoatNormalScale: new Vector2(100),
//   bumpMap: roughnessTexture,
//   bumpScale: new Vector2(100),
//   displacementMap: heightTexture,
//   displacementScale: 10,
// });

// Create a 3D black hole object with a mesh geometry and a physical material
const blackholeGeometry = new IcosahedronGeometry(130, 0);
const blackholeMaterial = new MeshPhysicalMaterial({
  roughness: 0.2,
  transmission: 1,
  thickness: 0.1, // Add refraction!
  envMap: hdrEquirect,
  envMapIntensity: 0.5,
  // normalScale: new THREE.Vector2(0.1),
  // normalMap: normalMapTexture,
  // clearcoatNormalMap: normalMapTexture,
  // clearcoatNormalScale: new THREE.Vector2(1),
});
const blackhole = new Mesh(blackholeGeometry, blackholeMaterial);
Graph.scene().add(blackhole);

// Create a plane object with a mesh geometry and a physical material, representing a map
const mercatorMapTexture = textureLoader.load("./lib/mercator-strange.jpg");
// mercatorMapTexture.wrapS = THREE.RepeatWrapping;
// mercatorMapTexture.wrapT = THREE.RepeatWrapping;
const mapGeometry = new BoxGeometry(2000, 1576, 20);
const mapMaterial = new MeshPhysicalMaterial({
  color: 0x777777,
  roughness: 0.6,
  transmission: 1,
  thickness: 1,
  reflectivity: 0.1,
  envMap: hdrEquirect,
  // envMapIntensity: 0.5,
  // envMapIntensity: 0.5,
  normalScale: new Vector2(1),
  normalMap: mercatorMapTexture,
  clearcoatNormalMap: mercatorMapTexture,
  clearcoatNormalScale: new Vector2(1),
});
const map = new Mesh(mapGeometry, mapMaterial);
// map.position.set(0, 0, -40);
Graph.scene().add(map);
// Set the map to be initially invisible
map.visible = false;

// gui

// The following function, eachController, iterates through all controllers and applies a given function fnc to them
// It is used to set the title attribute of each controller to the given value
/* dat.GUI copies the prototype of superclass Controller to all other controllers, so it is not enough to add it only to
the super class as the reference is not maintained */
var eachController = function (fnc) {
  for (var controllerName in dat.controllers) {
    if (dat.controllers.hasOwnProperty(controllerName)) {
      fnc(dat.controllers[controllerName]);
    }
  }
};

// The following function, setTitle, sets the title attribute of the root DOM element (__li) of a controller to the given value
var setTitle = function (v) {
  // __li is the root dom element of each controller
  if (v) {
    this.__li.setAttribute("title", v);
  } else {
    this.__li.removeAttribute("title");
  }
  return this;
};

// The following loop sets the title function of all controllers to setTitle using eachController
eachController(function (controller) {
  if (!controller.prototype.hasOwnProperty("title")) {
    controller.prototype.title = setTitle;
  }
});

// A new dat.GUI instance is created and stored in the gui variable
var gui = new dat.GUI();

// An object called parameters is created with some initial values
var parameters = {
  mode: "3d",
  filterNodes: "none",
  rotate: false,
  resetView: resetGraphView,
  darkMode: true,
};

// A new GUI controller called mode is created with the initial value of "3d" and options "3D" and "Geo"
// It is given the name "Mode" and the title "There are three modes: 3D shows a ball of unknowns at the center and Geo shows the values geolocated."
var mode = gui
  .add(parameters, "mode", { "3D": "3d", Geo: "geo" })
  .name("Mode")
  .title(
    "There are three modes: 3D shows a ball of unknowns at the center and Geo shows the values geolocated."
  );

// A new GUI controller called filterNodes is created with the initial value of "none" and options "dataset", "deployment", "technology", and "institution"
// It is given the name "Filter nodes" and the title "Show only nodes of this type."
var filterNodes = gui
  .add(parameters, "filterNodes", [
    "none",
    "dataset",
    "deployment",
    "technology",
    "institution",
  ])
  .name("Filter nodes")
  .title("Show only nodes of this type.");

// A new GUI controller called rotate is created with the initial value of false
// It is given the name "Auto-rotate" and the title "Automatically rotates the camera around the graph."
var rotate = gui
  .add(parameters, "rotate")
  .name("Auto-rotate")
  .title("Automatically rotates the camera around the graph.");

// A new GUI controller called resetView is created with the initial value of resetGraphView
// It is given the name "Reset View" and the title "Returns camera to original view."
var resetView = gui
  .add(parameters, "resetView")
  .name("Reset View")
  .title("Returns camera to original view.");
var darkMode = gui
  .add(parameters, "darkMode")
  .name("Dark Mode")
  .title("Uses dark background.");

// mode
// This section of code contains functions and variables related to the 3D mode of the application.

// The radius of the unknown sphere.
const unknownSphereRadius = 100;

// The radius of the known sphere. Set to infinity.
const knownSphereRadius = Infinity;

/**

Returns the constrained position of the node to a sphere based on its radius and coordinates.
@param {number} radius - The radius of the sphere.
@param {number} coord_1 - The first coordinate of the node.
@param {number} coord_2 - The second coordinate of the node.
@returns {number} - The constrained position of the node on the sphere.
*/
function constrainToSphere(radius, coord_1, coord_2) {
  return Math.max(0, Math.sqrt(radius ** 2 - coord_1 ** 2 - coord_2 ** 2));
}
/**


Returns the position of the node on the sphere based on its unknown property and coordinates.
@param {boolean} unknown - Whether the node is unknown or not.
@param {number} coord_1 - The first coordinate of the node.
@param {number} coord_2 - The second coordinate of the node.
@returns {number} - The position of the node on the sphere.
*/
function nodePosition(unknown, coord_1, coord_2) {
  return unknown
    ? constrainToSphere(unknownSphereRadius, coord_1, coord_2)
    : constrainToSphere(knownSphereRadius, coord_1, coord_2);
}

// This function shows the 3D mode of the graph.
function show3dMode() {
  // Filter out nodes that don't have a longitude value.
  Graph.graphData()
    .nodes.filter((n) => n.longitude)
    // Reset the fixed positions of the remaining nodes.
    .forEach((n) => {
      n.fx = null;
      n.fy = null;
      n.fz = null;
    });

  // Apply the force simulation with limits based on node position.
  Graph.d3Force(
    "limit",
    forceLimit()
      // Set the radius of the limit force to the size of the node.
      .radius((node) => node.size)
      // .x0((n) => (n.unknown ? -50 : -10000))
      // .x1((n) => (n.unknown ? 50 : 10000))
      // .y0((n) => (n.unknown ? -50 : -10000))
      // .y1((n) => (n.unknown ? 50 : 10000))
      // .z0((n) => (n.unknown ? -50 : -10000))
      // .z1((n) => (n.unknown ? 50 : 10000))
      // Set the limits for the x, y, and z coordinates of the nodes.
      .x0((n) => -nodePosition(n.unknown, n.y, n.z))
      .x1((n) => nodePosition(n.unknown, n.y, n.z))
      .y0((n) => -nodePosition(n.unknown, n.x, n.z))
      .y1((n) => nodePosition(n.unknown, n.x, n.z))
      .z0((n) => -nodePosition(n.unknown, n.x, n.y))
      .z1((n) => nodePosition(n.unknown, n.x, n.y))
      // Set the cushion width and strength of the limit force.
      .cushionWidth(0)
      .cushionStrength(0.01)
  );

  // Randomize the positions of all nodes.
  Graph.graphData().nodes.forEach((n) => {
    n.x = Math.random() * 140 - 70;
    n.y = Math.random() * 140 - 70;
    n.z = Math.random() * 140 - 70;
  });

  // Show the blackhole and hide the map.
  blackhole.visible = true;
  map.visible = false;
}

// The width and height of the map.
const mapWidth = 2000;
const mapHeight = 1570;

// Convert a longitude value to a target screen position.
// Source: https://stackoverflow.com/a/14457180/7589249
function longitudeToScreenTarget(longitude) {
  const x = longitude * (mapWidth / 360);
  return x;
}

// Convert a latitude value to a target screen position.
function latitudeToScreenTarget(latitude) {
  const latRad = (latitude * Math.PI) / 180; // Convert to radians.
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = mapHeight / 2 - (mapWidth * mercN) / (2 * Math.PI);
  return -y + 500;
}

// Constrain a coordinate to a circle with a given radius.
function constrainToCircle(radius, coord_2_actual, coord_2_target) {
  return Math.sqrt(radius ** 2 - (coord_2_actual - coord_2_target) ** 2);
}

// The radius of the circle used for constraining nodes.
const circleRadius = 30;

// This function is used to show the geo mode of the Graph
function showGeoMode() {
  // Setting the Graph's d3Force to "limit" and calling forceLimit() function to calculate its values
  Graph.d3Force("limit", forceLimit());
  // Graph.d3Force(
  //   "limit",
  // // an alternative way of calculating the values for forceLimit().
  //   forceLimit()
  //     .radius((node) => node.size)
  //     .x0((n) =>
  //       n.longitude == null
  //         ? -10000
  //         : longitudeToScreenTarget(n.longitude) -
  //           constrainToCircle(
  //             circleRadius,
  //             n.y,
  //             latitudeToScreenTarget(n.latitude)
  //           )
  //     )
  //     .x1((n) =>
  //       n.longitude == null
  //         ? 10000
  //         : longitudeToScreenTarget(n.longitude) +
  //           constrainToCircle(
  //             circleRadius,
  //             n.y,
  //             latitudeToScreenTarget(n.latitude)
  //           )
  //     )
  //     .y0((n) =>
  //       n.latitude == null
  //         ? -10000
  //         : latitudeToScreenTarget(n.latitude) -
  //           constrainToCircle(
  //             circleRadius,
  //             n.x,
  //             longitudeToScreenTarget(n.longitude)
  //           )
  //     )
  //     .y1((n) =>
  //       n.latitude == null
  //         ? 10000
  //         : latitudeToScreenTarget(n.latitude) +
  //           constrainToCircle(
  //             circleRadius,
  //             n.x,
  //             longitudeToScreenTarget(n.longitude)
  //           )
  //     )
  //     .x0((n) =>
  //       !isNaN(Math.round(n.longitude))
  //         ? longitudeToScreenTarget(n.longitude) - circleRadius
  //         : -Infinity
  //     )
  //     .x1((n) =>
  //       !isNaN(Math.round(n.longitude))
  //         ? longitudeToScreenTarget(n.longitude) + circleRadius
  //         : Infinity
  //     )
  //     .y0((n) =>
  //       !isNaN(Math.round(n.longitude))
  //         ? latitudeToScreenTarget(n.latitude) - circleRadius
  //         : -Infinity
  //     )
  //     .y1((n) =>
  //       !isNaN(Math.round(n.longitude))
  //         ? latitudeToScreenTarget(n.latitude) + circleRadius
  //         : Infinity
  //     )
  //     .z0((n) => (n.unknown ? -150 : 50))
  //     .z1((n) => (n.unknown ? -50 : 90))
  //     .cushionWidth(0)
  //   // .cushionStrength(100)
  // );
  // Graph.graphData().nodes.forEach((n) => {
  //   n.x = isNaN(n.longitude)
  //     ? 100 * Math.random() - 50
  //     : longitudeToScreenTarget(n.longitude);
  //   n.y = !isNaN(n.latitude)
  //     ? 100 * Math.random() - 50
  //     : latitudeToScreenTarget(n.latitude);
  //   n.z = n.unknown ? -100 : 70;
  // });
  // Filtering out nodes that don't have a longitude value and setting the x and y coordinates for the rest of the nodes
  Graph.graphData()
    .nodes.filter((n) => n.longitude)
    .forEach((n) => {
      n.fx = longitudeToScreenTarget(n.longitude);
      n.fy = latitudeToScreenTarget(n.latitude);
    });

  // Setting the fz value for all nodes in the Graph
  Graph.graphData().nodes.forEach((n) => {
    n.fz = n.unknown ? -100 : 70;
  });
  // // Setting the strength of the Graph's "charge" to -120
  // Graph.d3Force("charge").strength(-120);

  // Hiding the blackhole element and showing the map element
  blackhole.visible = false;
  map.visible = true;
}

// The code below runs when the 'mode' value is changed
mode.onChange((modeNewValue) => {
  // If the new value is '3d', call the 'show3dMode()' function
  if (modeNewValue == "3d") {
    show3dMode();
  }
  // Otherwise, if the new value is 'geo', call the 'showGeoMode()' function
  else if (modeNewValue == "geo") {
    showGeoMode();
  }
  // Call the 'resetGraphView()' function
  resetGraphView();
  // Call the 'Graph.d3ReheatSimulation()' function
  Graph.d3ReheatSimulation();
});

// The code below runs when the 'filterNodes' value is finished changing
filterNodes.onFinishChange((newFilterNodesValue) => {
  // Get the data from the 'gData' promise
  gData.then((data) => {
    // If the new value is 'none', display all nodes by calling the 'Graph.graphData()' function with 'data' as the argument
    if (newFilterNodesValue == "none") {
      Graph.graphData(data);
    }
    // Otherwise, filter the nodes based on the category and display only the filtered nodes and links by calling the 'Graph.graphData()' function with the filtered data as the argument
    else {
      const filteredNodes = data.nodes.filter(
        (n) => n.category == newFilterNodesValue
      );
      const filteredNodesIds = [];
      JSON.stringify(filteredNodes, (key, value) => {
        if (key === "id") filteredNodesIds.push(value);
        return value;
      });
      const filteredLinks = data.links.filter(
        (e) =>
          filteredNodesIds.includes(e.source.id) &
          filteredNodesIds.includes(e.target.id)
      );
      const filteredData = { nodes: filteredNodes, links: filteredLinks };
      console.log(filteredData);
      Graph.graphData(filteredData);
    }
  });
  // For each node in the current graph data, set a random value for 'x', 'y', and 'z'
  Graph.graphData().nodes.forEach((n) => {
    n.x = 100 * Math.random();
    n.y = 100 * Math.random();
    n.z = 100 * Math.random();
  });
});

// rotation
// Declaring the angle and distance variables for the camera's rotation.
let angle = 0;
const distance = 1000;

// Adding an event listener to the rotate control.
rotate.onChange(() => {
  // Setting an interval to call the cameraPosition() method to update the camera's position every 16ms.
  setInterval(() => {
    // If the rotate parameter is true,
    if (parameters.rotate) {
      // Set the camera's position based on the distance and angle variables.
      Graph.cameraPosition({
        x: distance * Math.sin(angle),
        z: distance * Math.cos(angle),
      });
      // Increment the angle by 1/300th of pi radians.
      angle += Math.PI / 300;
    }
  }, 16);
});

// darkMode
// Adding an event listener to the darkMode control.
darkMode.onChange((isDarkMode) => {
  // Setting the background color of the Graph based on whether isDarkMode is true or false.
  Graph.backgroundColor(isDarkMode ? backgroundDarkMode : backgroundLightMode);
});

// title text
// Creating a FontLoader instance to load the font file.
const loader = new FontLoader();

// Loading the font file and defining what to do once the font is loaded.
loader.load("./lib/helvetiker_regular.typeface.json", function (font) {
  // Defining the color of the text.
  const color = 0x006699;

  // Defining the LineBasicMaterial and MeshBasicMaterial for the text.
  const matDark = new LineBasicMaterial({
    color: color,
    side: DoubleSide,
  });

  const matLite = new MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.9,
    side: DoubleSide,
  });

  // Defining the text message to display.
  const message = "SECURITY VISION";

  // Generating the shapes for the text using the loaded font and a font size of 20.
  const shapes = font.generateShapes(message, 20);
  const geometry = new ShapeGeometry(shapes);

  // Computing the bounding box of the geometry.
  geometry.computeBoundingBox();

  // Calculating the x coordinate of the center of the text.
  const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

  // Defining the height and depth of the text.
  const textHeight = 0;
  const textDepth = 1350;

  // Translating the geometry to position the text in the correct location.
  geometry.translate(xMid, textHeight, textDepth);

  // Creating a Mesh object with the geometry and MeshBasicMaterial and adding it to the Graph's scene.
  const text = new Mesh(geometry, matLite);
  text.position.z = -10;
  Graph.scene().add(text);

  // Creating a line shape for the text and adding it to the Graph's scene.
  const holeShapes = [];

  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];

    if (shape.holes && shape.holes.length > 0) {
      for (let j = 0; j < shape.holes.length; j++) {
        const hole = shape.holes[j];
        holeShapes.push(hole);
      }
    }
  }

  // Pushes the contents of the holeShapes array into the shapes array
  shapes.push.apply(shapes, holeShapes);

  // Creates a new Object3D instance for the line text
  const lineText = new Object3D();

  // Loops through each shape in the shapes array
  for (let i = 0; i < shapes.length; i++) {
    // Gets the shape at the current index
    const shape = shapes[i];

    // Gets an array of points that define the shape
    const points = shape.getPoints();

    // Creates a new buffer geometry from the shape's points
    const geometry = new BufferGeometry().setFromPoints(points);

    // Translates the geometry so that it is centered and positioned correctly
    geometry.translate(xMid, textHeight, textDepth);

    // Creates a new line mesh using the buffer geometry and material
    const lineMesh = new Line(geometry, matDark);

    // Adds the line mesh to the lineText Object3D instance
    lineText.add(lineMesh);
  }

  // Adds the lineText Object3D instance to the scene
  Graph.scene().add(lineText);
});
