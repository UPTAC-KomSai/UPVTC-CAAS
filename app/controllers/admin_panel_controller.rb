class AdminPanelController < ApplicationController
    def index
        if not current_user
            # Work on this. Lol.
            #redirect_to '/auth?redirect_url=' + request.original_url
            redirect_to '/admin'
        end
    end
end
