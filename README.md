#Netflix-Tracker

Webapp that keeps track of how much of your life is spent on Netflix.

To run: `node app.js`

Learn:

- What percentage of your time on Netflix is watching which specific shows.

- What percentage of your life you spend on Netflix in general.

- What percentage of your life you spend watching a specific show.

- Potentially more, tbd.

#How it Works

- Sign Up

- Add show stats as you watch 

- The app will parse the data and visualize how much time you spend Netflixing. Because this is important to know.

#Dependencies

- Express

- MongoDB

- Node

#Data Model

- See 'db.js' --> MongoDB stores information per-user session 

#Wireframes

![](public/imgs/screenshot.png)

#Site Map 

![](public/imgs/wireframe.JPG)

#Use Cases (Netflix user who...)

- _spend a lot of time on Netflix_: People who are interested in knowing how much of their life is spent watching Netflix. Later iterations of the probject can look at daily/weekly/monthly/yearly intervals. The point here is ultimately to contextualize just how much time is spent watching Netflix, relative to the rest of your life.

- _want to better understand their watching patters_: People who are interested in knowing how much they spend watching certain shows in comparison to others.  Netflix recommends shows based on the type of shows you've watched in the past, but there isn't a lot of clear evaluation of how much time you spend watching one show vs another.

- _want to have fun_: It's fun!

#Grading
- 5 route handers (see `index.js`): `/shows`, `/shows/add`, `/visualize`, `/logout`, `/update`

- Mongoose Schemas (see `db.js`): `User`, `Show` 

- 3 forms (see `/views`): Using JS (ajax) `add.hbs`, `update.hbs`, 

- Use at least 2 of any of the following (can be the same): Constructors, Object.create, Prototypes, map, reduce, filter, forEach

#Research Topics

This webapp is build for NYU's [Applied Internet Technology course](http://foureyes.github.io/csci-ua.0480-spring2016-010/).

- (3 points) Integrate user authentication: See 'login.hbs' and 'signup.hbs' for more info. (And 'index.js' for more routes)

- (1 points) using a CSS preprocesser (LESS)

- (2 point) Per external API used --> Google Charts

...for 6 points total

#Tips

- To play around with the data, enter in a birthdate that was just a few days ago (life percentages will increase)


