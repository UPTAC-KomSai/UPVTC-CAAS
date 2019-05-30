# UPVTC CAAS

The central authentication system for UPVTC apps. Note that the system is limited to UP Mail accounts only.

## Notes For Setting Up the System
Before using the system, you must first obtain the OAuth 2.0 credentials, client ID and client secret, from Google. To obtain the key, follow the steps below:

1. Head over to [Google API Console](https://console.developers.google.com).
2. Select the project for the CAAS system. If none is avaliable, create one.
3. Select 'Credentials'.
4. Click the 'Create credentials' button and click 'OAuth client ID'. You will be transported to a form where you will register the system to Google to allow it to access users' private data. Fill up the form with the appropriate data. After filling up, a dialog will show up and you will be given the two client credentials you need.

After obtaining the credentials, you must also set the authorized JavaScript origins and redirect URIs of the system in the API console. To do this, edit the configuration of the system (which can be done by going to 'Credentials > Credentials' in the console and clicking the Edit button of the CAAS's OAuth 2.0 configuration). You should then add the following URIs to the **Authorized JavaScript origins** list:

- `http://<CAAS's IP address + xip.io or domain name>` (or `https`)
- `http://www.<CAAS's IP address + xip.io or domain name>` (or `https`)
- `http://mysite.<CAAS's IP address + xip.io or domain name>` (or `https`)
- `http://foo.bar.<CAAS's IP address + xip.io or domain name>.xip.io` (or `https`)

and the following to the **Authorized redirect URIs** list:

-	`http://<CAAS's IP address + xip.io or domain name>/auth/google_oauth2/callback` (or `https`)
- `http://<CAAS's IP address + xip.io or domain name>/auth/google_oauth2/callback` (or `https`)
- `http://<CAAS's IP address + xip.io or domain name>/auth/google_oauth2/callback` (or `https`)
- `http://<CAAS's IP address + xip.io or domain name>/auth/google_oauth2/callback` (or `https`)

Make sure to save the new settings after adding the aforementioned URIs.

Once you have obtained the client ID and secret, you must then have the following environment variables set for the UPVTC CAAS to work:

* `UPVTC_CAAS_GOOGLE_CLIENT_ID`    
    The CAAS's client ID you obtained from Google.
* `UPVTC_CAAS_GOOGLE_CLIENT_SECRET`    
    The CAAS's client secret you obtained from Google.
* `UPVTC_CAAS_GMAIL_ADDRESS`    
    The CAAS admin's UP Mail email address.
* `UPVTC_CAAS_GMAIL_PASSWORD`    
    The CAAS admin's account password.
    
It must also be noted that Google does not allow the use of private IP addresses as the redirect URI. Thus, when accessing the CAAS using its IP address, it must be accessed through `http://<CAAS IP address>.xip.io` (or `https`) or something similar (`xip.io` is a free wildcard DNS service).
    
## Accessing the Admin Panel
To access the admin panel, you must first log in to the CAAS with the CAAS admin's UP Mail account. Once you have logged in, access the panel via `/admin`.

## Integrating Client Apps with the CAAS

For client apps to use the CAAS, those client apps must first be registered to the CAAS. Apps can be registered in 'Manage Apps' in the admin panel. Registration involves adding the name and full URL (including `https` or `http`) of the client app.

Note that the CAAS will only handle logging in the user's UP Mail account. It will not automatically login the accounts in all client apps. If a user logs in to a client app, he/she will only be logged in to that app. ~~This client app login session independence also appears during logout. The client apps are responsible for logging out the user. The app may invoke the CAAS to log out the user but any active sessions in the client apps will not be logged out by the CAAS and the user is only logged out in the CAAS. The user must log out from each client app they used manually, i.e. hitting 'Log out' on every client app they are logged in. In other words, the client apps are responsible for maintaining session state.~~ (The code contains logic to perform a front-channel logout which will sign out the user from all logged in client apps. However, this is only merely a guess and has not been tested as the knowledge on the original behaviour has been lost to time.)

The CAAS requires client apps to have two callback URLs:

* `/auth/caas/callback/`    
    This is the URL CAAS calls in the client app when it receives a login request. This callback will be passed two request parameters, a one-time use service ticket and the redirect URL. The service ticket should be sent back to the CAAS by the client app via `http://<CAAS's IP address + xip.io or domain name>/auth/verifyTicket?ticket=<service ticket>` (or `https`). If the response data, which is formatted in JSON, does not contain a 'status' field, then the user has successfully logged in and the client app must set cookies to denote that the user has logged in and preserve the user's session. If not, then the client app does not create a user session. The client app should then redirect to the client app's home page or to the redirect URL.
    The response actually has multiple fields containing information about the currently logged in user. The available fields are:
    * `uid` - the user's ID
    * `email` - the user's email address
    * `name` - the user's name, a combination of the first and last name
    * `first_name` - the user's first name
    * `last_name` - the user's last name
    * `identifier` - a random identifier for the response (used in making the service ticket look unique)
* `/auth/caas/logout/`    
    This is called by CAAS when a user logs out via the client app. This is where the client app should delete the cookies it has made. Afterwards, the client app should then redirect to `http://<CAAS's IP address + xip.io or domain name>/signout` (or `https`).
    
For signing in and out the user, the client apps must provide sign in and out links that will point to specific endpoints in the CAAS.

* `http://<CAAS's IP address + xip.io or domain name>/auth?redirect_url=<URL to be redirected to post-logout>` (or `https`)
    Endpoint used to log in the user to the CAAS and then the client app.
* `http://<CAAS's IP address + xip.io or domain name>/signout?redirect_url=<URL to be redirected to post-logout>` (or `https`)
    Endpoint used to log out the user from the CAAS and all client apps.

Source code of an example client app is available [here](https://github.com/UPTAC-KomSai/UPVTC-CAAS-Test-App).

