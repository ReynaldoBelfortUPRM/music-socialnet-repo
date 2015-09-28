#Data Base

-----
##Tables

This photo presents the tables and this respective names created  in Heroku


![Regular Events Image](https://trello-attachments.s3.amazonaws.com/5608ceb80fb0dd1ba9219a8b/799x649/902d2d186972d9961594bd7307cf2a0c/DB_tables_names.PNG)


-----
#Schema

##User
  mvuser
  
    PRIMARY KEY (user_id) 
    mvuser(user_id: integer, first_name:string, middle_name:string, last_name:string ,email:string, password:string, photo_path:path)

##Business Page
  businessPage
  
    PRIMARY KEY (business_id)
    businessPage(business_id:integer, name:string, about:string, email:string, business_password:string, photo_path: path)

##Tags
  tag
  
    tag(tag_id:integer, owner_id:integer, owner_category:string, tag_data:string)
    PRIMARY KEY (tag_id, owner_id, owner_category)
  
##Follow
  follow
  
    PRIMARY KEY (follower_id , follower_category, followed_id, followed_category)
    follow(follower_id,follower_category, followed_id, followed_category)

##Group
  mvgroup
  
    PRIMARY KEY (group_id)
    group(group_id:integer, name:string, description:string)
  
  group_membership

    PRIMARY KEY (group_id, user_id)
    group_memberip( group_id:integer, user_id:integer)

##Post
  post
  
    PRIMARY KEY (post_id)
    post(post_id:integer, by_id:integer ,by_category:string, post_data:string, post_location:string, post_date:date)
  
  post_like
  
    PRIMARY KEY (post_id, liked_by_id, liked_by_category)
    post_like(post_id:integer, liked_by_id:integer, liked_by_category:string)

##Coment
  comment
  
    PRIMARY KEY(post_id, by_id, by_category)
    comment(post_id:integer,  by_id:integer, by_category:string, data:string)

##Notification
  notification

    PRIMARY KEY(notification_id)
    notification(notification_id:integer, data:string, to_id: integer, to_category:string notification_type:string)
  
##Event
  event
  
    PRIMARY KEY (event_id)
    event(event_id:integer, date_time:timestamp, location: string, description: string, privacy:string)

  event_administrator
  
    PRIMARY KEY (event_id, admin_id, admin_category, admin_privileges)
    event_administrators(event_id:integer, admin_id:integer, admin_category:string, admin_privileges:string)

  event_confirmation
  
    PRIMARY KEY (event_id, user_id, type_confirmation)
    event_confirmation(event_id:integer, user_id:integer, type_confimation:string)

##Trade Space

  trade_post

    PRIMARY KEY (trade_id) 
    trade_post(trade_id:integer,  owner_id:integer,owner_category:sting, trade_description:string)

  trade_phone
  
    PRIMARY KEY (trade_id, trade_pnum)
    trade_phone(trade_id, trade_phonenumber)

  trade_price
  
    PRIMARY KEY (trade_id, trade_price)
    trade_price(tride_id:integer, tride_price:money)

##Media

  media
  
    PRIMARY KEY (media_id)
    media(owner_id: integer, owner_category:string, media_id:integer, media_category:string, media_path)




