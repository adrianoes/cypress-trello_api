describe('/boards', () => {
    // defined as environment variable so we can work with sensitive data. Secrets were created in github to deal with same data in github actions
    const token = `${Cypress.env('trelloToken')}`
    const key = `${Cypress.env('trelloKey')}`

    // beforeEach and afterEach were not used in this testfile because they would aplly only to get and update tests. for the for create, after withe delete command would be used and. For delete, before with create command wouuld be used. It would be more confused so I prefer to let it as it is.

    it('Create a Board', () => {
        // Altough the cy.createBoard() custom command exists, raw code was used here so we are able to focus only in this action if required. 
        const board_name = 'myBoard123'
        // use cy.api so we can see the responses in screen view
        cy.api({
            method: 'POST',
            url: '/1/boards/?name=' + board_name + '&key=' + key + '&token=' + token,
        }).then(response => {
            expect(response.status).to.eq(200)
            cy.log(JSON.stringify(response.body.name))
            // cy.writeFile is use to write this data in fixture file everytime is needed and rewrite it son on. cy.fixture has problems with rewrited files.
            cy.writeFile('cypress/fixtures/testdata.json', {
                "board_id": response.body.id
            })
        })
        cy.deleteBoard()        
    })

    it('Get a Board', () => {
        cy.createBoard()
        // cy.read is use to read data from fixture file. cyfixture has problems with rewrited files.
        cy.readFile('cypress/fixtures/testdata.json').then(response => {
            const board_id = response.board_id;
            cy.log(board_id);
            cy.api({
                method: 'GET',
                url: '/1/boards/' + board_id + '?key=' + key + '&token=' + token,
            }).then(response => {
                expect(response.status).to.eq(200)
                cy.log(JSON.stringify(response.body.name))
                cy.log(board_id)
            })        
        })
        cy.deleteBoard()
    })

    it('Update a Board - name', () => {
        cy.createBoard()
        cy.readFile('cypress/fixtures/testdata.json').then(response => {
            const board_id = response.board_id;
            cy.log(board_id);
            cy.api({
                method: 'PUT',
                url: '/1/boards/' + board_id + '?key=' + key + '&token=' + token,
                body: {
                    "name": "myBoard2"
                }
            }).then(response => {
                expect(response.status).to.eq(200)
                cy.log(JSON.stringify(response.body.name))
            })
        })
        cy.deleteBoard()        
    })

    it('Delete a Board', () => {
        cy.createBoard()
        cy.readFile('cypress/fixtures/testdata.json').then(response => {
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
})