// TODO: Make sure to prevent the URL error message from showing up when
//       pressing "Cancel".

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
  $('div#logout-floater').click(function() {
    window.location.replace(window.location.origin + '/signout');
  });

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
        }
      });
    }
  });

  $('div#manage-apps').click(function() {
    $('div#dashboard').animateCss('fadeOutLeft', function() {
      $('div#dashboard').css('display', 'none');
      $('div#manage-apps-panel').css('display', 'block').addClass('animated fadeInRight');
    });
  });

  $('span#manage-apps-back-button').click(function() {
    $('div#manage-apps-panel').animateCss('fadeOutRight', function() {
      $('div#manage-apps-panel').css('display', 'none');
      $('div#dashboard').css('display', 'block').addClass('animated fadeInLeft');
    });
  });

  $('button#add-new-app').click(function() {
    $('div#app-management-form div#app-list table tbody').append(
      '<tr>' +
      '    <td><input type="text" class="form-control client-app-input" placeholder="Client App Name" required></td>' +
      '    <td><input type="text" class="form-control client-app-input" placeholder="Client App URL" required></td>' +
      '    <td><button class="save-app-button btn btn-primary" disabled><i class="fas fa-check"></i> Save</button><button class="cancel-app-button btn btn-danger"><i class="fas fa-ban"></i> Cancel</button></td>' +
      '</tr>'
    );

    var newlyAddedRow = $('div#app-management-form div#app-list table tbody tr').last();
    $($(newlyAddedRow).children('td')[0]).children('input').focus();
  });

  $('div#app-management-form div#app-list table').on('blur', 'input.client-app-input', function() {
    var clientRow = $($(this).parent().parent()).children('td');
    var inputsFilled = true;
    var urlRegex = /^https?:\/\/[-a-zA-Z0-9@:%._\+~#=\/]{1,256}$/;
    for (var i = 0; i < 2; i++) {
      var currentRow = $(clientRow[i]).children('input')[0];
      
      if (i == 1 && !$(currentRow).hasClass('error-focus') && $(currentRow).val() != '') {
        // We are in the app url input.
        if (!urlRegex.test($(currentRow).val())) {
          // URL does not match!
          $('div#error-message').html('<p>Hey! URL format is incorrect. It must be a valid URL and must start with "http" or "https".</p>');
          $('div#error-message').css('transform', 'translate(-50%, 0%)')
                                .delay(5000)
                                .queue(function(next) {
                                  $('div#error-message').css('transform', 'translate(-50%, -100%)');
                                  next();
                                });
          $(currentRow).addClass('error-focus');
          $(currentRow).focus();

          $(clientRow[2]).children('button.save-app-button').attr('disabled', 'disabled');
        }
      } else if (i == 1 && $(currentRow).hasClass('error-focus')) {
        $(currentRow).removeClass('error-focus');
      }

      if ($(currentRow).val() == '') {
        $(clientRow[2]).children('button.save-app-button').attr('disabled', 'disabled');

        inputsFilled = false;
      }
    }

    if (inputsFilled && urlRegex.test($($(clientRow[1]).children('input')[0]).val())) {
      $(clientRow[2]).children('button.save-app-button').removeAttr('disabled');
    }
  });

  $('div#app-management-form div#app-list table').on('keyup', 'input.client-app-input', function() {
    var clientRow = $($(this).parent().parent()).children('td');
    for (var i = 0; i < 2; i++) {
      var currentRow = $(clientRow[i]).children('input')[0];
      
      if ($(currentRow).val() == '') {
        $(clientRow[2]).children('button.save-app-button').attr('disabled', 'disabled');

        return false;
      }

      if (i == 1) {
        // We are in the app url input.
        var urlRegex = /^https?:\/\/[-a-zA-Z0-9@:%._\+~#=\/]{1,256}$/;
        if (!urlRegex.test($(currentRow).val())) {
          // URL does not match!
          $(clientRow[2]).children('button.save-app-button').attr('disabled', 'disabled');
        } else {
          $(clientRow[2]).children('button.save-app-button').removeAttr('disabled');
        }
      }
    }
  });

  $('div#app-management-form div#app-list table').on('click', '.save-app-button', function() {
    var buttonRowChidren = $(this).parent().parent().children('td');
    var clientAppName = $.trim($($(buttonRowChidren[0]).children('input')[0]).val());
    var clientAppUrl = $.trim($($(buttonRowChidren[1]).children('input')[0]).val());
    var saveButton = $(this);
    var cancelButton = $(buttonRowChidren[2]).children('button.cancel-app-button')[0];

    // Make sure there is only one ending / in the client app URL.
    var lastCharacterIndex = 0;
    for (var i = clientAppUrl.length - 1; i >= 0; i--) {
      if (clientAppUrl[i] != '/') {
        lastCharacterIndex = i;
        break;
      }
    }

    newClientAppUrl = clientAppUrl.slice(0, lastCharacterIndex + 1);
    clientAppUrl += '/';

    $(this).attr('disabled', 'disabled')
           .html('<i class="fas fa-spinner fa-spin"></i> Saving...');
    $(cancelButton).attr('disabled', 'disabled');

    $.ajax({
      url: '/admin/app/new',
      type: 'PUT',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]')
           .attr('content'))
      },
      data: 'client_details=' + clientAppName + ',' + clientAppUrl
    })
    .done(function (response) {
      // Delete the whole row and place the new data.
      $(saveButton).parent().parent().remove();
      $('div#app-management-form div#app-list table tbody').append(
        '<tr>' +
        '    <td class="client-name">' + clientAppName + '</td>' +
        '    <td class="client-url">' + clientAppUrl + '</td>' +
        '    <td><button class="edit-app-button btn btn-dark"><i class="fas fa-edit"></i> Edit</button><button class="delete-app-button btn btn-danger"><i class="fas fa-trash"></i> Delete</button></td>' +
        '    <input type="hidden" value="' + response.text + '">' +
        '    <input type="hidden" value="' + clientAppName + '">' +
        '    <input type="hidden" value="' + clientAppUrl + '">' +
        '</tr>'
      );
  
      $('div#success-message').html('<p>New app added! <i class="fas fa-smile"></i></p>');
      $('div#success-message').css('transform', 'translate(-50%, 0%)')
                              .delay(5000)
                              .queue(function(next) {
                                $('div#success-message').css('transform', 'translate(-50%, -100%)');
                                next();
                              });
    })
    .fail(function(XMLHttpRequest, response, errorThrown) {
      $(saveButton).removeAttr('disabled')
                   .html('<i class="fas fa-check"></i> Save');
      $(cancelButton).removeAttr('disabled');

      var errorMessage = '';
      if (XMLHttpRequest.readyState == 4) {
        // HTTP Error.
        errorMessage = '<i class="fas fa-frown"></i> ' + XMLHttpRequest.statusText;
      } else if (XMLHttpRequest.readyState == 0) {
        errorMessage = 'It seems that we cannot add new apps as of the moment. <i class="fas fa-frown"></i> Check again later and please inform the system administrator that you cannot add new apps.';
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
    });
  });

  $('div#app-management-form div#app-list table').on('click', '.cancel-app-button', function() {
    $(this).parent().parent().remove();
  });

  $('div#app-management-form div#app-list table').on('click', '.edit-app-button', function() {
    var buttonRowChidren = $(this).parent().parent().children('td');
    var clientAppNameColumn = $(buttonRowChidren[0]);
    var clientAppUrlColumn = $(buttonRowChidren[1]);
    var clientAppName = $.trim($(buttonRowChidren[0]).text());
    var clientAppUrl = $.trim($(buttonRowChidren[1]).text());
    var storedClientAppNameField = $(this).parent().parent().children('input')[1];
    var storedClientAppUrlField = $(this).parent().parent().children('input')[2];
    var appID = $($(this).parent().parent().children('input')[0]).val();
    var editButton = $(this);
    var deleteButton = $(buttonRowChidren[2]).children('button.delete-app-button')[0];

    $(clientAppNameColumn).html(
      '<input type="text" class="form-control client-app-edit-input" placeholder="Client App Name" value="' + clientAppName +'" required>'
    );
    $(clientAppUrlColumn).html(
      '<input type="text" class="form-control client-app-edit-input" placeholder="Client App URL" value="' + clientAppUrl +'" required>'
    );

    $($(clientAppNameColumn).children('input')[0]).focus();

    $(this).removeClass('btn-dark edit-app-button')
           .addClass('btn-primary save-edit-app-button')
           .attr('disabled', 'disabled')
           .html('<i class="fas fa-check"></i> Save');
    $(deleteButton).removeClass('delete-app-button')
                   .addClass('revert-app-button')
                   .html('<i class="fas fa-ban"></i> Cancel');
  });

  $('div#app-management-form div#app-list table').on('click', '.save-edit-app-button', function() {
    var buttonRowChidren = $(this).parent().parent().children('td');
    var clientAppNameColumn = $(buttonRowChidren[0]);
    var clientAppUrlColumn = $(buttonRowChidren[1]);
    var clientAppName = $.trim($(buttonRowChidren[0]).text());
    var clientAppUrl = $.trim($(buttonRowChidren[1]).text());
    var storedClientAppNameField = $(this).parent().parent().children('input')[1];
    var storedClientAppUrlField = $(this).parent().parent().children('input')[2];
    var appID = $($(this).parent().parent().children('input')[0]).val();
    var editButton = $(this);
    var deleteButton = $(buttonRowChidren[2]).children('button.revert-app-button')[0];

    var newClientAppName = $($(clientAppNameColumn).children('input')[0]).val();
    var newClientAppUrl = $($(clientAppUrlColumn).children('input')[0]).val();

    // Make sure there is only one ending / in the client app URL.
    var lastCharacterIndex = 0;
    newClientAppUrl = newClientAppUrl.replace(/,+$/, "");
    for (var i = newClientAppUrl.length - 1; i >= 0; i--) {
      if (newClientAppUrl[i] != '/') {
        lastCharacterIndex = i;
        break;
      }
    }

    newClientAppUrl = newClientAppUrl.slice(0, lastCharacterIndex + 1);
    newClientAppUrl += '/';

    $(this).attr('disabled', 'disabled')
           .html('<i class="fas fa-spinner fa-spin"></i> Saving...');
    $(deleteButton).attr('disabled', 'disabled');
    
    $.ajax({
      url: '/admin/app/' + appID,
      type: 'POST',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]')
           .attr('content'))
      },
      data: 'app_name=' + newClientAppName + '&app_url=' + newClientAppUrl
    })
    .done(function (response) {
      $(editButton).removeClass('btn-primary save-edit-app-button')
                   .addClass('btn-dark edit-app-button')
                   .removeAttr('disabled')
                   .html('<i class="fas fa-edit"></i> Edit');
      $(deleteButton).removeClass('revert-app-button')
                     .removeAttr('disabled')
                     .addClass('delete-app-button')
                     .html('<i class="fas fa-trash"></i> Delete');
      
      $(clientAppNameColumn).html(newClientAppName);
      $(clientAppUrlColumn).html(newClientAppUrl);
      $(storedClientAppNameField).val(newClientAppName);
      $(storedClientAppUrlField).val(newClientAppUrl);
  
      $('div#success-message').html('<p>Updated app! <i class="fas fa-smile"></i></p>');
      $('div#success-message').css('transform', 'translate(-50%, 0%)')
                              .delay(5000)
                              .queue(function(next) {
                                $('div#success-message').css('transform', 'translate(-50%, -100%)');
                                next();
                              });
    })
    .fail(function(XMLHttpRequest, response, errorThrown) {
      $(editButton).removeClass('btn-primary save-edit-app-button')
                   .addClass('btn-dark edit-app-button')
                   .removeAttr('disabled')
                   .html('<i class="fas fa-edit"></i> Edit');
      $(deleteButton).removeClass('revert-app-button')
                     .addClass('delete-app-button')
                     .html('<i class="fas fa-trash"></i> Delete');

      var errorMessage = '';
      if (XMLHttpRequest.readyState == 4) {
        // HTTP Error.
        errorMessage = '<i class="fas fa-frown"></i> ' + XMLHttpRequest.statusText;
      } else if (XMLHttpRequest.readyState == 0) {
        errorMessage = 'It seems that we cannot update apps as of the moment. <i class="fas fa-frown"></i> Check again later and please inform the system administrator that you cannot update apps.';
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
    });
  });

  $('div#app-management-form div#app-list table').on('blur', 'input.client-app-edit-input', function() {
    var clientRow = $($(this).parent().parent()).children('td');
    var inputsFilled = true;
    var urlRegex = /^https?:\/\/[-a-zA-Z0-9@:%._\+~#=\/]{1,256}$/;
    for (var i = 0; i < 2; i++) {
      var currentRow = $(clientRow[i]).children('input')[0];
      
      if (i == 1 && !$(currentRow).hasClass('error-focus') && $(currentRow).val() != '') {
        // We are in the app url input.
        if (!urlRegex.test($(currentRow).val())) {
          // URL does not match!
          $('div#error-message').html('<p>Hey! URL format is incorrect. It must be a valid URL and must start with "http" or "https".</p>');
          $('div#error-message').css('transform', 'translate(-50%, 0%)')
                                .delay(5000)
                                .queue(function(next) {
                                  $('div#error-message').css('transform', 'translate(-50%, -100%)');
                                  next();
                                });
          $(currentRow).addClass('error-focus');
          $(currentRow).focus();

          $(clientRow[2]).children('button.save-edit-app-button').attr('disabled', 'disabled');

          return false;
        }
      } else if (i == 1 && $(currentRow).hasClass('error-focus')) {
        $(currentRow).removeClass('error-focus');
      }

      if ($(currentRow).val() == '') {
        $(clientRow[2]).children('button.save-edit-app-button').attr('disabled', 'disabled');

        inputsFilled = false;
      }
    }

    if (inputsFilled && urlRegex.test($($(clientRow[1]).children('input')[0]).val())) {
      $(clientRow[2]).children('button.save-edit-app-button').removeAttr('disabled');
    }
  });

  $('div#app-management-form div#app-list table').on('keyup', 'input.client-app-edit-input', function() {
    var clientRow = $($(this).parent().parent()).children('td');
    for (var i = 0; i < 2; i++) {
      var currentRow = $(clientRow[i]).children('input')[0];
      
      if ($(currentRow).val() == '') {
        $(clientRow[2]).children('button.save-edit-app-button').attr('disabled', 'disabled');

        return false;
      }

      if (i == 1) {
        // We are in the app url input.
        var urlRegex = /^https?:\/\/[-a-zA-Z0-9@:%._\+~#=\/]{1,256}$/;
        if (!urlRegex.test($(currentRow).val())) {
          // URL does not match!
          $(clientRow[2]).children('button.save-edit-app-button').attr('disabled', 'disabled');
        } else {
          $(clientRow[2]).children('button.save-edit-app-button').removeAttr('disabled');
        }
      }
    }
  });

  $('div#app-management-form div#app-list table').on('click', '.revert-app-button', function() {
    var buttonRowChidren = $(this).parent().parent().children('td');
    var clientAppNameColumn = $(buttonRowChidren[0]);
    var clientAppUrlColumn = $(buttonRowChidren[1]);
    var storedClientAppName = $($(this).parent().parent().children('input')[1]).val();
    var storedClientAppUrl = $($(this).parent().parent().children('input')[2]).val();
    var editButton = $(buttonRowChidren[2]).children('button.save-edit-app-button')[0];

    $(clientAppNameColumn).html(storedClientAppName);
    $(clientAppUrlColumn).html(storedClientAppUrl);

    $(editButton).removeClass('btn-primary save-edit-app-button')
                 .addClass('btn-dark edit-app-button')
                 .removeAttr('disabled')
                 .html('<i class="fas fa-edit"></i> Edit');
    $(this).removeClass('revert-app-button')
           .addClass('delete-app-button')
           .html('<i class="fas fa-trash"></i> Delete');
  });

  $('div#app-management-form div#app-list table').on('click', '.delete-app-button', function() {
    var buttonRowChidren = $(this).parent().parent().children('td');
    var appID = $($(this).parent().parent().children('input')[0]).val();
    var deleteButton = $(this);
    var editButton = $(buttonRowChidren[2]).children('button.edit-app-button')[0];

    $(this).attr('disabled', 'disabled')
           .html('<i class="fas fa-spinner fa-spin"></i> Deleting...');
    $(editButton).attr('disabled', 'disabled');

    $.confirm({
      title: 'Delete App?',
      content: 'Deleting the app will prevent the app from signing out the user in that app when the other apps sign the user out.',
      type: 'red',
      buttons: {  
        cancel: function(){
          $(deleteButton).removeAttr('disabled')
                         .html('<i class="fas fa-trash"></i> Delete');
          $(editButton).removeAttr('disabled');
        }, 
        delete: {
          text: "Delete",
          btnClass: 'btn-danger',
          keys: ['enter'],
          action: function(){
            $.ajax({
              url: '/admin/app/' + appID + 'delete',
              type: 'DELETE',
              beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]')
                    .attr('content'))
              }
            })
            .done(function (response) {
              // Delete the whole row and place the new data.
              $(deleteButton).parent().parent().remove();
              
              $('div#success-message').html('<p>App deleted! <i class="fas fa-smile"></i></p>');
              $('div#success-message').css('transform', 'translate(-50%, 0%)')
                                      .delay(5000)
                                      .queue(function(next) {
                                        $('div#success-message').css('transform', 'translate(-50%, -100%)');
                                        next();
                                      });
            })
            .fail(function(XMLHttpRequest, response, errorThrown) {
              $(deleteButton).removeAttr('disabled')
                              .html('<i class="fas fa-trash"></i> Delete');
              $(editButton).removeAttr('disabled');
            
              var errorMessage = '';
              if (XMLHttpRequest.readyState == 4) {
                // HTTP Error.
                errorMessage = '<i class="fas fa-frown"></i> ' + XMLHttpRequest.statusText;
              } else if (XMLHttpRequest.readyState == 0) {
                errorMessage = 'It seems that we cannot delete apps as of the moment. <i class="fas fa-frown"></i> Check again later and please inform the system administrator that you cannot delete apps.';
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
            });
          }
        }
      }
    });
  });
});