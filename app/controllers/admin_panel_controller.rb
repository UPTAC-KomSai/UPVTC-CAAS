require 'gmail'

class AdminPanelController < ApplicationController
    def index
        if not current_user
            # TODO: Work on this. Lol.
            #redirect_to '/auth?redirect_url=' + request.original_url
            redirect_to request.base_url
        end

        @client_apps = ClientApp.all
    end

    def send_emails
        # NOTE: Consider failing state for Gmail.
        Gmail.connect!(Rails.application.secrets.google_email, Rails.application.secrets.google_password) do |gmail|
            email_addresses = params['email_addresses'].split(',')
            # COnsider empty strings.
            upvtc_apps_url = request.base_url  # This could probably be improved and you could do something better than this.
            email_addresses.each do |email_address|
                if /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@up\.edu\.ph$/.match? email_address
                    gmail.deliver do
                        to email_address
                        subject 'You have been invited to use the UPVTC Apps!'
                        html_part do
                            content_type 'text/html; charset=UTF-8'
                            body '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>  <title></title>  <!--[if !mso]><!-- -->  <meta http-equiv="X-UA-Compatible" content="IE=edge">  <!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style type="text/css">  #outlook a { padding: 0; }  .ReadMsgBody { width: 100%; }  .ExternalClass { width: 100%; }  .ExternalClass * { line-height:100%; }  body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }  table, td { border-collapse:collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }  img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }  p { display: block; margin: 13px 0; }</style><!--[if !mso]><!--><style type="text/css">  @media only screen and (max-width:480px) {    @-ms-viewport { width:320px; }    @viewport { width:320px; }  }</style><!--<![endif]--><!--[if mso]><xml>  <o:OfficeDocumentSettings>    <o:AllowPNG/>    <o:PixelsPerInch>96</o:PixelsPerInch>  </o:OfficeDocumentSettings></xml><![endif]--><!--[if lte mso 11]><style type="text/css">  .outlook-group-fix {    width:100% !important;  }</style><![endif]--><!--[if !mso]><!-->    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">    <style type="text/css">        @import url(https://fonts.googleapis.com/css?family=Open+Sans);  @import url(https://fonts.googleapis.com/css?family=Lato);  @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);    </style>  <!--<![endif]--><style type="text/css">  @media only screen and (min-width:480px) {    .mj-column-per-100 { width:100%!important; }  }</style></head><body style="background: #FFFFFF;">    <div class="mj-container" style="background-color:#FFFFFF;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">        <tr>          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="background:#C02424;font-size:0px;width:100%;" border="0"><tbody><tr><td><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:9px 0px 9px 0px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:600px;">      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:20px 20px 20px 20px;" align="center"><div style="cursor:auto;color:#FFFFFF;font-family:Lato, Tahoma, sans-serif;font-size:11px;line-height:22px;text-align:center;"><p><span style="font-size:48px;"><strong>YOU ARE INVITED</strong></span></p></div></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div></td></tr></tbody></table><!--[if mso | IE]>      </td></tr></table>      <![endif]-->      <!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">        <tr>          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" border="0"><tbody><tr><td><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:9px 0px 9px 0px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:600px;">      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 0px 0px 0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:180px;"><img alt="" title="" height="auto" src="https://topolio.s3-eu-west-1.amazonaws.com/uploads/5b1bf6101f348/1528559482.jpg" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="180"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 20px 0px 20px;" align="center"><div style="cursor:auto;color:#000000;font-family:Helvetica, sans-serif;font-size:11px;line-height:22px;text-align:center;"><p><span style="font-size:22px;">As part of the University of the Philippines Visayas Tacloban College community, you have been invited to use the UPVTC Apps that are developed for the college. They are open to anyone that has a UP Mail account.</span></p></div></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:30px 23px 30px 23px;padding-top:10px;padding-left:25px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;" align="center" border="0"><tbody><tr><td style="border:none;border-radius:24px;color:#fff;cursor:auto;padding:10px 25px;" align="center" valign="middle" bgcolor="#C52E2E"><a href="' + upvtc_apps_url +'" style="text-decoration:none;background:#C52E2E;color:#fff;font-family:Ubuntu, Helvetica, Arial, sans-serif, Helvetica, Arial, sans-serif;font-size:27px;font-weight:normal;line-height:120%;text-transform:none;margin:0px;" target="_blank">Accept Invitation</a></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div></td></tr></tbody></table><!--[if mso | IE]>      </td></tr></table>      <![endif]-->      <!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">        <tr>          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="background:#070707;font-size:0px;width:100%;" border="0"><tbody><tr><td><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:9px 0px 9px 0px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:600px;">      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 20px 0px 20px;" align="center"><div style="cursor:auto;color:#FFFFFF;font-family:Open Sans, sans-serif;;font-size:11px;line-height:22px;text-align:center;"><p><span style="font-size:12px;">Copyright &#xA9; 2018 University of the Philippine Visayas Tacloban College. All rights reserved. Project by <a href="https://seanballais.github.io" target="_blank" style="color: rgb(255, 144, 144)">Sean Francis N. Ballais</a>, John Ivan Puayap, and Warren Kenn Pulma.</span></p></div></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div></td></tr></tbody></table><!--[if mso | IE]>      </td></tr></table>      <![endif]--></div></body></html>'
                        end
                    end
                elsif email_address.blank?
                    next
                else
                    render :status => :bad_request, json: {
                        :text => 'Email address is invalid or is not a UP Mail account (i.e. the ones with @up.edu.ph).'
                    }.to_json
                end
            end
        end
    end

    def new_client_app
        client_details = params['client_details'].split(',').reject { |detail| detail.gsub(/\s+/, "").empty? }
        
        client_details[0].strip!
        client_details[1].strip!

        if client_details[0].blank?
            render :status => :bad_request, json: {
                :text => 'You sent an empty client name. Use letters, numbers, and symbols only.'
            }.to_json
        end

        if client_details[1].blank? and /^https?:\/\/[-a-zA-Z0-9@:%._\+~#=\/]{1,256}$/.match? client_details[1]
            render :status => :bad_request, json: {
                :text => 'You sent an invalid url. It must be a valid URL and must start with "http" or "https".'
            }.to_json
        end

        # Check duplicate URLs

        client_details[1].chomp!(client_details[1][/\/+$/])
        client_details[1] += '/'

        app = ClientApp.create(name: client_details[0], url: client_details[1])

        render :status => 200, json: {
            :text => app.id
        }.to_json
    end

    def delete_client_app
        # Check if the ID exists
        app_id = params[:id]

        ClientApp.where(id: app_id).destroy_all
    end
end
