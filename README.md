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

- See `db.js` --> MongoDB stores information per-user session 

#Research Topics

This webapp is build for NYU's [Applied Internet Technology course](http://foureyes.github.io/csci-ua.0480-spring2016-010/).

- (3 points) Integrate user authentication: See 'login.hbs' and 'signup.hbs' for more info. (And 'index.js' for more routes)

- (1 points) using a CSS preprocesser (LESS)

- (2 point) Per external API used --> Google Charts

...for 6 points total

#Grading

- 5 route handers (see `index.js`): `/shows`, `/shows/add`, `/visualize`, `/logout`, `/update`

- Mongoose Schemas (see `db.js`): `User`, `Show` 

- 3 forms (see `/views`): One form in `add.hbs` (which uses server-side validation), and two forms in `update.hbs`, 

- Use at least 2 of any of the following (can be the same): Constructors, Object.create, Prototypes, map, reduce, filter, forEach


#Tips

- To play around with the data, enter in a birthdate that was just a few days ago (life percentages will increase)


