;
window.spike = (function($) {

  function init(sidebar, boxes) {
    sidebar.init()
    boxes.init()
  }

  return {
    init: init
  }

})(jQuery)

window.spike.init(window.sidebar, window.boxes)
