import { faker } from '@faker-js/faker'

const token = `${Cypress.env('trelloToken')}`
const key = `${Cypress.env('trelloKey')}`
// environment variables are called here and in the test files because, in the test files, we also have raw code so we can control the configuration of each context (we keep raw code of the test and custom commands of the steps not directly related). We could make only custom commands into the test files, however this way validation code lines would be located in custom commands file and I thinks this is no good practice.
// custom commands reduced 45% of number of lines of test files and improved legibility of tests. 
// hooks added more than 10% of number of lines of test files and improved legibility of tests. 
// hooks added more 10% of number of lines of test files and improved legibility of tests. 

Cypress.Commands.add('createBoard', (randomNumber) => {
    const board_name = 'myBoard123'
    cy.api({
        method: 'POST',
        url: '/1/boards/?name=' + board_name + '&key=' + key + '&token=' + token,
    }).then(response => {
        expect(response.status).to.eq(200)
        cy.log(JSON.stringify(response.body.name))
        cy.writeFile(`cypress/fixtures/testdata-${randomNumber}.json`, {
            "board_id": response.body.id
        })
    })
})

Cypress.Commands.add('deleteBoard', (randomNumber) => {
    cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
        const board_id = response.board_id;
        cy.log(board_id);
        cy.api({
            method: 'DELETE',
            url: '/1/boards/' + board_id + '?key=' + key + '&token=' + token,
        }).then(response => {
            expect(response.status).to.eq(200);
        })
    })
})

Cypress.Commands.add('createList', (randomNumber) => {
    cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
        const board_id = response.board_id;
        cy.log(board_id);
        const list_name = 'myList666'
        cy.api({
            method: 'POST',
            url: '/1/boards/' + board_id + '/lists?name=' + list_name + '&key=' + key + '&token=' + token,
        }).then(response => {
            expect(response.status).to.eq(200)
            cy.log(JSON.stringify(response.body.name))
            cy.writeFile(`cypress/fixtures/testdata-${randomNumber}.json`, {
                // Wwrite again board_id since the command above will not add the list_id into the file, but rewrite it, so board id will be lost. Can do this or write other file.
                "board_id": board_id,
                "list_id": response.body.id
            })
        })
    })
})

Cypress.Commands.add('createCard', (randomNumber) => {
    cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
        const list_id = response.list_id;
        const board_id = response.board_id;
        cy.log(list_id);
        cy.api({
            method: 'POST',
            url: '/1/cards?idList=' + list_id + '&key=' + key + '&token=' + token,
            body: {
                name: "myCard1"
            }
        }).then(response => {
            expect(response.status).to.eq(200)
            cy.log(JSON.stringify(response.body.name))
            cy.writeFile(`cypress/fixtures/testdata-${randomNumber}.json`, {
                // Wwrite again board_id since the command above will not add the list_id into the file, but rewrite it, so board id will be lost. Can do this or write other file.
                "card_id": response.body.id,
                "board_id": board_id,
                "list_id": list_id
            })
        })
    })
})

Cypress.Commands.add('deleteCard', (randomNumber) => {
    cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
        const card_id = response.card_id;
        cy.log(card_id);
        cy.api({
            method: 'DELETE',
            url: '/1/cards/' + card_id + '?key=' + key + '&token=' + token,
        }).then(response => {
            expect(response.status).to.eq(200)
        })
    })
})

Cypress.Commands.add('createChecklist', (randomNumber) => {
    cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
        const card_id = response.card_id;
        const board_id = response.board_id;
        const list_id = response.list_id;
        // Don't need board_id and list_id here in this command, but I call them anyway because I will need them in the deleteList and deleteBoard commands since I'll not write testadata.json fixture file anymore
        cy.log(card_id);
        cy.api({
            method: 'POST',
            url: '/1/checklists?idCard=' + card_id + '&key=' + key + '&token=' + token,
            body: {
                name: "myChecklist1"
            }
        }).then(response => {
            expect(response.status).to.eq(200)
            cy.log(JSON.stringify(response.body.name))
            cy.writeFile(`cypress/fixtures/testdata-${randomNumber}.json`, {
                // Wwrite again board_id and list_id since the command above will not add the list_id into the file, but rewrite it, so board id will be lost. Can do this or write other file.
                "checklist_id": response.body.id,
                "card_id": card_id,
                "board_id": board_id,
                "list_id": list_id
            })
        })
    })
})

Cypress.Commands.add('deleteChecklist', (randomNumber) => {
    cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
        const checklist_id = response.checklist_id;
        cy.log(checklist_id);
        cy.api({
            method: 'DELETE',
            url: '/1/checklists/' + checklist_id + '?key=' + key + '&token=' + token,
        }).then(response => {
            expect(response.status).to.eq(200)
        })
    })
})

Cypress.Commands.add('deleteJsonFile', (randomNumber) => {
    cy.fsDeleteFile(`cypress/fixtures/testdata-${randomNumber}.json`)
})