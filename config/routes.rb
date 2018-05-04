Rails.application.routes.draw do
  get 'auth/:provider/callback', to: 'sessions#create'
  get 'auth/failure', to: redirect('/')
  get 'signout', to: 'sessions#destroy', as: 'signout'

  resources :sessions, only: [:create, :destroy]

  root 'authenticate#index'

  get 'auth', to: 'authenticate#authenticate'
  post 'auth/verifyTicket', to: 'authenticate#verify_ticket'  # Ask Sir Ultra if this can be
                                                              # just a GET request.
end
