# Super user
psql -U postgres

# Role of database
psql -d postgres -U me

# .gitignore
Ignored .env because it contains sensitive information for DB.

# API URL
change API_URL in shared.js to correct url.

# cross origin cookies
Make sure root address is the same for node js app and website server. Example:
'localhost'.

# Starting backend server
1. cd to server folder.
2. run in command line:
> nodemon index.js

# Starting website on localhost
1. cd into website folder.
2. Run on command line:
> http-server -a localhost