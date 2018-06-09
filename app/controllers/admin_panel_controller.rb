require 'gmail'

class AdminPanelController < ApplicationController
    def index
        if not current_user
            # Work on this. Lol.
            #redirect_to '/auth?redirect_url=' + request.original_url
            redirect_to '/admin'
        end
    end

    def send_emails
        Gmail.connect!(Rails.application.secrets.google_email, Rails.application.secrets.google_password) do |gmail|
            p params
        end
    end
end
