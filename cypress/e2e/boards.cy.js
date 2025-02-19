import { faker } from '@faker-js/faker'

describe('/boards', () => {
    // defined as environment variable so we can work with sensitive data. Secrets were created in github to deal with same data in github actions
    const token = `${Cypress.env('trelloToken')}`
    const key = `${Cypress.env('trelloKey')}`

    it('Create a Board', { tags: ['BASIC', 'FULL', 'BOARD'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        const board_name = faker.music.songName().replace(/&/g, 'and') 
        cy.api({
            method: 'POST',
            url: `/1/boards/?name=${board_name}&key=${key}&token=${token}`
        }).then(response => {
            expect(response.status).to.eq(200)
            expect(encodeURIComponent(response.body.name)).to.eq(encodeURIComponent(board_name))
            cy.log(JSON.stringify(response.body.name))
            // cy.writeFile is use to write this data in fixture file everytime is needed and rewrite it son on. cy.fixture has problems with rewrited files.
            cy.writeFile(`cypress/fixtures/testdata-${randomNumber}.json`, {
                "board_id": response.body.id,
                "board_name": response.body.name
            })
        })
        cy.deleteBoard(randomNumber) 
        cy.deleteJsonFile(randomNumber)       
    })

    it('Create a Board - Negative Test (Bad Request)', { tags: ['NEGATIVE', 'BOARD'] }, () => {
        const board_name = faker.music.songName().replace(/&/g, 'and') 
        cy.api({
            method: 'POST',
            url: `/1/boards/?name=&${board_name}&key=${key}&token=${token}`,
            failOnStatusCode: false
        }).then(response => {
            expect(response.status).to.eq(400)
            expect(response.body.message).to.eq('invalid value for name')
            expect(response.body.error).to.eq('ERROR')
        })
    })   

    it('Create a Board - Negative Test (Unauthorized)', { tags: ['NEGATIVE', 'BOARD'] }, () => {
        const board_name = faker.music.songName().replace(/&/g, 'and');     
        cy.api({
            method: 'POST',
            url: `/1/boards/?name=${board_name}&key=${key}&token=@${token}`,
            failOnStatusCode: false 
        }).then(response => {
            expect(response.status).to.eq(401); 
            expect(response.body).to.eq('invalid app token'); 
        });
    });
    
    it('Get a Board', { tags: ['BASIC', 'FULL', 'BOARD'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        // cy.read is use to read data from fixture file. cyfixture has problems with rewrited files.
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const board_id = response.board_id
            const board_name = response.board_name
            cy.log(board_id)
            cy.api({
                method: 'GET',
                url: `/1/boards/${board_id}?key=${key}&token=${token}`,
            }).then(response => {
                expect(response.status).to.eq(200) 
                expect(response.body.id).to.eq(board_id) 
                expect(encodeURIComponent(response.body.name)).to.eq(encodeURIComponent(board_name))
                cy.log(JSON.stringify(response.body.name))
                cy.log(board_id)
            })        
        })
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)  
    })

    it('Get a Board - Negative Test (Bad Request)', { tags: ['NEGATIVE', 'BOARD'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const board_id = response.board_id
            cy.api({
                method: 'GET',
                url: `/1/boards/&${board_id}?key=${key}&token=${token}`,
                failOnStatusCode: false
            }).then(response => {
                expect(response.status).to.eq(400)
                expect(response.body).to.eq('invalid id')
            })
        })
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)
    })    

    it('Get a Board - Negative Test (Unauthorized)', { tags: ['NEGATIVE', 'BOARD'] }, () => {
        const randomNumber = faker.finance.creditCardNumber();
        cy.createBoard(randomNumber);        
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const board_id = response.board_id;    
            cy.api({
                method: 'GET',
                url: `/1/boards/${board_id}?key=${key}&token=@${token}`,
                failOnStatusCode: false
            }).then(response => {
                expect(response.status).to.eq(401);
                expect(response.body).to.eq('invalid app token');
            });
        });    
        cy.deleteBoard(randomNumber);
        cy.deleteJsonFile(randomNumber);
    });    

    it('Update a Board', { tags: ['BASIC', 'FULL', 'BOARD'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const board_id = response.board_id
            const new_board_name = faker.music.songName().replace(/&/g, 'and')
            cy.log(board_id);
            cy.api({
                method: 'PUT',
                url: `/1/boards/${board_id}?key=${key}&token=${token}`,
                body: {
                    "name": new_board_name
                }
            }).then(response => {
                expect(response.status).to.eq(200)
                expect(response.body.id).to.eq(board_id) 
                expect(encodeURIComponent(response.body.name)).to.eq(encodeURIComponent(new_board_name))
                cy.log(JSON.stringify(response.body.name))
            })
        })
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)          
    })

    it('Update a Board - Negative Test (Bad Request)', { tags: ['NEGATIVE', 'BOARD'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const board_id = response.board_id
            const new_board_name = faker.music.songName().replace(/&/g, 'and')
            cy.log(board_id)
            cy.api({
                method: 'PUT',
                url: `/1/boards/&${board_id}?key=${key}&token=${token}`,
                body: {
                    "name": new_board_name
                },
                failOnStatusCode: false
            }).then(response => {
                expect(response.status).to.eq(400)
                expect(response.body).to.eq('invalid id')
            })
        })
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)
    })
    
    it('Update a Board - Negative Test (Unauthorized)', { tags: ['NEGATIVE', 'BOARD'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const board_id = response.board_id
            const new_board_name = faker.music.songName().replace(/&/g, 'and')
            cy.api({
                method: 'PUT',
                url: `/1/boards/${board_id}?key=${key}&token=@${token}`,
                failOnStatusCode: false,
                body: {
                    "name": new_board_name
                }
            }).then(response => {
                expect(response.status).to.eq(401)
                expect(response.body).to.eq('invalid app token')
            })
        })
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)
    })  

    it('Delete a Board', { tags: ['BASIC', 'FULL', 'BOARD'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const board_id = response.board_id
            cy.log(board_id)
            cy.api({
                method: 'DELETE',
                url: `/1/boards/${board_id}?key=${key}&token=${token}`,
            }).then(response => {
                expect(response.status).to.eq(200)
            })
        })
        cy.deleteJsonFile(randomNumber)  
    })

    it('Delete a Board - Negative Test (Bad Request)', { tags: ['NEGATIVE', 'BOARD'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const board_id = response.board_id
            cy.log(board_id)
            cy.api({
                method: 'DELETE',
                url: `/1/boards/&${board_id}?key=${key}&token=${token}`,
                failOnStatusCode: false
            }).then(response => {
                expect(response.status).to.eq(400)
                expect(response.body).to.eq('invalid id')
            })
        })
        cy.deleteJsonFile(randomNumber)
    })    

    it('Delete a Board - Negative Test (Unauthorized)', { tags: ['NEGATIVE', 'BOARD'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const board_id = response.board_id
            cy.api({
                method: 'DELETE',
                url: `/1/boards/${board_id}?key=${key}&token=@${token}`,
                failOnStatusCode: false
            }).then(response => {
                expect(response.status).to.eq(401)
                expect(response.body).to.eq('invalid app token')
            })
        })
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)
    })    
})