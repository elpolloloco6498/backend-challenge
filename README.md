

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

I have developped 4 api routes

### Flat Categories
```
http://localhost:3000/flat
```
### Categories with childrens
```
http://localhost:3000/childrens
```
### Categories with ancestors
```
http://localhost:3000/ancestors
```
### Categories with volumes
```
http://localhost:3000/volumes
```

In order to test the backend app you will need to enter the urls inside the search bar of your browser. You can also choose to use a tool like Postman or a curl command.
In your browser, under the Network tab you should see the api call.
You can expand the row and select Preview in order to visualize the json structure of the response.

<p align="center">
    <a href="#gh-dark-mode-only">
        <img src="https://cdn.digitaldrive.fr/corporate/logo-hd-white.png#gh-dark-mode-only" width="400" alt="Digital Value Logo" />
    </a>
    <a href="#gh-light-mode-only">
        <img src="https://cdn.digitaldrive.fr/corporate/logo-hd.png#gh-light-mode-only" width="400" alt="Digital Value Logo" />
    </a>
</p>

# Digital Value Backend Challenge

Welcome to the Digital Value Backend Challenge! Thank for your interest in participating in our selection process.

## Goal

The objective is to manipulate some data from an sqlite database and build an api to access it.

Each level of the challenge is based on top of the previous one, so you can leverage what you already did.

## Guidelines

- Clone the repo (do not fork it) and work on top of it
- Implement each level in ascending order
- Commit at the end of each level
- Provide instructions to run each level of the challenge
- Optionally, host the last level of the challenge

## Rules

- Use Node.js, you can use any frameworks or libs
- TypeScript is preferred but not required
- Use version control to deliver the test

## What will be evaluated?

- Clean, readable and well-organized code
- Compliance with guidelines and rules
- Logic used to write/build sql queries
- API routes design

Let's get started! Go to [First level](level1)

