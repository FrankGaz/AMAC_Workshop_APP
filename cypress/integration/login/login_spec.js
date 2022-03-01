const testUsername = process.env.test_username
const testPassword = process.env.test_password
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
        // cy.visit('#/')
        /*    cy.get('[data-test-id="login"] input[name="email"]').type('cecilia@xtremis.com')
           cy.get('[data-test-id="login"] input[name="password"]').type('1234567890')
           cy.get('[data-test-id="login-button"]').click()     
               cy.url().should('eq', 'http://127.0.0.1:9000/#/home') */

    })

    beforeEach(() => {
        cy.restoreLocalStorage()

    })

    afterEach(() => {
        cy.saveLocalStorage()
    })


    describe('login', function () {

        describe('login - tests', function () {

            const user = `01cypressTest-${Math.random()}`
            const password = `01cypressTest-Math.random()`

            const updatedUser = `001cypressTest-${Math.random()}`

            it('should have the login button disabled on click on both email and password blanks', function () {
                cy.visit('#/')
                cy.get('[data-test-id="login"] input[name="email"]').should('be.empty')
                cy.get('[data-test-id="login"] input[name="password"]').should('be.empty')
                cy.get('[data-test-id="login-button"]').click()
                cy.url().should('eq', 'http://127.0.0.1:9000/#/')
                cy.get('[data-test-id="login"] input[name="email"]').clear()
                cy.get('[data-test-id="login"] input[name="password"]').clear()
            })

            it('should have the login button disabled on click on email blank', function () {
                cy.visit('#/')
                cy.get('[data-test-id="login"] input[name="email"]').should('be.empty')
                cy.get('[data-test-id="login"] input[name="password"]').type('hello')
                cy.get('[data-test-id="login-button"]').click()
                cy.url().should('eq', 'http://127.0.0.1:9000/#/')
                cy.get('[data-test-id="login"] input[name="email"]').clear()
                cy.get('[data-test-id="login"] input[name="password"]').clear()
            })

            it('should have the login button disabled on click on password blank', function () {
                cy.visit('#/')
                cy.get('[data-test-id="login"] input[name="email"]').type('henry@xtremis.com')
                cy.get('[data-test-id="login"] input[name="password"]').should('be.empty')
                cy.get('[data-test-id="login-button"]').click()
                cy.url().should('eq', 'http://127.0.0.1:9000/#/')
                cy.get('[data-test-id="login"] input[name="email"]').clear()
                cy.get('[data-test-id="login"] input[name="password"]').clear()
            })

            it('should not be able to visit home page without logging in ', function () {
                cy.visit('#/')
                cy.visit('#/home')
                cy.url().should('eq', 'http://127.0.0.1:9000/#/')
                cy.get('[data-test-id="login"] input[name="email"]').clear()
                cy.get('[data-test-id="login"] input[name="password"]').clear()
            })

            it('should not let login using incorrect credentials', function () {
                cy.visit('#/')
                cy.get('[data-test-id="login"] input[name="email"]').type(user)
                cy.get('[data-test-id="login"] input[name="password"]').type(password)
                cy.get('[data-test-id="login-button"]').click()
                cy.get('[data-test-id="error"]').should('contain', 'Email o contraseña inválidos.')
                cy.url().should('eq', 'http://127.0.0.1:9000/#/')
                cy.get('[data-test-id="login"] input[name="email"]').clear()
                cy.get('[data-test-id="login"] input[name="password"]').clear()
            })

            it('should correctly login on using correct credentials', function () {
                cy.get('[data-test-id="login"] input[name="email"]').type('cecilia@xtremis.com')
                cy.get('[data-test-id="login"] input[name="password"]').type('1234567890')
                cy.get('[data-test-id="login-button"]').click()
                cy.url().should('eq', 'http://127.0.0.1:9000/#/home')
            })
        })
    })

})