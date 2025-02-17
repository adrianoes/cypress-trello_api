describe('/cards', () => {
    const token = `${Cypress.env('trelloToken')}`
    const key = `${Cypress.env('trelloKey')}`

    beforeEach(function () {        
        cy.createBoard()
        cy.createList()
    });

    afterEach(function () {             
        // Trello has provided no api request for deleting a list. Instead we will be deleting the whole board to keep the environment clean.
        cy.deleteBoard()
    });

    it('Create a new Card', () => {
        cy.readFile('cypress/fixtures/testdata.json').then(response => {
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
                cy.writeFile('cypress/fixtures/testdata.json', {
                    // Wwrite again board_id since the command above will not add the list_id into the file, but rewrite it, so board id will be lost. Can do this or write other file.
                    "card_id": response.body.id,
                    "board_id": board_id,
                    "list_id": list_id
                })               
            })
            cy.deleteCard()             
        })
    })

    it('Get a Card', () => {
        cy.createCard()
        cy.readFile('cypress/fixtures/testdata.json').then(response => {
            const card_id = response.card_id;
            cy.log(card_id);
            cy.api({
                method: 'GET',
                url: '/1/cards/' + card_id + '?key=' + key + '&token=' + token,
            }).then(response => {
                expect(response.status).to.eq(200)
                cy.log(JSON.stringify(response.body.name))
                cy.log(card_id)
            })
            cy.deleteCard() 
        })      
    })

    it('Update a Card - name', () => {
        cy.createCard()
        cy.readFile('cypress/fixtures/testdata.json').then(response => {
            const card_id = response.card_id;
            cy.log(card_id);
            cy.api({
                method: 'PUT',
                 url: '/1/cards/' + card_id + '?key=' + key + '&token=' + token,
                body: {
                    name: "myCard2"
                }
            }).then(response => {
                expect(response.status).to.eq(200)
                cy.log(JSON.stringify(response.body.name))
                cy.log(card_id)
            })
            cy.deleteCard() 
        })
    })    

    it('Delete a Card', () => {
        cy.createCard()
        cy.readFile('cypress/fixtures/testdata.json').then(response => {
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
})



