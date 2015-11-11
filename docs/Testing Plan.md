#_MusicVenue_ Testing Plan

Steps pertaining to the MusicVenue server-database-webpage testing planification.

-----

### User Registration and Login:

1. Create a new dummy via the registration web page
  - Test for successful query and database response
  - Test for code error responses
2. Log out of the account and immediately log back in via the login page
  - Test for correct password decryption and retrieval of user information
3. Register with an e-mail that is already in use
  - Test for server and database response
  - Ascert web page response
4. Login with an incorrect e-mail and password
  - Examine server and database response
  - Verify web page response


### Account Update:

1. Edit account information in Settings Web Page
  - Test for successful query and database update response
2. Add and remove a Business/Group
  - Test for server, query, and database response
3. Verify correct tag identification and handling
  - Test for tag search in database
  - Test for tag deletion in both database and web page


### Forgot Password and Reset Protocol:

1. Correct user identification and notification dispatch
  - Test for successful query, server, and database response
  - Verify notification delivery
2. Successful password reset
  - Test for query and database update in uuser table


### Home Page Post Refreshing:

1. Refreshing of home page must add new posts to Board if any were added to followed businesses, groups, and/or tags
  - Examine for successful manual query post addition
  - Test for appropriate query tag and post retrievals
  - Verify database and web page response during and after the procedure
  - According appearance of web page after refreshing


### Home Page Text Only and Media Posting:

1. Creation of text only post
  - Test for correct query designation and addition to database responses
2. Creation of media (audio, video, and photo) posts:
  - Test for appropriate query designation and addition to database responses
3. Appearance of posts after addition to Board
  - Test for correct web poage, database, and server responses to previous actions
  
  
### General Profile Page Apperance

1. Correct information display after user/account editing
  - Note: To be verified after an ___Account Update___ has taken place
  - Test for according query retrieval and database response
  - Examine web page response after acquisition of information from database
2. Presentation of user's posts
  - Assess database response to the gathering mechanism of a user's posts
  - Examine retrieval query behavior
  - Verify successful text and media post display on profile page
3. Tag, followed, follows, and group display
  - Note: To be verified in unison with previous procedure
  - Test for appropriate query selection and information retrieval from database
  - Ascert correct information presentation in according profile page sections
  
  
### Tradespace Ads

1. Ad loading
  - Examine database and server response to retrieval of ads
  - Ad display matches database information
2. Addition of ads to database
  - Test for successful query retrieval and insertion unto correct database tables
  - Verify appearance of ad in Tradespace page


### Addition of a Business, Group, and Event:

1. Creation of Business and Group pages
  - Verify correct retrieval of administrator id
  - Examine table generations and proper identifications in database


### Business Representation:

- Note: To be verified after an ___Addition of a Business___

1. Corresponding business information presentation
  - Assess database and server response to business id retrieval
  - Examine information gathered by database via query generation
  - Ascert correct information distribution
2. Display of business' post
  - Verify query reaction
  - Test extraction of all posts from database
  - Assess gathered information display unto web page
3. Following a business
  - Examine successful insertion of according "follow" table into database
