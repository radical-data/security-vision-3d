export default function resizeGraph() {
  if (Graph) {
    var height = document.getElementById("3d-graph").clientHeight;
    var width = document.getElementById("3d-graph").clientWidth;

    Graph.width(width);
    Graph.height(height);
    Graph.controls().handleResize();
  }
}

// export default resizeGraph;
