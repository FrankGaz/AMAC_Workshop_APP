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

//In this test in particular, searching for province, zone, and unity doesn't work here nor in the main app, only fleet works and even then, only two different results
// are available, either all 4 of the results are shown, or none are.
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


    describe('incidence', function () {

        describe('incidence basics + table', function () {


            it('should visit the page correctly', function () {
                cy.visit('#/home/incidence')
                cy.url().should('eq', 'http://127.0.0.1:9000/#/home/incidence')
            })

            it('should correctly show loading icon on visiting the page and correctly hide', function () {
                cy.visit('#/home/incidence')
                cy.get('[data-test-id="loadingIcon"]').then(($el) => {
                    expect(Cypress.dom.isHidden($el)).to.equal(false)
                })
                cy.wait(2500)
                cy.get('[data-test-id="loadingIcon"]').then(($el) => {
                    expect(Cypress.dom.isHidden($el)).to.equal(true)
                })
            })

            it('should correctly show data on the tables', function () {
                cy.get('[data-test-id="incidenceTableDetails"]').then($el => {
                    expect($el[0]).to.not.equal(undefined)
                })
            })

            it('should correctly refresh page', function () {
                cy.get('[data-test-id="reloadItems"]').click()
                cy.get('[data-test-id="loadingIcon"]').then(($el) => {
                    expect(Cypress.dom.isHidden($el)).to.equal(false)
                })
                cy.wait(2500)
                cy.get('[data-test-id="incidenceTableDetails"]').then($el => {
                    expect($el[0]).to.not.equal(undefined)
                })
            })
        })
     
    })
})