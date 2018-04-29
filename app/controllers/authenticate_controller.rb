require 'uri'
require 'jwt'

class AuthenticateController < ApplicationController
  include AuthenticateHelper

  def index
  end

  def authenticate
    redirect_url = params[:redirect_url]

    if current_user
      # NOTE: We have to make a ticket first to make sure that the user actually
      #       logged in on his own via the server.

      # Generate a one-time use service ticket in JWT format.
      payload = { email: current_user.email, name: current_user.name }
      ticket = JWT.encode payload, Rails.application.secrets.secret_key_base, 'HS256'

      # Pass back to client with the service ticket.
      client_auth_url = URI.join redirect_url, '/'
      client_auth_url += '?serviceTicket=' + URI.escape(ticket)
      client_auth_url += '&redirect_url=' + redirect_url

      redirect_to client_auth_url
    else
      redirect_to '/'
    end
  end
end
