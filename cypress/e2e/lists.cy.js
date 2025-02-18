import { faker } from '@faker-js/faker'

describe('/lists', () => {
    const token = `${Cypress.env('trelloToken')}`
    const key = `${Cypress.env('trelloKey')}`

    it('Create a List on a Board', { tags: ['BASIC', 'FULL', 'LIST'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
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
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)    
    })

    it('Get a List', { tags: ['BASIC', 'FULL', 'LIST'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.createList(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const board_id = response.board_id;
            const list_id = response.list_id;
            const list_name = response.list_name;
            cy.log(list_id);
            cy.api({
                method: 'GET',
                url: `/1/lists/${list_id}?key=${key}&token=${token}`,
            }).then(response => {
                expect(response.status).to.eq(200) 
                expect(response.body.id).to.eq(list_id) 
                expect(response.body.name).to.eq(list_name) 
                expect(response.body.idBoard).to.eq(board_id)
                cy.log(JSON.stringify(response.body.name))
                cy.log(list_id)
            })
        })
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)    
    })

    it('Update a List - name', { tags: ['BASIC', 'FULL', 'LIST'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.createList(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const board_id = response.board_id;
            const list_id = response.list_id;
            const updated_list_name = faker.music.songName();
            cy.log(list_id);
            cy.api({
                method: 'PUT',
                url: `/1/lists/${list_id}?key=${key}&token=${token}`,
                body: {
                    "name": updated_list_name
                }
            }).then(response => {
                expect(response.status).to.eq(200) 
                expect(response.body.id).to.eq(list_id) 
                expect(response.body.name).to.eq(updated_list_name) 
                expect(response.body.idBoard).to.eq(board_id)
                cy.log(JSON.stringify(response.body.name))
            })                         
        })
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)     
    })
})




