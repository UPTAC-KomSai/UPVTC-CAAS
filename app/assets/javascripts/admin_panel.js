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
      '    <input type="email" class="form-control invited-email-address-input" placeholder="Add a UP Mail account..." required>' +
      '</div>'
    );
  });

  $('div#invitation-form form#invite-form div.form-group').on('click', '.remove-input-button', function() {
    $(this).parent().remove();
  });

  $('div#invitation-form form#invite-form').submit(function(e) {
    e.preventDefault();

    $('button#invite-users').attr('disabled', 'disabled')
                            .html('<i class="fas fa-spinner fa-spin"></i> Inviting users...');

    var emailAddressInputs = $('input.invited-email-address-input');
    var emailAddresses = '';
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@up\.edu\.ph$/;
    for (var i = 0; i < emailAddressInputs.length; i++) {
      var emailAddressInput = $(emailAddressInputs[i]);
      var emailAddress = $(emailAddressInput).val();

      if (emailRegex.test(emailAddress)) {
        emailAddresses += ',' + emailAddress;
      } else {
        $(emailAddressInput).addClass('error-focus');
        $(emailAddressInput).focus().val($(emailAddressInput).val());
        $(emailAddressInput).on('blur', function() {
          $(this).removeClass('error-focus');
        });
    
        $('div#error-message').text('Woops! You can only invite UP Mail accounts (i.e. the ones with @up.edu.ph).');
        $('div#error-message').css('transform', 'translate(-50%, 0%)')
                              .delay(5000)
                              .queue(function(next) {
                                $('div#error-message').css('transform', 'translate(-50%, -100%)');
                                next();
                              });

        return false;
      }

      // Remove the first character since it is just comma and it is unneeded.
      if (emailAddresses.length > 0) {
        emailAddresses = emailAddresses.slice(1);
      }

      // Everything went okay.
      $.ajax({
        url: '/admin/send_emails',
        type: 'POST',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]')
             .attr('content'))
        },
        data: 'email_addresses=' + emailAddresses,
        error: function(XMLHttpRequest, response, errorThrown) {
          $('button#invite-users').removeAttr('disabled')
                                  .html('<i class="fas fa-paper-plane"></i> Invite users');

          var errorMessage = '';
          if (XMLHttpRequest.readyState == 4) {
            // HTTP Error.
            errorMessage = '<i class="fas fa-frown"></i> ' + XMLHttpRequest.statusText;
          } else if (XMLHttpRequest.readyState == 0) {
            errorMessage = 'It seems that we cannot send the invitations as of the moment. <i class="fas fa-frown"></i> Check again later and please inform the system administrator that you cannot send invitations.';
          } else {
            errorMessage = 'Weird stuff. <i class="fas fa-meh"></i> Please report this issue to the system adminstrator immediately!';
          }

          $('div#error-message').html('<p>Oh no! ' + errorMessage + '</p>');
          $('div#error-message').css('transform', 'translate(-50%, 0%)')
                                .delay(10000)
                                .queue(function(next) {
                                  $('div#error-message').css('transform', 'translate(-50%, -100%)');
                                  next();
                                });
        },
        success: function(response) {
          $('button#invite-users').removeAttr('disabled')
                                  .html('<i class="fas fa-paper-plane"></i> Invite users');
          $('div.removable-input').remove();
          $('div#invitation-form form#invite-form div.form-group input').val('');
    
          $('div#success-message').html('<p>Invitations sent! <i class="fas fa-smile"></i></p>');
          $('div#success-message').css('transform', 'translate(-50%, 0%)')
                                .delay(5000)
                                .queue(function(next) {
                                  $('div#success-message').css('transform', 'translate(-50%, -100%)');
                                  next();
                                });

          return false;
        }
      });
    }
  });
});