Rails.application.config.middleware.use OmniAuth::Builder do
    provider :google_oauth2,
             ENV['UPVTC_CAAS_GOOGLE_CLIENT_ID'],
             ENV['UPVTC_CAAS_GOOGLE_CLIENT_SECRET'],
             {
                 client_options: {
                    ssl: {
                        ca_file: Rails.root.join('certs/cacert.pem').to_s
                    }
                 },
                 hd: 'up.edu.ph'
             }
end