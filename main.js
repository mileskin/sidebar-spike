;
(function(spike) {
  var boxes = spike.Boxes
  var tabs = spike.Tabs
  spike.Sidebar.init(boxes.calculateBoxHeights)
  boxes.init()
  tabs.init()
})(window.Spike)
