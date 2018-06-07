Rails.application.config.middleware.use OmniAuth::Builder do
    provider :google_oauth2,
             Rails.application.secrets.google_client_id,
             Rails.application.secrets.google_client_secret,
             {
                 client_options: {
                    ssl: {
                        ca_file: Rails.root.join('certs/cacert.pem').to_s
                    }
                 },
                 hd: 'up.edu.ph'
             }
end