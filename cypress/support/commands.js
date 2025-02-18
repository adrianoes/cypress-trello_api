import { faker } from '@faker-js/faker'

const token = `${Cypress.env('trelloToken')}`
const key = `${Cypress.env('trelloKey')}`
// environment variables are called here and in the test files because, in the test files, we also have raw code so we can control the configuration of each context (we keep raw code of the test and custom commands of the steps not directly related). We could make only custom commands into the test files, however this way validation code lines would be located in custom commands file and I thinks this is no good practice.
// custom commands reduced 45% of number of lines of test files and improved legibility of tests. 
// hooks added more than 10% of number of lines of test files and improved legibility of tests. 
// hooks added more 10% of number of lines of test files and improved legibility of tests. 

Cypress.Commands.add('createBoard', (randomNumber) => {
    const board_name = faker.music.songName() // 'White Christmas'
    cy.api({
        method: 'POST',
        url: `/1/boards/?name=${board_name}&key=${key}&token=${token}`
    }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.name).to.eq(board_name)
        cy.log(JSON.stringify(response.body.name))
        cy.writeFile(`cypress/fixtures/testdata-${randomNumber}.json`, {
            "board_id": response.body.id,
            "board_name": response.body.name
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
        const board_name = response.board_name;
        const list_name = faker.music.songName();
        cy.log(board_id);
        cy.api({
            method: 'POST',
            url: `/1/boards/${board_id}/lists?name=${list_name}&key=${key}&token=${token}`,
        }).then(response => {
            expect(response.status).to.eq(200) 
            expect(response.body.idBoard).to.eq(board_id) 
            expect(response.body.name).to.eq(list_name)
            cy.log(JSON.stringify(response.body.name))
            cy.writeFile(`cypress/fixtures/testdata-${randomNumber}.json`, {
                "board_id": board_id,
                "board_name": board_name, 
                "list_id": response.body.id,
                "list_name": list_name
            })
        })
    })
})

Cypress.Commands.add('createCard', (randomNumber) => {
    cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
        const list_id = response.list_id;
        const board_id = response.board_id;
        const card_name = faker.music.songName();
        cy.log(list_id);
        cy.api({
            method: 'POST',
            url: `/1/cards?idList=${list_id}&key=${key}&token=${token}`,
            body: {
                name: card_name 
            }
        }).then(response => {
            expect(response.status).to.eq(200) 
            expect(response.body.idBoard).to.eq(board_id) 
            expect(response.body.idList).to.eq(list_id) 
            expect(response.body.name).to.eq(card_name)
            cy.log(JSON.stringify(response.body.name))
            cy.writeFile(`cypress/fixtures/testdata-${randomNumber}.json`, {
                "card_id": response.body.id, 
                "board_id": board_id, 
                "list_id": list_id, 
                "card_name": card_name
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
        const checklist_name = faker.music.songName()
        cy.log(card_id);
        cy.api({
            method: 'POST',
            url: `/1/checklists?idCard=${card_id}&key=${key}&token=${token}`,
            body: {
                name: checklist_name
            }
        }).then(response => {
            expect(response.status).to.eq(200) 
            expect(response.body.idBoard).to.eq(board_id) 
            expect(response.body.idCard).to.eq(card_id) 
            expect(response.body.name).to.eq(checklist_name) 
            expect(response.body.id).to.exist                
            cy.log(JSON.stringify(response.body.name))
            cy.writeFile(`cypress/fixtures/testdata-${randomNumber}.json`, {
                "checklist_id": response.body.id,
                "checklist_name": checklist_name,
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