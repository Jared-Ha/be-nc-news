# Northcoders News API

Check out the hosted version of this API [here](https://be-nc-news-ywak.onrender.com/api/).

## Project Summary

Welcome to my NC-News API. This is the backend project I built during my coding bootcamp at Northcoders. It’s designed to mimic the backend of a site like Reddit, letting you retrieve, post, update, and delete articles and comments. The database is in PostgreSQL, and it uses node-postgres to interact with it.

You can find details about the API endpoints and their behavior at the hosted version [here](https://be-nc-news-ywak.onrender.com/api/).

## How to Install the Repo Locally on Your PC

- Clone the repo using `git clone https://github.com/Jared-Ha/be-nc-news`
- `cd` into the new local repo directory
- Install dependencies by running the terminal command `npm install`
- Set up your test and development databases by creating 2 .env files, namely `.env.development` and `.env.test`, containing respectively:
  - `.env.development`: `PGDATABASE=nc_news`
  - `.env.test`: `PGDATABASE=nc_news_test`
  - Ensure these files are included in your `.gitignore` file
- Set up and seed the databases by running the commands:
  - `npm run setup-dbs`
  - `npm run seed`
- The app testing file reseeds the test database before app each test. Run the following terminal commands to test functionality:
  - `npm test app` to test endpoint functionality
  - `npm test utils` to test the utility functions
  - Or simply use `npm test` to run both test suites

## Minimum Required Versions of Node.js & PostgreSQL

- **Node**: v22.2.0 or higher
- **PostgreSQL**: v16.3 or higher

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
