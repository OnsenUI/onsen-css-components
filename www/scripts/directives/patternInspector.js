'use strict';

// TODO: refactoring
angular.module('app').directive('patternInspector', function($rootScope, GeneratedCss) {
  return function(scope, element, attrs) {

    scope.showComponentDialog = function() {
      ga('send', 'event', 'overview', 'inspect', scope.pattern.src);
      if (lastComponent) {
        ga('send', 'event', 'overview', 'showComponent', lastComponent.object.name);
        scope.inspector.showComponentDialog(lastComponent.object);
      } else {
        ga('send', 'event', 'overview', 'showHtml', scope.pattern.src);
        scope.htmlDialog.show(scope.pattern.src);
      }
    };

    var mask = $(element[0]);
    var highlight = $('.inspector-highlight', element[0]);
    var label = $('.label', highlight[0]);
    var pattern = $('div.pattern-preview', mask.parent());
    var lastComponent = null;

    function searchTopcoatComponent(target) {
      if (target) {
        var possibleComponents = scope.components.filter(function(eachComponent) {
          return $(target).hasClass(eachComponent.class);
        });
        if (possibleComponents.length > 0) {
          // TODO: check hint property for more accurate check
          var foundComponent = possibleComponents[0];
          return {
            object: foundComponent,
            element: target
          };
        } else {
          return searchTopcoatComponent(target.parentNode);
        }
      }
      return null;
    }

    mask.parent().mousemove(watch);
    mask.parent().mouseleave(function() {
      highlight.hide();
    });

    function watch(event) {
      var point = {x: event.clientX, y: event.clientY};

      mask.css('pointer-events', 'none');
      var targetElement = document.elementFromPoint(point.x, point.y);
      mask.css('pointer-events', 'auto');

      var component = searchTopcoatComponent(targetElement);

      if (component) {
        var rect = component.element.getBoundingClientRect();
        var base = pattern[0].getBoundingClientRect();

        highlight.css({
          left: rect.left - base.left,
          top: rect.top - base.top,
          width: rect.width,
          height: rect.height
        }).show();

        label
          .removeClass('above below')
          .addClass(rect.top - base.top > 20 ? 'above' : 'below')
          .text(component.object.name);

        lastComponent = component;
      } else {
        lastComponent = null;
        var rect = pattern[0].getBoundingClientRect();
        var base = pattern[0].getBoundingClientRect();

        label
          .removeClass('above below')
          .addClass('inner')
          .text("Full Source");

        highlight.css({
          left: rect.left - base.left,
          top: rect.top - base.top,
          width: rect.width,
          height: rect.height
        }).show();
      }
    }

  };
});
