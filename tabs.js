;
window.Spike.Tabs = (function($) {

  function init() {
    $('#tabs')
      .asEventStream('click', 'li')
      .debounceImmediate(500)
      .doAction('.preventDefault')
      .onValue(function(event) {
        var $tab = $(event.currentTarget)
        var targetBoxId = $tab.find('a').attr('data-target')

        $('#tabs').find('li').each(function() {
          var $li = $(this)
          if ($li.attr('id') === $tab.attr('id')) {
            $li.addClass('selected')
          } else {
            $li.removeClass('selected')
          }
        })

        $('#sidebar').find('.box').each(function() {
          var $box = $(this)
          if ($box.attr('id') === targetBoxId) {
            $box.addClass('selected')
          } else {
            $box.removeClass('selected')
          }
        })
      })

    selectTab(0)
  }

  function selectTab(index) {
    $('#tabs').find('li').eq(index).click()
  }

  return {
    init: init
  }

})(jQuery)
