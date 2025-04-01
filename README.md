# cypress-trello_api

API testing in [trello api](https://developer.atlassian.com/cloud/trello/rest/). Good practices such as hooks, custom commands and tags, among others, are used. All the necessary support documentation to develop this project is placed here. Although custom commands are used, the assertion code to each test is kept in it so we can work independently in each test. It creates one .json file for each test so we can share data between different requests in the test. The .json file is excluded after each test execution.  

# Pre-requirements:

| Requirement                   | Version | Note                                                            |
| :---------------------------- |:--------| :---------------------------------------------------------------|
| Node.js                       | 18.18.0 | -                                                               |
| npm                           | 10.2.4  | -                                                               |
| Yarn                          | 1.22.19 | Optional.                                                       |
| Cypress                       | 13.10.0 | -                                                               |
| Cypress-fs                    | 0.2.5   | -                                                               |
| cypress-parallel              | 0.14.0  | Optional.                                                       |
| Visual Studio Code            | 1.89.1  | Optional. Recommended so you can use Cypress Helper extension.  |
| @cypress/grep                 | 4.0.2   | Optional. Recommended so you can filter the tests by tags       |
| Cypress Helper                | v1.2.2  | Optional.                                                       |
| cypress-plugin-api            | 2.11.1  | Optional. Recommended so you can observe API traces in browser. |
| @faker-js/faker               | 8.4.1   | Optional. Recommended so you will not be using same test data.  |
| mochawesome                   | 7.1.3   | Optional.                                                       |

# Installation:

- See [Trello home](https://trello.com/home), create an account and log in. See [Power-Ups](https://trello.com/power-ups/admin) and hit :point_right:**New**. Input a name, select the workspace, input the account e-mail, support e-mail and author name. Hit :point_right:**Create**, :point_right:**Generate a new API key**, :point_right:**Generate API key** to create an trello API key. Save it in somewhere safe. Hit :point_right:**<ins>Token</ins>** and :point_right:**Allow** to create a trello token. Save it in somewhere safe.
- See [Node.js page](https://nodejs.org/en) and install the aforementioned Node.js version. Keep all the preferenced options as they are.
- To use yarn packet manager, open windows prompt as admin and execute ```corepack enable``` (Optional).
- Execute ```yarn init``` to start a project.
  - Input the project name or keep it as the fodler name.
  - Input the project version or keep it as it is (1.0.0).
  - Input the project description or keep it blank.
  - Input the project repository or keep it blank.
  - Input the project author name or keep it blank.
  - Input the project license or keep it as it is (MIT).
  - Input "true" or "false" to select the privacy of the project in private option or keep it as it is (by default, if answer given to question private is passed in as empty, the private key will not be added to package.json).
- See [Visual Studio Code page](https://code.visualstudio.com/) and install the latest VSC stable version. Keep all the prefereced options as they are until you reach the possibility to check the checkboxes below: 
  - :white_check_mark: Add "Open with code" action to Windows Explorer file context menu. 
  - :white_check_mark: Add "Open with code" action to Windows Explorer directory context menu.
Check then both to add both options in context menu.
- Look for Cypress Helper in the extensions marketplace and install the one from Oleksandr Shevtsov.
- Execute ```npm i cypress-plugin-api -D``` to install cypress api plugin.
- Execute ```npm install @faker-js/faker --save-dev``` to install faker library.
- Execute ```npm i -D @cypress/grep``` to install @cypress/grep.
- Execute ```npm install cypress-fs --save-dev``` to install Cypress-fs.
- Execute ```npm i cypress-parallel``` to install cypress-parallel plugin.
- Execute ```npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator``` to install mochawesome reporter.
- Execute ```npx cypress open``` to open cypress.
- Hit :point_right:**E2E Testing** configuration option. 
- Keep all the configuration files options checked and hit :point_right:**Continue**.
- Choose a browser (chrome was used here to develop the test cases) and hit :point_right:**Start E2E Testing in Chrome**.
- Hit :point_right:**Scaffold example specs**, so you can be provided with examples that might be useful.
- Hit :point_right:**Okay, I got it!**. Choose a spec and click it to run it to be sure that cypress is running and working fine. You can now develop your tests.

# Tests:

- Execute ```yarn cypress open``` or ```npx cypress open``` to open cypress app and execute step by step, being able to debug the execution. 
- Execute ```yarn cypress run``` or ```npx cypress run``` to execute cypress in headless mode.
- Execute ```CYPRESS_grepTags=BASIC yarn cypress run``` to execute cypress tests tagged as "BASIC".
- Execute ```CYPRESS_grepTags=NEGATIVE yarn cypress run``` to execute cypress tests tagged as "NEGATIVE".
- Execute ```CYPRESS_grepTags=CHECKLIST+BOARD yarn cypress run``` to execute cypress tests tagged as both "CHECKLIST" and "BOARD".
- Execute ```CYPRESS_grepTags=NEGATIVE,CARD yarn cypress run``` to execute cypress tests tagged as "NEGATIVE" or "CARD".
- Execute ```npm run cy:parallel``` to execute cypress tests in parallel.
- Execute ```npx cypress run``` to execute cypress tests and then execute ```npx mochawesome-merge cypress/reports/*.json > cypress/reports/merged-report.json``` and ```npx marge cypress/reports/merged-report.json -o cypress/reports --inline``` to merge the individual test suite reports in a .json file and generate .html report respectively. 

# Support:

- [yarn init documentation page](https://classic.yarnpkg.com/lang/en/docs/cli/init/)
- [expandtesting API documentation page](https://practice.expandtesting.com/notes/api/api-docs/)
- [expandtesting API demonstration page](https://www.youtube.com/watch?v=bQYvS6EEBZc)
- [Faker](https://fakerjs.dev/guide/)
- [Cypress Table of Contents](https://docs.cypress.io/api/table-of-contents)
- [cypress-io/github-action](https://www.npmjs.com/package/@cypress/github-action#end-to-end-testing)
- [Cypress: store value in a variable](https://stackoverflow.com/questions/69977821/cypress-store-value-in-a-variable)
- [Working With Variables In Cypress Tests](https://www.stevenhicks.me/blog/2020/02/working-with-variables-in-cypress-tests/)
- [How to Test an Application that Changes a CSS Variable](https://www.cypress.io/blog/2020/03/17/how-to-test-an-application-that-changes-css-variable)
- [A Practical Guide to Intercepting Network Requests in Cypress](https://egghead.io/blog/intercepting-network-requests-in-cypress)
- [Cypress IO- Writing a For Loop [closed]](https://stackoverflow.com/questions/52212868/cypress-io-writing-a-for-loop)
- [Learn Cypress.io the Hard Way: Case-Insensitive](https://iterable.com/blog/learn-cypress-io-the-hard-way-case-insensitive/)
- [@cypress/grep](https://www.npmjs.com/package/@cypress/grep)
- [Cypress-fs](https://www.npmjs.com/package/cypress-fs)
- [How to use a module 'fs' in Cypress?](https://stackoverflow.com/a/77250696/10519428)
- [cypress-parallel](https://www.npmjs.com/package/cypress-parallel)
- [mochawesome](https://github.com/adamgruber/mochawesome?tab=readme-ov-file)
- [encodeURIComponent()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
- [String.prototype.replace()](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
- [basic writing and formatting syntax](https://docs.github.com/pt/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)

# Tips:

- UI and API tests to send password reset link to user's email and API tests to verify a password reset token and reset a user's password must be tested manually as they rely on e-mail verification.
- In order to escape call back hell, each response has its assertion data saved in a .json file. This data is then called in a custom command. In order to call the righ .json file when dealing with paralel tests, a random number is assigned to each test. There is no way to connect the random number from a hook to the code in the body of the test. 
