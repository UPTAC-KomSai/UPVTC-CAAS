require 'net/http'
require 'uri'

class SessionsController < ApplicationController
  def create
    user = User.from_omniauth(request.env["omniauth.auth"])
    session[:user_id] = user.id
    redirect_to root_path
  end

  def destroy
    # Redirect to the appropriate page if we no longer need to redirect to the ohter logout URLs.
    if session[:redirect_url] == nil
      if params[:redirect_url] and sessions[:redirect_url] == nil
        session[:redirect_url] = params[:redirect_url]
      else
        session[:redirect_url] = '/'
      end
    end

    # We will be performing a front-channel logout.
    # Get the URL of the apps client apps.
    if session[:client_logout_urls] == nil
      session[:client_logout_urls] = ClientApp.pluck(:url)
    elsif session[:client_logout_urls].length > 0
      # Check if the URL redirects back to this URL after redirection.
      # We will only follow one level of redirection because,
      # typically during logouts, you just need to delete your
      # cookies and never needing to redirect.
      combined_url = URI.join(session[:client_logout_urls].pop, '/auth/caas/logout/').to_s
      url = URI.encode_www_form(combined_url).to_s
      res = Net::HTTP.get_response(URI(url))
      if res['location'] == request.original_url
        redirect_to URI::encode(url)
      end
    end

    redirect_url = session[:redirect_url]
    session[:user_id] = nil
    session[:client_logout_urls] = nil
    session[:redirect_url] = nil

    redirect_to URI.encode(redirect_url)
  end
end
