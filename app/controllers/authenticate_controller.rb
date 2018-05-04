require 'uri'
require 'securerandom'
require 'jwt'

class AuthenticateController < ApplicationController
  include AuthenticateHelper

  skip_before_action :verify_authenticity_token, :only => [:verify_ticket]

  def index
    if current_user and session[:redirect_url]
      # This most likely means that a client app requested authentication
      # but the user was not yet logged in to the CAAS.
      redirect_url = session[:redirect_url]
      session[:redirect_url] = nil

      auth_url = '/auth/?redirect_url=' + URI.encode(redirect_url).to_s
      redirect_to auth_url
    end
  end

  def authenticate
    redirect_url = params[:redirect_url]

    if current_user
      # NOTE: We have to make a ticket first to make sure that the user actually
      #       logged in on his own via the server.

      # Generate a one-time use service ticket in JWT format.
      payload = {
        uid: current_user.uid,
        email: current_user.email,
        name: current_user.name,
        first_name: current_user.first_name,
        last_name: current_user.last_name,
        identifier: SecureRandom.uuid
      }
      ticket = JWT.encode payload, Rails.application.secrets.secret_key_base, 'HS256'
      ServiceTicket.create(uid: current_user.uid, ticket: ticket)

      # Pass back to client with the service ticket.
      client_auth_url = URI.join redirect_url, '/auth/caas/callback/'
      auth_queries = URI.decode_www_form(String(client_auth_url.query))
      auth_queries <<= ['serviceTicket', URI.escape(ticket).to_s]
      auth_queries <<= ['redirect_url', URI.encode(redirect_url).to_s]
      client_auth_url.query = URI.encode_www_form(auth_queries)

      redirect_to client_auth_url.to_s
    else
      session[:redirect_url] = redirect_url
      redirect_to '/'
    end
  end

  def verify_ticket
    ticket = params[:ticket]

    begin
      header, payload = JWT.decode ticket, Rails.application.secrets.secret_key_base
      ServiceTicket.find_by(uid: header["uid"], ticket: ticket).destroy

      render json: header
    rescue JWT::VerificationError, JWT::DecodeError, ActiveRecord::RecordNotFound
      render json: { "status": { "error": 400, "message": "Invalid service ticket." } }
    end
  end
end
