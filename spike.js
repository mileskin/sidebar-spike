var $win = $(window)
var sidebarMinHeight = 500
var sidebarPadding = 10

$('#sidebar')
  .asEventStream('click', '.box')
  .map(function(e) {
    return $(e.currentTarget)
  })
  .onValue(function($box) {
    $box.toggleClass('expanded')
  })

Bacon.mergeAll([
  $win.asEventStream('load'),
  $win.asEventStream('scroll'),
  $win.asEventStream('resize')
])
  .debounce(100)
  .map(toCurrentElementPositions)
  .onValue(applySidebarPosition)


function toCurrentElementPositions() {
  var windowHeight = $win.height()
  var windowTop = $win.scrollTop()
  var windowBottom = windowTop + windowHeight
  var topbar = $('#topbar-2').position().top + $('#topbar-2').height()
  var pageContentTop = $('#page-content').position().top
  var bottomContentTop = $('#bottom-content').position().top
  var topVisible = windowTop < topbar
  var bottomVisible = windowBottom > bottomContentTop + topbar

  return {
    sidebarMinHeight: sidebarMinHeight,
    windowHeight: windowHeight,
    windowTop: windowTop,
    windowBottom: windowBottom,
    topbar: topbar,
    pageContentTop: pageContentTop,
    bottomContentTop: bottomContentTop,
    topVisible: topVisible,
    bottomVisible: bottomVisible
  }
}


function applySidebarPosition(x) {
  console.table([x])
  if (x.windowHeight < x.sidebarMinHeight + x.topbar) {
    console.log('small window')
    $('#sidebar')
      .css('position', 'absolute')
      .css('top', sidebarPadding)
      .css('bottom', sidebarPadding)
      .css('max-height', sidebarMinHeight + 'px')
  } else if (x.topVisible) {
    console.log('top visible')
    $('#sidebar')
      .css('position', 'fixed')
      .css('top', x.topbar - x.windowTop + sidebarPadding)
      .css('bottom', sidebarPadding)
      .css('max-height', '1000px')
  } else if (x.bottomVisible) {
    console.log('bottom visible')
    var availableSideBarHeight = x.bottomContentTop - x.windowTop + x.pageContentTop - sidebarPadding - sidebarPadding
    var sidebarTopWhenEnoughRoom = x.windowTop - x.pageContentTop + sidebarPadding
    var sidebarTop = (function() {
      if (availableSideBarHeight < x.sidebarMinHeight) {
        return x.bottomContentTop - x.sidebarMinHeight - sidebarPadding - sidebarPadding
      } else {
        return sidebarTopWhenEnoughRoom
      }
    })()
    $('#sidebar')
      .css('position', 'absolute')
      .css('top', sidebarTop)
      .css('bottom', $('#page-content').height() - $('#main-content').height() + sidebarPadding)
      .css('max-height', '1000px')
  } else {
    console.log('main content only')
    $('#sidebar')
      .css('position', 'fixed')
      .css('top', sidebarPadding)
      .css('bottom', sidebarPadding)
      .css('max-height', '1000px')
  }
}
