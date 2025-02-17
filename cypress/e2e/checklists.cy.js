import { faker } from '@faker-js/faker'

describe('/checklists', () => {
    const token = `${Cypress.env('trelloToken')}`
    const key = `${Cypress.env('trelloKey')}`

    it('Create a Checklist', { tags: ['BASIC', 'FULL', 'CHECKLIST'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.createList(randomNumber)
        cy.createCard(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const card_id = response.card_id;
            const board_id = response.board_id;
            const list_id = response.list_id;
            // Don't need board_id and list_id here in this command, but delete custom commands don't write files here (by choice) so I call them anyway because I will need them in the deleteList and deleteBoard commands since I'll not write testadata.json fixture file anymore
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
        cy.deleteChecklist(randomNumber)
        cy.deleteCard(randomNumber)           
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)    
    })   

    it('Get a Checklist', { tags: ['BASIC', 'FULL', 'CHECKLIST'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.createList(randomNumber)
        cy.createCard(randomNumber)
        cy.createChecklist(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const checklist_id = response.checklist_id;
            cy.log(checklist_id);
            cy.api({
                method: 'GET',
                url: '/1/checklists/' + checklist_id + '?key=' + key + '&token=' + token,
            }).then(response => {
                expect(response.status).to.eq(200)
                cy.log(JSON.stringify(response.body.name))
                cy.log(checklist_id)
            })          
        })
        cy.deleteChecklist(randomNumber)
        cy.deleteCard(randomNumber)           
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)    
    })

    it('Update a Checklist - name', { tags: ['BASIC', 'FULL', 'CHECKLIST'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.createList(randomNumber)
        cy.createCard(randomNumber)
        cy.createChecklist(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const checklist_id = response.checklist_id;
            cy.log(checklist_id);
            cy.api({
                method: 'PUT',
                url: '/1/checklists/' + checklist_id + '?key=' + key + '&token=' + token,
                body: {
                    name: "Checklist2"
                }
            }).then(response => {
                expect(response.status).to.eq(200)
                cy.log(JSON.stringify(response.body.name))
                cy.log(checklist_id)
            })           
        })  
        cy.deleteChecklist(randomNumber)
        cy.deleteCard(randomNumber)           
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)    
    })

    it('Delete a Checklist', { tags: ['BASIC', 'FULL', 'CHECKLIST'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.createList(randomNumber)
        cy.createCard(randomNumber)
        cy.createChecklist(randomNumber)
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
        cy.deleteCard(randomNumber)           
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)    
    })
})