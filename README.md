# SPRINT: For Your Fastest Commute!


SPRINT is a personal navigation tool for every day commute which takes in your destination address and calculates whether driving or taking public transit would get you there faster. 

I decided to build this app because it solves an issue that many people face during their daily commute. Google maps will tell you how long it will take you to get to your destination by car but does not take bus arrival time into account when determining how long a trip via public transportation will get take. SPRINT solves that plus showing you your transit vehicles actual location so you can plan better and stop worrying about whether the bus will be on time or not. 

## Main Page

<img src="https://media.giphy.com/media/3ohhwgbxYPIxn0aanS/giphy.gif">

This page features a search bar for you to enter your destination, two icons that change colors to indicate whether taking public transit or driving would get you there faster, and real time bus icons showing you where exactly your next bus is located. 

## And It's Mobile-Friendly!

<img src=https://i.imgur.com/8fh53FY.jpg">

### Installation Steps to preview locally:

1. Clone this repo locally & cd into it
2. Run `yarn install`
3. Run `yarn start` to start up the react server
4. Check it out on localhost:3000!
5. You can always check it out on [Heroku](https://sprint-io.herokuapp.com/)

### Technologies:

1. React
2. JavaScript
3. CSS3
4. HTML5
5. Flexbox
6. Google Maps API
7. RESTbus API
8. Backend code @ https://github.com/NrupM/sprint:
  - Node.js
  - Express
  - Uber API (feature started but not yet supported)

## User Stories:

1. A user can enter a destination, get arrival times for both driving and public transit options and be shown an indicator as to which travel option would be faster at that time. 

## Wireframes & Future Features

### Main Page 

<img src="https://i.imgur.com/AEWz0y5.jpg" width="30px">

### User Authentication View

Original wireframes were built with the idea of having user authentication set up. I am still contemplating whether this would be a valuable feature to impliment. Maybe there is another way to save user specific bookmarks without having someone login each time they visit the app?? 

<img src="https://i.imgur.com/c2UpdmH.jpg" width="30px">


### Bookmarks & Uber View 

Future features would allow users to save frequent trips as bookmarks that they could later come back to upon re-entering the app. Another bonus feature would integrate the uber app and allow the user to select the driving icon to order their uber.

<img src="https://i.imgur.com/mTLzxfa.jpg" width="30px">

## Future Features

1. A user will be able to bookmark frequent trips
2. A user will be able to see the transit line name and direction for the real time vehicle markers
3. A user will be able to click on the car icon and be sent to Uber app to order a car 

## Links

- [Heroku](https://sprint-io.herokuapp.com/)
- [Backend](https://github.com/NrupM/sprint)