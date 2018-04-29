class AuthenticateController < ApplicationController
  include AuthenticateHelper

  def index
  end

  def authenticate
    if current_user
      redirect_to '/'
    else
      redirect_to 'https://twitter.com'
    end
  end
end
