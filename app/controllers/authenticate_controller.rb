class AuthenticateController < ApplicationController
  include AuthenticateHelper

  def index
  end

  def authenticate
    redirect_url = params[:redirect_url]

    if current_user
      redirect_to redirect_url
    else
      redirect_to '/'
    end
  end
end
