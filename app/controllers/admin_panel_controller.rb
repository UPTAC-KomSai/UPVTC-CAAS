class AdminPanelController < ApplicationController
    def index
        if not current_user
            redirect_to '/'
        end
    end
end
