/* eslint-disable no-undef */
// language used: spanish

// cypress automatically removes local storage before each test, so the workaround is to add functionalities to cypress to be able to keep the local storage
const LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add("saveLocalStorage", () => {
    Object.keys(localStorage).forEach(key => {
        LOCAL_STORAGE_MEMORY[key] = localStorage[key]
    })
})

Cypress.Commands.add("restoreLocalStorage", () => {
    Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
        localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key])
    })
})



describe('App E2E test', function () {
    before(() => {
        cy.server()
        cy.route({
            method: 'POST',      // Route all POST requests
            url: '/api/users/sign_in',    // that have a URL that matches '/users/*'
          }).as('login')
        cy.visit('#/')
        cy.get('[data-test-id="login"] input[name="email"]').type('cecilia@xtremis.com')
        cy.get('[data-test-id="login"] input[name="password"]').type('1234567890')
        cy.get('[data-test-id="login-button"]').click()
       
      
            cy.url().should('eq', 'http://127.0.0.1:9000/#/home')
    
    })

    beforeEach(() => {
        cy.restoreLocalStorage()

    })

    afterEach(() => {
        cy.saveLocalStorage()
    })


    describe('basics', function () {

        describe('unity', function () {

            const user = `01cypressTest-${Math.random()}`

            const updatedUser = `001cypressTest-${Math.random()}`

            it('should visit the page correctly', function () {
                cy.visit('#/home/unity')
                cy.url().should('eq', 'http://127.0.0.1:9000/#/home/unity')
            })

            it('should correctly show Add modal on add click', function () {
                cy.get('[data-test-id="showAddFrecuencyModalButton"]')
                    .click()

                cy.get('[data-test-id="addEditFrecuencyTitle"]').should('contain', 'Añadir')

                cy.get('[data-test-id="addFrecuencyButton"]').should('contain', 'Añadir')

                cy.get('[data-test-id="editFrecuencyButton"]').then(($el) => {
                    expect(Cypress.dom.isHidden($el)).to.equal(true)
                })
            })

            it('should correctly add a new frecuency', function () {

                cy.get('[data-test-id="angularNameInput"]')
                    .type("001test")

                cy.get('#expirations #name')
                    .type(12345)

                cy.get('#daysInterval #name')
                    .type(67890)

                    .then(() => {
                        cy.get('[data-test-id="addFrecuencyButton"]')
                            .click()


                        cy.get('[data-title-text="Condición de pago"]').should('contain', "001test")
                        cy.get('[data-title-text="Días de intervalo"]').should('contain', "67890")
                        cy.get('[data-title-text="Vencimientos"]').should('contain', "12345")
                    })
            })

            it('should correctly show update frecuency modal', function () {
                cy.get('[data-title-text="Condición de pago"]').eq(1)
                    .dblclick()

                cy.get('[data-test-id="addEditFrecuencyTitle"]').should('contain', 'Modificar')

                cy.get('[data-test-id="addFrecuencyButton"]').then(($el) => {
                    expect(Cypress.dom.isHidden($el)).to.equal(true)
                })

                cy.get('[data-test-id="editFrecuencyButton"]').should('contain', 'Actualizar')

            })

            it('should correctly update selected network', function () {
                cy.get('#expirations #name')
                    .clear()
                    .type(4321)

                cy.get('#daysInterval #name')
                    .clear()
                    .type(98765)
                    .then(() => {
                        cy.get('[data-test-id="editFrecuencyButton"]')
                            .click()
                        cy.get('[data-title-text="Condición de pago"]').should('contain', "001test")
                        cy.get('[data-title-text="Días de intervalo"]').should('contain', "98765")
                        cy.get('[data-title-text="Vencimientos"]').should('contain', "4321")
                    })
            })


            it('should correctly search for previously updated network', function () {
                cy.get('[data-test-id="frecuencySearchBoxOpenIcon"]')
                    .click()

                cy.get('[data-test-id="daysIntervalSearchInput"]')
                    .clear()
                    .type(98765)

                cy.get('[data-test-id="expirationsSearchInput"]')
                    .clear()
                    .type(4321)

                    .then(() => {
                        cy.get('[data-test-id="frecuencySearchButton"]')
                            .click()
                            .then(() => {
                                cy.get('[data-title-text="Condición de pago"]').should('contain', "001test")
                                cy.get('[data-title-text="Días de intervalo"]').should('contain', "98765")
                                cy.get('[data-title-text="Vencimientos"]').should('contain', "4321")
                            })


                    })
                cy.get('[data-test-id="clearSearchFrecuency"]')
                    .click()
            })

            it('should correctly delete test unit on click', function () {

                cy.get('.options-column .fa-trash-o').first()
                    .click()
                cy.get('.modal-footer .btn.btn-sm.btn-danger')
                    .click()
                cy.get('[data-title-text="Condición de pago"]').should('not.contain', "001test")
                cy.get('[data-title-text="Días de intervalo"]').should('not.contain', "98765")
                cy.get('[data-title-text="Vencimientos"]').should('not.contain', "4321")
            })

            // unit recorded

            describe('test_name', function () {

                it('what_it_does', function () {

                    cy.viewport(1280, 689)
                    cy.visit('http://localhost:9000/#/configuration/parameters/property/budget_limit')
                    cy.get('div > .row > .col-md-3 > .col-gray-bg > .btn').click()
                    cy.get('form > .row > .col-md-3:nth-child(1) > .block > #name').click()
                    cy.get('form > .row > .has-success > .block > #name').type('as')
                    cy.get('form > .row > .has-error > .block > #name').type('0')

                    cy.get('modal-footer > btn-primary').should('be.disabled')

                })

            }) 


        }) 

    }) 

})