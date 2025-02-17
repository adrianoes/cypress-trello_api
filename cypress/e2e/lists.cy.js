describe('/lists', () => {
    const token = `${Cypress.env('trelloToken')}`
    const key = `${Cypress.env('trelloKey')}`

    beforeEach(function () {
        cy.createBoard()
    });

    afterEach(function () {        
        // Trello has provided no api request for deleting a list. Instead we will be deleting the whole board to keep the environment clean.
        cy.deleteBoard()
    });

    it('Create a List on a Board', () => {
        cy.readFile('cypress/fixtures/testdata.json').then(response => {
            const board_id = response.board_id;
            cy.log(board_id);
            const list_name = 'myList666'
            cy.api({
                method: 'POST',
                url: '/1/boards/' + board_id + '/lists?name=' + list_name + '&key=' + key + '&token=' + token,
            }).then(response => {
                expect(response.status).to.eq(200)
                cy.log(JSON.stringify(response.body.name))
                cy.writeFile('cypress/fixtures/testdata.json', {
                    // Wwrite again board_id since the command above will not add the list_id into the file, but rewrite it, so board id will be lost. Can do this or write other file.
                    "board_id": board_id,
                    "list_id": response.body.id
                })
            })
        })
    })

    it('Get a List', () => {
        cy.createList()
        cy.readFile('cypress/fixtures/testdata.json').then(response => {
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
    })

    it('Update a List - name', () => {
        cy.createList()
        cy.readFile('cypress/fixtures/testdata.json').then(response => {
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
    })
})




