import { faker } from '@faker-js/faker'

describe('/cards', () => {
    const token = `${Cypress.env('trelloToken')}`
    const key = `${Cypress.env('trelloKey')}`

    it('Create a new Card', { tags: ['BASIC', 'FULL', 'CARD'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.createList(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const list_id = response.list_id
            const board_id = response.board_id
            const card_name = faker.music.songName()
            cy.log(list_id)
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
                expect(encodeURIComponent(response.body.name)).to.eq(encodeURIComponent(card_name))
                cy.log(JSON.stringify(response.body.name))
                cy.writeFile(`cypress/fixtures/testdata-${randomNumber}.json`, {
                    "card_id": response.body.id, 
                    "board_id": board_id, 
                    "list_id": list_id, 
                    "card_name": card_name
                })               
            })                         
        })
        cy.deleteCard(randomNumber)
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)    
    })

    it('Get a Card', { tags: ['BASIC', 'FULL', 'CARD'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.createList(randomNumber)
        cy.createCard(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const card_id = response.card_id
            const board_id = response.board_id
            const list_id = response.list_id
            const card_name = response.card_name
            cy.log(card_id)
            cy.api({
                method: 'GET',
                url: `/1/cards/${card_id}?key=${key}&token=${token}`,
            }).then(response => {
                expect(response.status).to.eq(200) 
                expect(response.body.idBoard).to.eq(board_id) 
                expect(response.body.idList).to.eq(list_id) 
                expect(encodeURIComponent(response.body.name)).to.eq(encodeURIComponent(card_name))
                expect(response.body.id).to.eq(card_id)
                cy.log(JSON.stringify(response.body.name))
                cy.log(card_id)
            })
        }) 
        cy.deleteCard(randomNumber)
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)    
    })

    it('Update a Card - name', { tags: ['BASIC', 'FULL', 'CARD'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.createList(randomNumber)
        cy.createCard(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const card_id = response.card_id
            const board_id = response.board_id
            const list_id = response.list_id
            const updated_card_name = faker.music.songName() // 'White Christmas' 
            cy.log(card_id)
            cy.api({
                method: 'PUT',
                url: `/1/cards/${card_id}?key=${key}&token=${token}`,
                body: {
                    name: updated_card_name
                }
            }).then(response => {
                expect(response.status).to.eq(200) 
                expect(response.body.idBoard).to.eq(board_id) 
                expect(response.body.idList).to.eq(list_id) 
                expect(encodeURIComponent(response.body.name)).to.eq(encodeURIComponent(updated_card_name)) 
                expect(response.body.id).to.eq(card_id)                
                cy.log(JSON.stringify(response.body.name))
                cy.log(card_id)
            })
        })
        cy.deleteCard(randomNumber)
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)    
    })    

    it('Delete a Card', { tags: ['BASIC', 'FULL', 'CARD'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.createList(randomNumber)
        cy.createCard(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const card_id = response.card_id
            cy.log(card_id)
            cy.api({
                method: 'DELETE',
                url: `/1/cards/${card_id}?key=${key}&token=${token}`,
            }).then(response => {
                expect(response.status).to.eq(200)
            })
        })
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)    
    })    
})



