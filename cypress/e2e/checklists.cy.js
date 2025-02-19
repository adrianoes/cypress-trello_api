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
            const card_id = response.card_id
            const board_id = response.board_id
            const list_id = response.list_id
            const checklist_name = faker.music.songName().replace(/&/g, 'and')
            cy.log(card_id)
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
                expect(encodeURIComponent(response.body.name)).to.eq(encodeURIComponent(checklist_name))            
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
        cy.deleteChecklist(randomNumber)
        cy.deleteCard(randomNumber)           
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)    
    })   

    it('Create a Checklist - Negative Test (Bad Request)', { tags: ['NEGATIVE', 'CHECKLIST'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.createList(randomNumber)
        cy.createCard(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const card_id = response.card_id
            const checklist_name = faker.music.songName().replace(/&/g, 'and')
            cy.api({
                method: 'POST',
                url: `/1/checklists&idCard=${card_id}&key=&${key}&token=${token}`,
                // failOnStatusCode: false,
                body: {
                    name: checklist_name
                }
            }).then(response => {
                expect(response.status).to.eq(400)
                expect(response.body).to.eq('invalid id')
            })
        })
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)
    })
    
    it('Create a Checklist - Negative Test (Unauthorized)', { tags: ['NEGATIVE', 'CHECKLIST'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.createList(randomNumber)
        cy.createCard(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const card_id = response.card_id
            cy.api({
                method: 'POST',
                url: `/1/checklists?idCard=${card_id}&key=${key}&token=@${token}`,
                failOnStatusCode: false,
                body: {
                    name: faker.music.songName().replace(/&/g, 'and')
                }
            }).then(response => {
                expect(response.status).to.eq(401)
                expect(response.body).to.eq('invalid app token')
            })
        })
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
            const checklist_id = response.checklist_id
            const checklist_name = response.checklist_name
            const card_id = response.card_id
            const board_id = response.board_id
            cy.log(checklist_id)
            cy.api({
                method: 'GET',
                url: `/1/checklists/${checklist_id}?key=${key}&token=${token}`,
            }).then(response => {
                expect(response.status).to.eq(200) 
                expect(response.body.id).to.eq(checklist_id) 
                expect(encodeURIComponent(response.body.name)).to.eq(encodeURIComponent(checklist_name))
                expect(response.body.idCard).to.eq(card_id) 
                expect(response.body.idBoard).to.eq(board_id)                
                cy.log(JSON.stringify(response.body.name))
                cy.log(checklist_id)
            })          
        })
        cy.deleteChecklist(randomNumber)
        cy.deleteCard(randomNumber)           
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)    
    })

    it('Get a Checklist - Negative Test (Bad Request)', { tags: ['NEGATIVE', 'CHECKLIST'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.createList(randomNumber)
        cy.createCard(randomNumber)
        cy.createChecklist(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const checklist_id = response.checklist_id
            cy.api({
                method: 'GET',
                url: `/1/checklists/&${checklist_id}?key=${key}&token=${token}`,
                failOnStatusCode: false
            }).then(response => {
                expect(response.status).to.eq(400)
                expect(response.body).to.eq('invalid id')
            })
        })
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)
    })
    
    it('Get a Checklist - Negative Test (Unauthorized)', { tags: ['NEGATIVE', 'CHECKLIST'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.createList(randomNumber)
        cy.createCard(randomNumber)
        cy.createChecklist(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const checklist_id = response.checklist_id
            cy.api({
                method: 'GET',
                url: `/1/checklists/${checklist_id}?key=${key}&token=@${token}`,
                failOnStatusCode: false
            }).then(response => {
                expect(response.status).to.eq(401)
                expect(response.body).to.eq('invalid app token')
            })
        })
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
            const checklist_id = response.checklist_id
            const updated_checklist_name = faker.music.songName().replace(/&/g, 'and')
            const card_id = response.card_id
            const board_id = response.board_id
            cy.log(checklist_id)
            cy.api({
                method: 'PUT',
                url: `/1/checklists/${checklist_id}?key=${key}&token=${token}`,
                body: {
                    name: updated_checklist_name 
                }
            }).then(response => {
                expect(response.status).to.eq(200) 
                expect(response.body.id).to.eq(checklist_id) 
                expect(encodeURIComponent(response.body.name)).to.eq(encodeURIComponent(updated_checklist_name))
                expect(response.body.idCard).to.eq(card_id) 
                expect(response.body.idBoard).to.eq(board_id)                
                cy.log(JSON.stringify(response.body.name))
                cy.log(checklist_id)
            })           
        })  
        cy.deleteChecklist(randomNumber)
        cy.deleteCard(randomNumber)           
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)    
    })

    it('Update a Checklist - name - Negative Test (Bad Request)', { tags: ['NEGATIVE', 'CHECKLIST'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.createList(randomNumber)
        cy.createCard(randomNumber)
        cy.createChecklist(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const checklist_id = response.checklist_id
            const updated_checklist_name = faker.music.songName().replace(/&/g, 'and')
            cy.api({
                method: 'PUT',
                url: `/1/checklists/&${checklist_id}?key=${key}&token=${token}`,
                body: {
                    name: updated_checklist_name 
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
    
    it('Update a Checklist - name - Negative Test (Unauthorized)', { tags: ['NEGATIVE', 'CHECKLIST'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.createList(randomNumber)
        cy.createCard(randomNumber)
        cy.createChecklist(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const checklist_id = response.checklist_id
            const updated_checklist_name = faker.music.songName().replace(/&/g, 'and')
            cy.api({
                method: 'PUT',
                url: `/1/checklists/${checklist_id}?key=${key}&token=@${token}`,
                body: {
                    name: updated_checklist_name 
                },
                failOnStatusCode: false
            }).then(response => {
                expect(response.status).to.eq(401)
                expect(response.body).to.eq('invalid app token')
            })           
        })  
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
            const checklist_id = response.checklist_id
            cy.log(checklist_id)
            cy.api({
                method: 'DELETE',
                url: `/1/checklists/${checklist_id}?key=${key}&token=${token}`,
            }).then(response => {
                expect(response.status).to.eq(200)
            })
        })
        cy.deleteCard(randomNumber)           
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)    
    })

    it('Delete a Checklist - Negative Test (Bad Request)', { tags: ['NEGATIVE', 'CHECKLIST'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.createList(randomNumber)
        cy.createCard(randomNumber)
        cy.createChecklist(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const checklist_id = response.checklist_id
            cy.api({
                method: 'DELETE',
                url: `/1/checklists/&${checklist_id}?key=${key}&token=${token}`,
                failOnStatusCode: false
            }).then(response => {
                expect(response.status).to.eq(400)
                expect(response.body).to.eq('invalid id')
            })
        })
        cy.deleteBoard(randomNumber)
        cy.deleteJsonFile(randomNumber)
    })
    
    it('Delete a Checklist - Negative Test (Unauthorized)', { tags: ['NEGATIVE', 'CHECKLIST'] }, () => {
        const randomNumber = faker.finance.creditCardNumber()
        cy.createBoard(randomNumber)
        cy.createList(randomNumber)
        cy.createCard(randomNumber)
        cy.createChecklist(randomNumber)
        cy.readFile(`cypress/fixtures/testdata-${randomNumber}.json`).then(response => {
            const checklist_id = response.checklist_id
            cy.api({
                method: 'DELETE',
                url: `/1/checklists/${checklist_id}?key=${key}&token=@${token}`,
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