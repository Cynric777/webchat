angular.module('webchatApp').directive('autoScrollToBottom', function() {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(
        function() {
          return element.children().length
        },
        function() {
          element.animate({
            scrollTop: element.prop('ScrollHeight')
          }, 1000)
        }
      )
    }
  }
})
