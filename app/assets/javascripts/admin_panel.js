$.fn.extend({
    animateCss: function(animationName, callback) {
      var animationEnd = (function(el) {
        var animations = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'mozAnimationEnd',
          WebkitAnimation: 'webkitAnimationEnd',
        };
  
        for (var t in animations) {
          if (el.style[t] !== undefined) {
            return animations[t];
          }
        }
      })(document.createElement('div'));
  
      this.addClass('animated ' + animationName).one(animationEnd, function() {
        $(this).removeClass('animated ' + animationName);
  
        if (typeof callback === 'function') callback();
      });
  
      return this;
    },
  });

$(document).ready(function() {
    $('div#invite-users').click(function() {
      $('div#dashboard').animateCss('fadeOutLeft', function() {
        $('div#dashboard').css('display', 'none');
        $('div#invite-users-panel').css('display', 'block').addClass('animated fadeInRight');
      });
    });

    $('span#invite-users-back-button').click(function() {
      $('div#invite-users-panel').animateCss('fadeOutRight', function() {
        $('div#invite-users-panel').css('display', 'none');
        $('div#dashboard').css('display', 'block').addClass('animated fadeInLeft');
      });
    });

    $('button#add-user-account').click(function() {
      $('div#invitation-form form#invite-form div.form-group').append(
        '<div class="removable-input">' +
        '    <span class="fas fa-times remove-input-button"></span>' +
        '    <input type="email" class="form-control invited-email-address-input" placeholder="Add a UP Mail account...">' +
        '</div>'
      );
    });

    $('div#invitation-form form#invite-form div.form-group').on('click', '.remove-input-button', function() {
      $(this).parent().remove();
    });
});