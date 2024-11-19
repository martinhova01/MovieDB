// ***********************************************************
// This loads and makes the cypress-mongodb commands available.
// Create more commands in `./commands.ts` if needed.
//
// https://on.cypress.io/configuration
// ***********************************************************

import "./commands";
import { addCommands } from "cypress-mongodb/dist/index-browser";
addCommands();
