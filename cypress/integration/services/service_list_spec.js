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


    describe('service', function () {

        describe('service basics + table', function () {


            it('should visit the page correctly', function () {
                cy.visit('#/home/service')
                cy.url().should('eq', 'http://127.0.0.1:9000/#/home/service')
            })

            it('should correctly show loading icon on visiting the page and correctly hide', function () {
                cy.visit('#/home/service')
                cy.get('[data-test-id="loadingIcon"]').then(($el) => {
                    expect(Cypress.dom.isHidden($el)).to.equal(false)
                })
                cy.wait(2500)
                cy.get('[data-test-id="loadingIcon"]').then(($el) => {
                    expect(Cypress.dom.isHidden($el)).to.equal(true)
                })
            })

            it('should correctly show data on the tables', function () {
                cy.get('[data-test-id="serviceTableDetails"]').then($el => {
                    expect($el[0]).to.not.equal(undefined)
                })
            })

            it('should correctly refresh page', function () {
                cy.get('[data-test-id="reloadItems"]').click()
                cy.get('[data-test-id="loadingIcon"]').then(($el) => {
                    expect(Cypress.dom.isHidden($el)).to.equal(false)
                })
                cy.wait(2500)
                cy.get('[data-test-id="serviceTableDetails"]').then($el => {
                    expect($el[0]).to.not.equal(undefined)
                })
            })
        })

        describe('Service - search box', function () {

            before(() => {
                cy.restoreLocalStorage()
                cy.visit('#/home/service')
                cy.url().should('eq', 'http://127.0.0.1:9000/#/home/service')
                cy.get('[data-test-id="toggleSearchBox"]').click()
            })

            afterEach(() => {
                cy.get('[data-test-id="registration"]').find('[data-test-id="input"]').clear()
                cy.get('[data-test-id="service_number"]').find('[data-test-id="input"]').clear()
                cy.get('[data-test-id="zone"]').find('[data-test-id="input"]').clear()
                cy.get('[data-test-id="unity"]').find('[data-test-id="input"]').clear()
                cy.get('[data-test-id="fleet"]').find('[data-test-id="input"]').clear()
                cy.get('[data-test-id="province"]').find('[data-test-id="input"]').clear()
                cy.get('[data-test-id="incidenceKind"]').find('[data-test-id="input"]').clear()
                cy.get('[data-test-id="fromDate"]').find('[data-test-id="input"]').clear()
                cy.get('[data-test-id="toDate"]').find('[data-test-id="input"]').clear()
                cy.get('[data-test-id="serviceType"]').find('[data-test-id="select"]').select('Service kind')
                cy.get('[data-test-id="expedientState"]').find('[data-test-id="select"]').select('Expedient state')
            })

            const willFailToFindInput = `cypress-${Math.random()}`


            describe('registration', function () {


                const validRegistration = '5789HGT'

                it('should show an answer on known registration search', function () {
                    cy.get('[data-test-id="registration"]').find('[data-test-id="input"]').type(validRegistration)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetailsHeader"]').then(element => {
                        expect(element[0].children.length).to.equal(2)
                    })
                })

                it('should not show any info on typing impossible registration', function () {
                    cy.get('[data-test-id="registration"]').find('[data-test-id="input"]').type(willFailToFindInput)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetailsHeader"]').then(element => {
                        console.log(element)
                        expect(element[0].children.length).to.equal(0)
                    })
                })
            })

            describe('service number', function () {
                const validServiceNumber = '9505'

                it('should show an answer on known service number search', function () {
                    cy.get('[data-test-id="service_number"]').find('[data-test-id="input"]').type(validServiceNumber)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetailsHeader"]').then(element => {
                        expect(element[0].children.length).to.equal(1)
                    })
                })


                it('should not show any info on typing impossible service number', function () {
                    cy.get('[data-test-id="service_number"]').find('[data-test-id="input"]').type(willFailToFindInput)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetailsHeader"]').then(element => {
                        expect(element[0].children.length).to.equal(0)
                    })
                })
            })


            it('should correctly show data again on empty table on clearSearch click', function () {
                cy.get('[data-test-id="registration"]').find('[data-test-id="input"]').type(willFailToFindInput)
                cy.get('[data-test-id="searchClick"]').click()
                cy.wait(2500)
                cy.get('[data-test-id="serviceTableDetailsHeader"]').then(element => {
                    expect(element[0].children.length).to.equal(0)
                })

                cy.get('[data-test-id="clearSearch"]').click()
                cy.wait(2500)
                cy.get('[data-test-id="serviceTableDetails"]').then($el => {
                    expect($el[0]).to.not.equal(undefined)
                })
            })

            describe('fleets', function () {

                let searchResultElements
                let zoneSearchQuery = 'BARCELONA'
                let dataTestId = 'fleet'

                // Testing this, I see that there are only 2 possible results, either all 4 or none, I will first start by trying for none, and then I will try for 4.
                // All 4 of the items are in the fleet BARCELONA
                it('should return no results after searching for impossible query', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(willFailToFindInput)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        expect(element[0].children.length).to.equal(0)
                    })
                })

                it('should search for fleets using the modal', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=searchButton]').click()
                    cy.wait(2500)
                    cy.get(`[data-test-id="${dataTestId}Details"]`).find(`[data-test-id="${dataTestId}Details.name"]`).contains(zoneSearchQuery).click()
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetails"]').its('length').should('eq', 4)
                    searchResultElements = 4
                })

                it('should search for fleets by writing input and give same result as searched in modal', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(zoneSearchQuery)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        expect(element[0].childNodes.length).to.equal(searchResultElements)
                    })
                })



            })

            describe('zones', function () {

                let expectedSearchResultElements
                let zoneSearchQuery = 'Barcelona'
                let dataTestId = 'zone'

                // Testing this, I see that there are only 2 possible results, either all 4 or none, I will first start by trying for none, and then I will try for 4.
                // All 4 of the items are in the fleet BARCELONA
                it('should return no results after searching for impossible query', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(willFailToFindInput)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        expect(element[0].children.length).to.equal(0)
                    })
                })

                it('should search for fleets using the modal', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=searchButton]').click()
                    cy.wait(2500)
                    cy.get(`[data-test-id="${dataTestId}Details"]`).find(`[data-test-id="${dataTestId}Details.name"]`).contains(zoneSearchQuery).click()
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetails"]').its('length').should('eq', 1)
                    expectedSearchResultElements = 1
                })

                it('should search for zones by writing input and give same result as searched in modal', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(zoneSearchQuery)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        expect(element[0].childNodes.length).to.equal(expectedSearchResultElements)
                    })
                })



            })

            describe('provinces', function () {

                let searchResultElements
                let zoneSearchQuery = 'Barcelona'
                let dataTestId = 'province'

                // Testing this, I see that there are only 2 possible results, either all 4 or none, I will first start by trying for none, and then I will try for 4.
                // All 4 of the items are in the fleet BARCELONA
                it('should return no results after searching for impossible query', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(willFailToFindInput)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        expect(element[0].children.length).to.equal(0)
                    })
                })

                it('should search for provinces using the modal', function () {
                    const expectedSearchResultElements = 2
                    searchResultElements = expectedSearchResultElements

                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=searchButton]').click()
                    cy.wait(2500)
                    cy.get(`[data-test-id="${dataTestId}Details"]`).find(`[data-test-id="${dataTestId}Details.name"]`).contains(zoneSearchQuery).click()
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetails"]').its('length').should('eq', expectedSearchResultElements)
                })

                it('should search for provinces by writing input and give same result as searched in modal', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(zoneSearchQuery)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        expect(element[0].childNodes.length).to.equal(searchResultElements)
                    })
                })
            })


            describe('units', function () {

                let searchResultElements
                let zoneSearchQuery = '00 NO TOCAR'
                let dataTestId = 'unity'

                // Testing this, I see that there are only 2 possible results, either all 4 or none, I will first start by trying for none, and then I will try for 4.
                // All 4 of the items are in the fleet BARCELONA
                it('should return no results after searching for impossible query', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(willFailToFindInput)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        expect(element[0].children.length).to.equal(0)
                    })
                })

                it('should search for fleets using the modal', function () {
                    const expectedSearchResultElements = 1
                    searchResultElements = expectedSearchResultElements

                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=searchButton]').click()
                    cy.wait(2500)
                    cy.get(`[data-test-id="${dataTestId}Details"]`).find(`[data-test-id="${dataTestId}Details.name"]`).contains(zoneSearchQuery).click()
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetails"]').its('length').should('eq', expectedSearchResultElements)
                })

                it('should search for zones by writing input and give same result as searched in modal', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(zoneSearchQuery)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        expect(element[0].childNodes.length).to.equal(searchResultElements)
                    })
                })
            })

            describe('incidence kinds', function () {

                let searchResultElements
                let zoneSearchQuery = 'a0'
                let dataTestId = 'incidenceKind'

                // Testing this, I see that there are only 2 possible results, either all 4 or none, I will first start by trying for none, and then I will try for 4.
                // All 4 of the items are in the fleet BARCELONA
                it('should return no results after searching for impossible query', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(willFailToFindInput)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        expect(element[0].children.length).to.equal(0)
                    })
                })

                it('should search for incidence kinds using the modal', function () {
                    const expectedSearchResultElements = 2
                    searchResultElements = expectedSearchResultElements

                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=searchButton]').click()
                    cy.wait(2500)
                    cy.get(`[data-test-id="${dataTestId}Details"]`).find(`[data-test-id="${dataTestId}Details.name"]`).contains(zoneSearchQuery).click()
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetails"]').its('length').should('eq', expectedSearchResultElements)
                })

                it('should search for incidence kinds by writing input and give same result as searched in modal', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(zoneSearchQuery)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        expect(element[0].childNodes.length).to.equal(searchResultElements)
                    })
                })
            })

            describe('expedient state', function () {
                let zoneSearchQuery = 'Autorizado Taller'
                let dataTestId = 'expedientState'

                it('should search for expedient states', function () {
                    const expectedSearchResultElements = 3

                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id="select"]').select(zoneSearchQuery)
                    cy.wait(2500)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetails"]').its('length').should('eq', expectedSearchResultElements)
                })
            })


            describe('service type', function () {
                let zoneSearchQuery = 'a4'
                let dataTestId = 'serviceType'

                it('should search for service types', function () {
                    const expectedSearchResultElements = 2

                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id="select"]').select(zoneSearchQuery)
                    cy.wait(2500)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetails"]').its('length').should('eq', expectedSearchResultElements)
                })
            })

            describe('from date', function () {
                let dataTestId = 'fromDate'
                let fromDate = '2019-07-01'

                // will fail if the total number of items in the zone is above 18, as to prove it is being filtered, I will assume that it will show a result
                // between 1 and 12 (25 being the default max it shows at once), the total number being shown as of 16/09/2019 is 12
                it('should correctly search from date', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(fromDate)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        expect(element[0].childNodes.length).to.be.greaterThan(0)
                        expect(element[0].childNodes.length).to.be.lessThan(12)
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
                let fromDate = '2019-07-01'

                // will fail if the total number of items in the zone is above 3, as to prove it is being filtered, I will assume that it will show a result
                // between 1 and 12 (25 being the default max it shows at once), the total number being shown as of 16/09/2019 is 12
                it('should correctly search from date', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(fromDate)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="serviceTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        expect(element[0].childNodes.length).to.be.greaterThan(0)
                        expect(element[0].childNodes.length).to.be.lessThan(12)
                    })
                })

                it('should correctly erase input on clear button press', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(fromDate)
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=resetIcon]').click({force: true})
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').should('be.empty')
                })
            })
        })
    })
})