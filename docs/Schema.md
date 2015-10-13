#Schema Codes


##Business Page


businessPage
  
	CREATE TABLE businesspage
	(
	  name character varying(40),
	  about character varying(40),
	  photo_path character varying(500),
	  user_id integer,
	  business_id serial NOT NULL,
	  CONSTRAINT businesspage_pkey PRIMARY KEY (business_id),
	  CONSTRAINT businesspage_user_id_fkey FOREIGN KEY (user_id)
		  REFERENCES uuser (user_id) MATCH SIMPLE
		  ON UPDATE NO ACTION ON DELETE CASCADE
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE businesspage
	  OWNER TO nhtxclclofbeab;

	
##Comment


comment
   
	CREATE TABLE comment
	(
	  post_id integer NOT NULL,
	  data character varying(140),
	  user_id serial NOT NULL,
	  CONSTRAINT comment_user_id_fkey FOREIGN KEY (user_id)
		  REFERENCES uuser (user_id) MATCH SIMPLE
		  ON UPDATE NO ACTION ON DELETE CASCADE
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE comment
	  OWNER TO nhtxclclofbeab;

		
	
##Event

 
event
  
	CREATE TABLE event
	(
	  event_id integer NOT NULL,
	  location character varying(80),
	  description character varying(140),
	  privacy character varying(2),
	  administrator_id integer,
	  start_time timestamp with time zone,
	  end_time timestamp with time zone,
	  date date,
	  name character varying,
	  CONSTRAINT event_pkey PRIMARY KEY (event_id),
	  CONSTRAINT event_administrator_id_fkey FOREIGN KEY (administrator_id)
		  REFERENCES uuser (user_id) MATCH SIMPLE
		  ON UPDATE NO ACTION ON DELETE CASCADE
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE event
	  OWNER TO nhtxclclofbeab;


event_confirmation
  
	CREATE TABLE event_confirmation
	(
	  event_id integer NOT NULL,
	  user_id integer NOT NULL,
	  type_confirmation character varying(2) NOT NULL,
	  CONSTRAINT event_confirmation_pkey PRIMARY KEY (event_id, user_id, type_confirmation),
	  CONSTRAINT event_confirmation_user_id_fkey FOREIGN KEY (user_id)
		  REFERENCES uuser (user_id) MATCH SIMPLE
		  ON UPDATE NO ACTION ON DELETE CASCADE
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE event_confirmation
	  OWNER TO nhtxclclofbeab;

	
	
##Follow

follow
  
	CREATE TABLE follow
	(
	  follower_id integer NOT NULL,
	  followed_id integer NOT NULL,
	  CONSTRAINT follow_pkey PRIMARY KEY (follower_id, followed_id),
	  CONSTRAINT follow_followed_id_fkey FOREIGN KEY (followed_id)
		  REFERENCES uuser (user_id) MATCH SIMPLE
		  ON UPDATE NO ACTION ON DELETE CASCADE,
	  CONSTRAINT follow_follower_id_fkey FOREIGN KEY (follower_id)
		  REFERENCES uuser (user_id) MATCH SIMPLE
		  ON UPDATE NO ACTION ON DELETE CASCADE
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE follow
	  OWNER TO nhtxclclofbeab;

	
##Group

ggroup


	CREATE TABLE ggroup
	(
	  group_id integer NOT NULL,
	  name character varying(40),
	  description character varying(140),
	  group_administrator integer,
	  CONSTRAINT mvgroup_pkey PRIMARY KEY (group_id),
	  CONSTRAINT ggroup_group_administrator_fkey FOREIGN KEY (group_administrator)
		  REFERENCES uuser (user_id) MATCH SIMPLE
		  ON UPDATE NO ACTION ON DELETE NO ACTION
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE ggroup
	  OWNER TO nhtxclclofbeab;


group_membership

   CREATE TABLE group_membership
	(
	  group_id integer NOT NULL,
	  user_id integer NOT NULL,
	  CONSTRAINT group_memberip_pkey PRIMARY KEY (group_id, user_id),
	  CONSTRAINT group_membership_group_id_fkey FOREIGN KEY (group_id)
		  REFERENCES ggroup (group_id) MATCH SIMPLE
		  ON UPDATE NO ACTION ON DELETE CASCADE,
	  CONSTRAINT group_membership_group_id_fkey1 FOREIGN KEY (group_id)
		  REFERENCES ggroup (group_id) MATCH SIMPLE
		  ON UPDATE NO ACTION ON DELETE CASCADE
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE group_membership
	  OWNER TO nhtxclclofbeab;



##Media


media_event

	CREATE TABLE media_event
	(
	  event_id integer NOT NULL,
	  path character varying NOT NULL,
	  CONSTRAINT media_event_pkey PRIMARY KEY (event_id, path)
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE media_event
	  OWNER TO nhtxclclofbeab;



media_post

  
	CREATE TABLE media_post
	(
	  post_id integer,
	  media_id serial NOT NULL,
	  media_type character(1),
	  media_path character varying,
	  CONSTRAINT media_post_pkey PRIMARY KEY (media_id),
	  CONSTRAINT media_post_post_id_fkey FOREIGN KEY (post_id)
		  REFERENCES post (post_id) MATCH SIMPLE
		  ON UPDATE NO ACTION ON DELETE NO ACTION
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE media_post
	  OWNER TO nhtxclclofbeab;


media_trade

	CREATE TABLE media_trade
	(
	  trade_id integer,
	  media_path character varying,
	  media_type character(1),
	  media_id serial NOT NULL,
	  CONSTRAINT media_trade_pkey PRIMARY KEY (media_id),
	  CONSTRAINT media_trade_trade_id_fkey FOREIGN KEY (trade_id)
		  REFERENCES trade_post (trade_id) MATCH SIMPLE
		  ON UPDATE NO ACTION ON DELETE NO ACTION
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE media_trade
	  OWNER TO nhtxclclofbeab;

		
	
##Notification


notification

	CREATE TABLE notification
	(
	  notification_id integer NOT NULL,
	  data character varying(140),
	  user_id integer,
	  notification_type integer,
	  CONSTRAINT notification_pkey PRIMARY KEY (notification_id),
	  CONSTRAINT notification_user_id_fkey FOREIGN KEY (user_id)
		  REFERENCES uuser (user_id) MATCH SIMPLE
		  ON UPDATE NO ACTION ON DELETE NO ACTION
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE notification
	  OWNER TO nhtxclclofbeab;

		
	
##Post


post

	CREATE TABLE post
	(
	  post_id integer NOT NULL,
	  user_id integer,
	  post_data character varying(140),
	  date_time timestamp without time zone,
	  CONSTRAINT post_pkey PRIMARY KEY (post_id),
	  CONSTRAINT post_user_id_fkey FOREIGN KEY (user_id)
		  REFERENCES uuser (user_id) MATCH SIMPLE
		  ON UPDATE NO ACTION ON DELETE NO ACTION
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE post
	  OWNER TO nhtxclclofbeab;

		
post_like
  
	CREATE TABLE post_like
	(
	  post_id integer NOT NULL,
	  liked_by_id integer NOT NULL,
	  CONSTRAINT post_like_pkey PRIMARY KEY (post_id, liked_by_id),
	  CONSTRAINT post_like_liked_by_id_fkey FOREIGN KEY (liked_by_id)
		  REFERENCES uuser (user_id) MATCH SIMPLE
		  ON UPDATE NO ACTION ON DELETE NO ACTION
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE post_like
	  OWNER TO nhtxclclofbeab;


	
##Tags


tag_business
  
    CREATE TABLE tag_busines
	(
	  business_id integer,
	  tag_id serial NOT NULL,
	  data character varying,
	  CONSTRAINT tag_busines_pkey PRIMARY KEY (tag_id),
	  CONSTRAINT tag_busines_business_id_fkey FOREIGN KEY (business_id)
		  REFERENCES businesspage (business_id) MATCH SIMPLE
		  ON UPDATE NO ACTION ON DELETE NO ACTION
	)
	
tag_group
 
	CREATE TABLE tag_group
	(
	  tag_id serial NOT NULL,
	  group_id integer,
	  data character varying,
	  CONSTRAINT tag_group_pkey PRIMARY KEY (tag_id),
	  CONSTRAINT tag_group_group_id_fkey FOREIGN KEY (group_id)
		  REFERENCES ggroup (group_id) MATCH SIMPLE
		  ON UPDATE NO ACTION ON DELETE NO ACTION
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE tag_group
	  OWNER TO nhtxclclofbeab;


tag_post

	CREATE TABLE tag_post
	(
	  tag_id serial NOT NULL,
	  post_id integer,
	  data character varying,
	  CONSTRAINT tag_post_pkey PRIMARY KEY (tag_id),
	  CONSTRAINT tag_post_post_id_fkey FOREIGN KEY (post_id)
		  REFERENCES post (post_id) MATCH SIMPLE
		  ON UPDATE NO ACTION ON DELETE NO ACTION
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE tag_post
	  OWNER TO nhtxclclofbeab;

	 

tag_trades

	CREATE TABLE tag_trades
	(
	  tag_id serial NOT NULL,
	  trade_id integer,
	  data character varying(40),
	  CONSTRAINT tag_id PRIMARY KEY (tag_id),
	  CONSTRAINT tag_trades_trade_id_fkey FOREIGN KEY (trade_id)
		  REFERENCES trade_post (trade_id) MATCH SIMPLE
		  ON UPDATE NO ACTION ON DELETE NO ACTION
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE tag_trades
	  OWNER TO nhtxclclofbeab;

	 
tag_user

	REATE TABLE tag_user
	(
	  tag_id serial NOT NULL,
	  data character varying,
	  group_id integer,
	  CONSTRAINT tag_user_pkey PRIMARY KEY (tag_id),
	  CONSTRAINT tag_user_group_id_fkey FOREIGN KEY (group_id)
		  REFERENCES ggroup (group_id) MATCH SIMPLE
		  ON UPDATE NO ACTION ON DELETE NO ACTION
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE tag_user
	  OWNER TO nhtxclclofbeab;

	  
##Trade Space


trade_post

	CREATE TABLE trade_post
	(
	  trade_id integer NOT NULL,
	  user_id integer,
	  trade_description character varying(140),
	  price double precision,
	  phone character varying,
	  CONSTRAINT trade_post_pkey PRIMARY KEY (trade_id),
	  CONSTRAINT trade_post_user_id_fkey FOREIGN KEY (user_id)
		  REFERENCES uuser (user_id) MATCH SIMPLE
		  ON UPDATE NO ACTION ON DELETE NO ACTION
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE trade_post
	  OWNER TO nhtxclclofbeab;



##User


uuser
  
   	CREATE TABLE uuser
	(
	  user_id integer NOT NULL,
	  first_name character varying(40),
	  last_name character varying(40),
	  email character varying(40),
	  password character varying(30),
	  photo_path character varying(500),
	  CONSTRAINT mvuser_pkey PRIMARY KEY (user_id)
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE uuser
	  OWNER TO nhtxclclofbeab;



