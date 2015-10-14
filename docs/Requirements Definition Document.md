#MusicVenue
###Sprint 0

***The CoffeeSquad Team:***

    Reynaldo Belfort Pierrilus (Project Manager)

    Tania A. Hernández Colón

    Leslie Soto Vargas

- - - - 

**1. Introduction**

In the following document the reader can find all of the information pertaining to the function, development, and use of the social-network.
   
> **1.1 Purpose**

> The purpose of this document is to depict and provide a detailed description of the requirements and specifications of the social network to be developed to the interested parties.

> **1.2 Scope**

> The __MusicVenue__ is a web-based social network dedicated to creating a community of musicians who can share their creations with the world under an artistic environment while also providing them with space to publish announcements with those who follow them. 

> Musicians can link their work in audio and video formats to their profile via alternate web pages, giving other users the opportunity to enjoy their creations. The user can share other content, such as events and sales, as well as basic information about their musical background.

> Another key component to __MusicVenue__ is the ability users have to follow musicians whom they are interested in, where the user will receive notifications about any new uploads and announcements. In order to create an event, the administrator of the entity must abide by basic CRUD operations. Under events, information such as the location in which it will take place, the date, attendance, and the amount of privacy involved will be displayed.

> **1.3 Key Concepts**

>> **1.3.1 Terms**


>> Term: Definition

>> User: Someone who utilizes the social network.

>> Web-Based: An application or program that is accessed over a network connection using HTTP.

>> Entity: Group or event.

>>  Event: An occurrence involving the presence of the musician or musicians.

>> Group: An assemblage of individuals in a band, choir, or other.

>> Organization: A business dedicated to promote or venture musicians.

>> Administrator: User in charge of managing an entity where the one who created it is the administrator by default.

>> Content: Can be a sound, visual reference or entity expressed through some medium or act.

>> Regular User: A musician or music enthusiastic.

>> Business/Organization: Group of people associated and/or organized for a line of work in terms of business transactions, promotions, and venues geared towards musical entertainment.

>> Board: Space in the user’s homepage that displays the posts shared by those followed.

>> TradeSpace: Space where users can advertise their products and/or offers following the CRUD methodology.

>> Available: Product or offer that is yet to be sold.

>> Chord progression: A series of music chords that are played one after the other repeatedly.

>> Administrative Requirement Rules: Set of rules set specifically for Administrators.

>> **1.3.2 Abbreviations**

>> SN: Social Network.

>> CRUD: Create, read, update, and delete.

>> ARR: Administrative Requirement Rules (see below for definition).

>> **1.3.3 Rules and Protocols**

>> Password Reset Protocol:

>> * The system will allow a maximum number of five (5) failed log-in attempts.

>> * Once the limit has been reached, the user will enter into an _Account Block State_ (__ABS__) where the system will prevent the user from logging in for a limited time.

>> * After the blocking time culminates, the account is unlocked and login attempts can be resumed.

>> * The following amount of times will be concurrently applied as the user keeps entering into the ABS:

>>  1. 2 minutes
>>  2. 15 minutes
>>  3. 35 minutes
>>  4. 1 hour

>> * After slipping into ABS for a fourth time, the user's account falls into a _permanent_ ABS where the user must contact the web application's support team for the retrieval of this permanent state

>> Administrative Rules Requirements (ARR):

>> * Entities must have at least one Administrator
>> * Administrators are allowed to perform CRUD operations on events
>> * Administrators can assign Administrative Duties to other users
>> * User who created the entity will, by default, be the Administrator
>> * Administrators may add media content, such as photos and videos, for promotion purposes

> **1. 4 Overview**

>A further description of the interactions, hierarchies, and system functionality of __MusicVenue__ can be found on the remainder of this document.

**2. Functional Requirements**

> **2.1 Essential Requirements**

> Main User Categories:

> * Regular User  
> * Business/Organization

> For All User Categories:

> * Use basic CRUD functionalities in order to maintain an up-to-date profile and events
> * Post content such as audio, music, text, and video
> * Share information in terms of musical skills, likes, and experiences
> * If user does not provide a profile picture, the system will set a default photo
> * Password management in terms of a password reset protocol and a forgotten password protocol

> Regular Users Only:
> * Can follow other Regular Users profiles
> * Can be followed back by other Users 
> * Can like posts

> Business/Organization Only:

> * The user can create a Business/Organization page.
> * Must provide a description of the entity to set up a profile.
> * Should be oriented to businesses based solely on musical contexts.
> * May view certain details about the users who interact with it.
> * Cannot like any type of post.

> Posting Options:

> * May include media and/or text.
> * Basic CRUD rules and categorization apply.
> * Users can comment and like posts.

> Follow Perks:

> * Users can follow other users.
> * Business/Organization user cannot follow anyone.
> * Following a user implies viewing said user’s posts in the Board

> Social Interactions:

>  * The Board page displays shared content.
>  * For Regular Users: Content shown comes fron users followed.
>  * TradeSpace advertisements include a title, a description of what is being offered, the category of the ad (tags); providing a picture and price is optional.

> Events:

> * Basic CRUD rules and categorization apply
> * Description of event include its name, presentation dates, location and tags. 
> * The administrator of the event can invite users to it.
> * May be private or public
> * Regular Users can mark their attendance as “Going”, “Maybe”, and “Not going” (this option available only for those users who have been invited if the event is private)
>  *Public: Any user can attend the event
>  *Private: Only the Administrator decide who is allowed an invitation to the event as well as which users can invite other users, including the amount of invitations granted
> * Notification is sent to users who have been invited to an event
> * Entity will follow the ARR rules.

> Groups:

> * Basic CRUD rules and categorization apply.
> * The administrator can add and remove members.
> * The group will be clasified with tags.
> * Entity will follow the ARR rules.
> * The Group page will be populated with the posts where the group name is used as tag.

> Search:

> * User can search by tags.

> **2.2 Desirable Requirements**

> Messaging:

> * Instant messaging among users via private channels with the appropriate permissions of both users

> **2.3 Optional Requirements**

> * Classify singer's voice type via a simple test

> * Pin-point an event location on a map using the physical address provided by the user

> * Tutorial on how to use __MusicVenue__

> * Mechanism to invite a friend to create an account

> * User will be able to upload and share guitar tabs

> * Jamming Riffs for regular users: A way of sharing chord progressions for jamming sessions from where  other users can interact with and elaborate. 

