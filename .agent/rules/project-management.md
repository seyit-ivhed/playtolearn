---
trigger: always_on
---

Every time you complete a project development phase, always run all the tests to verify if we introduced a new regression. 

You can do that by running the following commands in the root directory

//For unit tests
npm run test

//For end-to-end tests
npx playwright test


If a test is broken, investigate whether it is outdated due to the introduction of a new feature or if we have introduced a regression.

