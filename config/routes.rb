Rails.application.routes.draw do
  get 'auth/:provider/callback', to: 'sessions#create'
  get 'auth/failure', to: redirect('/')
  get 'signout', to: 'sessions#destroy', as: 'signout'

  resources :sessions, only: [:create, :destroy]

  root 'authenticate#index'

  get 'auth', to: 'authenticate#authenticate'
  get 'auth/verifyTicket', to: 'authenticate#verify_ticket'
  get 'admin', to: 'admin_panel#index'
  post 'admin/send_emails', to: 'admin_panel#send_emails'
  post 'admin/app/new', to: 'admin_panel#new_client_app'
end
