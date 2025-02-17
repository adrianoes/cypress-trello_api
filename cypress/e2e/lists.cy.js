import { faker } from '@faker-js/faker'

describe('/lists', () => {
    const token = `${Cypress.env('trelloToken')}`
    const key = `${Cypress.env('trelloKey')}`

    it('Create a List on a Board', { tags: ['BASIC', 'FULL'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
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
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)    })

    it('Get a List', { tags: ['BASIC', 'FULL'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.createList(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const list_id = response.list_id;
            cy.log(list_id);
            cy.api({
                method: 'GET',
                url: '/1/lists/' + list_id + '?key=' + key + '&token=' + token,
            }).then(response => {
                expect(response.status).to.eq(200)
                cy.log(JSON.stringify(response.body.name))
                cy.log(list_id)
            })
        })
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)    })

    it('Update a List - name', { tags: ['BASIC', 'FULL'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.createList(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const list_id = response.list_id;
            cy.log(list_id);
            cy.api({
                method: 'PUT',
                url: '/1/lists/' + list_id + '?key=' + key + '&token=' + token,
                body: {
                    "name": "myList2"
                }
            }).then(response => {
                expect(response.status).to.eq(200)
                cy.log(JSON.stringify(response.body.name))
            })                         
        })
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)     
    })
})




