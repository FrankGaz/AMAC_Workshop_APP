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


    describe('ITV', function () {

        describe('ITV basics + table', function () {


            it('should visit the page correctly', function () {
                cy.visit('#/home/itv')
                cy.url().should('eq', 'http://127.0.0.1:9000/#/home/itv')
            })

            it('should correctly show loading icon on visiting the page and correctly hide', function () {
                cy.visit('#/home/itv')
                cy.get('[data-test-id="loadingIcon"]').then(($el) => {
                    expect(Cypress.dom.isHidden($el)).to.equal(false)
                })
                cy.wait(2500)
                cy.get('[data-test-id="loadingIcon"]').then(($el) => {
                    expect(Cypress.dom.isHidden($el)).to.equal(true)
                })
            })

            it('should correctly show data on the tables', function () {
                cy.get('[data-test-id="itvTableDetails"]').then($el => {
                    expect($el[0]).to.not.equal(undefined)
                })
            })

            it('should correctly refresh page', function () {
                cy.get('[data-test-id="reloadItems"]').click()
                cy.get('[data-test-id="loadingIcon"]').then(($el) => {
                    expect(Cypress.dom.isHidden($el)).to.equal(false)
                })
                cy.wait(2500)
                cy.get('[data-test-id="itvTableDetails"]').then($el => {
                    expect($el[0]).to.not.equal(undefined)
                })
            })
        })

        describe('ITV - search box', function () {

            before(() => {
                cy.restoreLocalStorage()
                cy.visit('#/home/itv')
                cy.url().should('eq', 'http://127.0.0.1:9000/#/home/itv')
                cy.get('[data-test-id="toggleSearchBox"]').click()
            })

            afterEach(() => {
                cy.get('[data-test-id="registration"]').find('[data-test-id="input"]').clear()
                cy.get('[data-test-id="zone"]').find('[data-test-id="input"]').clear()
                cy.get('[data-test-id="unity"]').find('[data-test-id="input"]').clear()
                cy.get('[data-test-id="fleet"]').find('[data-test-id="input"]').clear()
                cy.get('[data-test-id="fromDate"]').find('[data-test-id="input"]').clear()
                cy.get('[data-test-id="toDate"]').find('[data-test-id="input"]').clear()
            })

            const willFailToFindInput = `cypress-${Math.random()}`

            it('should not show any info on typing impossible registration', function () {
                cy.get('[data-test-id="registration"]').find('[data-test-id="input"]').type(willFailToFindInput)
                cy.get('[data-test-id="searchClick"]').click()
                cy.wait(2500)
                cy.get('[data-test-id="itvTableDetailsHeader"]').then(element => {
                    console.log(element)
                    expect(element[0].children.length).to.equal(0)
                })
                //expect(cy.get('[data-test-id="itvTableDetails"]')).to.not.exist()
                /* cy.get('[data-test-id="itvTableDetails"]').then($el => {
                    expect($el).to.equal(undefined)
                }) */
            })

            it('should correctly show data again on empty table on clearSearch click', function () {
                cy.get('[data-test-id="registration"]').find('[data-test-id="input"]').type(willFailToFindInput)
                cy.get('[data-test-id="searchClick"]').click()
                cy.wait(2500)
                cy.get('[data-test-id="itvTableDetailsHeader"]').then(element => {
                    expect(element[0].children.length).to.equal(0)
                })

                cy.get('[data-test-id="clearSearch"]').click()
                cy.wait(2500)
                cy.get('[data-test-id="itvTableDetails"]').then($el => {
                    expect($el[0]).to.not.equal(undefined)
                })
            })

            describe('zones', function () {

                let searchResultElements
                let zoneSearchQuery = 'Barcelona'

                // will fail if the total number of items in the zone is above 18, as to prove it is being filtered, I will assume that it will show a result
                // between 1 and 18 (25 being the default max it shows at once), the total number being shown as of 16/09/2019 is 19
                it('should search for zones using the modal', function () {
                    cy.get('[data-test-id="zone"]').find('[data-test-id=searchButton]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="zoneDetails"]').find('[data-test-id="zoneDetails.name"]').contains(zoneSearchQuery).click()
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="itvTableDetailsHeader"]').then(element => {
                        console.log('zoneElements', element)
                        searchResultElements = element[0].childNodes.length
                        expect(element[0].childNodes.length).to.be.greaterThan(0)
                        expect(element[0].childNodes.length).to.be.lessThan(19)
                    })
                })

                it('should search for zones by writing input and give same result as searched in modal', function () {
                    cy.get('[data-test-id="zone"]').find('[data-test-id=input]').type(zoneSearchQuery)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="itvTableDetailsHeader"]').then(element => {
                        console.log('zoneElements', element)
                        expect(element[0].childNodes.length).to.equal(searchResultElements)
                    })
                })

                it('should return no results after searching for impossible query', function () {
                    cy.get('[data-test-id="zone"]').find('[data-test-id=input]').type(willFailToFindInput)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="itvTableDetailsHeader"]').then(element => {
                        console.log('zoneElements', element)
                        expect(element[0].children.length).to.equal(0)
                    })
                })

            })

            describe('units', function () {

                let searchResultElements
                let zoneSearchQuery = '00 NO TOCAR'
                let dataTestId = 'unity'

                // will fail if the total number of items in the zone is above 18, as to prove it is being filtered, I will assume that it will show a result
                // between 1 and 18 (25 being the default max it shows at once), the total number being shown as of 16/09/2019 is 19
                it('should search for units using the modal', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=searchButton]').click()
                    cy.wait(2500)
                    cy.get(`[data-test-id="${dataTestId}Details"]`).find(`[data-test-id="${dataTestId}Details.name"]`).contains(zoneSearchQuery).click()
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="itvTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        searchResultElements = element[0].childNodes.length
                        expect(element[0].childNodes.length).to.be.greaterThan(0)
                        expect(element[0].childNodes.length).to.be.lessThan(19)
                    })
                })

                it('should search for zones by writing input and give same result as searched in modal', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(zoneSearchQuery)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="itvTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        expect(element[0].childNodes.length).to.equal(searchResultElements)
                    })
                })

                it('should return no results after searching for impossible query', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(willFailToFindInput)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="itvTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        expect(element[0].children.length).to.equal(0)
                    })
                })

            })

            describe('fleets', function () {

                let searchResultElements
                let zoneSearchQuery = 'BARCELONA'
                let dataTestId = 'fleet'

                // will fail if the total number of items in the zone is above 18, as to prove it is being filtered, I will assume that it will show a result
                // between 1 and 18 (25 being the default max it shows at once), the total number being shown as of 16/09/2019 is 19
                it('should search for units using the modal', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=searchButton]').click()
                    cy.wait(2500)
                    cy.get(`[data-test-id="${dataTestId}Details"]`).find(`[data-test-id="${dataTestId}Details.name"]`).contains(zoneSearchQuery).click()
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="itvTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        searchResultElements = element[0].childNodes.length
                        expect(element[0].childNodes.length).to.be.greaterThan(0)
                        expect(element[0].childNodes.length).to.be.lessThan(19)
                    })
                })

                it('should search for zones by writing input and give same result as searched in modal', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(zoneSearchQuery)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="itvTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        expect(element[0].childNodes.length).to.equal(searchResultElements)
                    })
                })

                it('should return no results after searching for impossible query', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(willFailToFindInput)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="itvTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        expect(element[0].children.length).to.equal(0)
                    })
                })

            })


            describe('from date', function () {
                let dataTestId = 'fromDate'
                let fromDate = '2018-11-30'

                // will fail if the total number of items in the zone is above 18, as to prove it is being filtered, I will assume that it will show a result
                // between 1 and 18 (25 being the default max it shows at once), the total number being shown as of 16/09/2019 is 19
                it('should correctly search from date', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(fromDate)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="itvTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        expect(element[0].childNodes.length).to.be.greaterThan(0)
                        expect(element[0].childNodes.length).to.be.lessThan(19)
                    })
                })

                it('should correctly erase input on clear button press', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(fromDate)
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=resetIcon]').click()
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').should('be.empty')
                })
            })


            describe('to date', function () {
                let dataTestId = 'toDate'
                let fromDate = '2016-11-20'

                // will fail if the total number of items in the zone is above 18, as to prove it is being filtered, I will assume that it will show a result
                // between 1 and 18 (25 being the default max it shows at once), the total number being shown as of 16/09/2019 is 19
                it('should correctly search from date', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(fromDate)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="itvTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        expect(element[0].childNodes.length).to.be.greaterThan(0)
                        expect(element[0].childNodes.length).to.be.lessThan(19)
                    })
                })

                it('should correctly erase input on clear button press', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(fromDate)
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=resetIcon]').click()
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').should('be.empty')
                })
            })
        })

    })

})