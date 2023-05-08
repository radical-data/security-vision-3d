// This function resizes the 3D graph when called.
export default function resizeGraph() {
  // Check if Graph is defined
  if (Graph) {
    // Get the height and width of the container element
    var height = document.getElementById("3d-graph").clientHeight;
    var width = document.getElementById("3d-graph").clientWidth;
    // Set the width and height of the graph to match the container
    Graph.width(width);
    Graph.height(height);

    // Resize the controls to fit the new size
    Graph.controls().handleResize();
  }
}
