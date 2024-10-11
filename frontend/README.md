# Documentation project 2 - Group 26

Website: <http://it2810-26.idi.ntnu.no/project2/>

Repository: <https://git.ntnu.no/IT2810-H24/T26-Project-2>

## Usage

The following commands should be run in the `T26-Project-2/frontend` directory:

- `npm install` to install dependencies.
- `npm run dev` to start the development server
- `npm run prettier` to check code formatting
  - `npm run prettier:fix` to fix formatting
- `npm run lint` to check for linting errors
  - `npm run lint:fix` to fix auto fixable linting errors
- `npm test` to run all tests
- `npm run build` to build the project
  - it will be built in the `dist` folder

## MovieDB

MovieDB is a website for browsing through a wide variety of movies. Current features include:

- A feed of movies
- Detailed movie information pages
- Search (temporary solution)
- Sorting and filtering  (temporary solution)
- Reviews (temporary solution)
- Simple user handling (temporary solution)

Naturally, this will expand as we continue our work on the project.

## Choices

As this is not the final submission, our project is not yet finished. For now, we've used a mock dataset for our application, which will later be chaged out with our database. In order to minimize the amount of refactoring needed later, we have decided to limit the complexity of the logic implemented now. We still wanted to have some logic in order to get a good feel for the application, so we've tried to find a middleground. Making it impossible to filter to no results is for example something we'll handle later.

Global state management is also something we've decided to postpone until the backend is set up, again to limit the refactoring work. Therefore, we've some places had to use sessionStorage and localStorage to communicate states. This will naturally be changed when we set up the global state management. However, sessionStorage is also used to remember filtering, sorting and search during a session. Currently, localStorage is used to store the username and reviews.

We've used UI components from shadcn, as it allows us to copy and paste components directly into our project. This gives us more flexibility and control over the components, and gives us the oppertunity to for example change styling to meet our desires. It also allows us to include only the components we need, resulting in a smaller bundle size and faster load times.
