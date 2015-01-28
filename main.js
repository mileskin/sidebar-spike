;
(function(spike) {
  var boxes = spike.Boxes
  spike.Sidebar.init(boxes.calculateBoxHeights)
  boxes.init()
})(window.Spike)
