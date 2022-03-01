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


    describe('Unity', function () {
        const randomTestNumber = () => Math.floor(Math.random() * 1000)
        const testUnityName = `00${randomTestNumber()}-cypress-${randomTestNumber()}`

        describe('Unity basics + table', function () {
            it('should visit the page correctly', function () {
                cy.visit('#/home/unity')
                cy.url().should('eq', 'http://127.0.0.1:9000/#/home/unity')
            })

            it('should correctly show loading icon on visiting the page and correctly hide', function () {
                cy.visit('#/home/unity')
                cy.get('[data-test-id="loadingIcon"]').then(($el) => {
                    expect(Cypress.dom.isHidden($el)).to.equal(false)
                })
                cy.wait(2500)
                cy.get('[data-test-id="loadingIcon"]').then(($el) => {
                    expect(Cypress.dom.isHidden($el)).to.equal(true)
                })
            })

            it('should correctly show data on the tables', function () {
                cy.get('[data-test-id="unityTableDetails"]').then($el => {
                    expect($el[0]).to.not.equal(undefined)
                })
            })

            it('should correctly refresh page', function () {
                cy.get('[data-test-id="reloadItems"]').click()
                cy.get('[data-test-id="loadingIcon"]').then(($el) => {
                    expect(Cypress.dom.isHidden($el)).to.equal(false)
                })
                cy.wait(2500)
                cy.get('[data-test-id="unityTableDetails"]').then($el => {
                    expect($el[0]).to.not.equal(undefined)
                })
            })
        })

        describe('unity - search box', function () {

            before(() => {
                cy.restoreLocalStorage()
                cy.visit('#/home/unity')
                cy.url().should('eq', 'http://127.0.0.1:9000/#/home/unity')
                cy.get('[data-test-id="toggleSearchBox"]').click()
            })

            afterEach(() => {
                cy.get('[data-test-id="name"]').find('[data-test-id="input"]').clear()
                cy.get('[data-test-id="zone"]').find('[data-test-id="input"]').clear()
                cy.get('[data-test-id="province"]').find('[data-test-id="input"]').clear()
            })
            const willFailToFindInput = `cypress-${Math.random()}`

            it('should not show any info on typing impossible name', function () {
                cy.get('[data-test-id="name"]').find('[data-test-id="input"]').type(willFailToFindInput)
                cy.get('[data-test-id="searchClick"]').click()
                cy.wait(2500)
                cy.get('[data-test-id="unityTableDetailsHeader"]').then(element => {
                    console.log(element)
                    expect(element[0].children.length).to.equal(0)
                })
            })

            it('should correctly show data again on empty table on clearSearch click', function () {
                cy.get('[data-test-id="name"]').find('[data-test-id="input"]').type(willFailToFindInput)
                cy.get('[data-test-id="searchClick"]').click()
                cy.wait(2500)
                cy.get('[data-test-id="unityTableDetailsHeader"]').then(element => {
                    expect(element[0].children.length).to.equal(0)
                })

                cy.get('[data-test-id="clearSearch"]').click()
                cy.wait(2500)
                cy.get('[data-test-id="unityTableDetails"]').then($el => {
                    expect($el[0]).to.not.equal(undefined)
                })
            })

            describe('zones', function () {

                let searchResultElements
                let zoneSearchQuery = 'Barcelona'

                // will fail if the total number of items in the zone is above 18, as to prove it is being filtered, I will assume that it will show a result
                // between 1 and 25 (25 being the default max it shows at once)
                it('should search for zones using the modal', function () {
                    cy.get('[data-test-id="zone"]').find('[data-test-id=searchButton]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="zoneDetails"]').find('[data-test-id="zoneDetails.name"]').contains(zoneSearchQuery).click()
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="unityTableDetailsHeader"]').then(element => {
                        console.log('zoneElements', element)
                        searchResultElements = element[0].childNodes.length
                        expect(element[0].childNodes.length).to.be.greaterThan(0)
                        expect(element[0].childNodes.length).to.be.lessThan(25)
                    })
                })

                it('should search for zones by writing input and give same result as searched in modal', function () {
                    cy.get('[data-test-id="zone"]').find('[data-test-id=input]').type(zoneSearchQuery)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="unityTableDetailsHeader"]').then(element => {
                        console.log('zoneElements', element)
                        expect(element[0].childNodes.length).to.equal(searchResultElements)
                    })
                })

                it('should return no results after searching for impossible query', function () {
                    cy.get('[data-test-id="zone"]').find('[data-test-id=input]').type(willFailToFindInput)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="unityTableDetailsHeader"]').then(element => {
                        console.log('zoneElements', element)
                        expect(element[0].children.length).to.equal(0)
                    })
                })

            })

            describe('provinces', function () {

                let searchResultElements
                let zoneSearchQuery = 'Barcelona'
                let dataTestId = 'province'

                // will fail if the total number of items in the zone is above 18, as to prove it is being filtered, I will assume that it will show a result
                // between 1 and 25 (25 being the default max it shows at once), the total number being shown as of 16/09/2019 is above 25
                it('should search for units using the modal', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=searchButton]').click()
                    cy.wait(2500)
                    cy.get(`[data-test-id="${dataTestId}Details"]`).find(`[data-test-id="${dataTestId}Details.name"]`).contains(zoneSearchQuery).click()
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="unityTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        searchResultElements = element[0].childNodes.length
                        expect(element[0].childNodes.length).to.be.greaterThan(0)
                        expect(element[0].childNodes.length).to.be.lessThan(25)
                    })
                })

                it('should search for zones by writing input and give same result as searched in modal', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(zoneSearchQuery)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="unityTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        expect(element[0].childNodes.length).to.equal(searchResultElements)
                    })
                })

                it('should return no results after searching for impossible query', function () {
                    cy.get(`[data-test-id="${dataTestId}"]`).find('[data-test-id=input]').type(willFailToFindInput)
                    cy.get('[data-test-id="searchClick"]').click()
                    cy.wait(2500)
                    cy.get('[data-test-id="unityTableDetailsHeader"]').then(element => {
                        console.log(dataTestId, element)
                        expect(element[0].children.length).to.equal(0)
                    })
                })

            })
        })

        describe('should correctly add a new unit', function () {

            before(() => {
                cy.visit('#/home/unity')
                cy.url().should('eq', 'http://127.0.0.1:9000/#/home/unity')
            })

            afterEach(() => {

            })

            it('should correctly visit add unit after pressing the add button', function () {
                cy.get(`[data-test-id="addNewButton"]`).click()
                cy.url().should('eq', 'http://127.0.0.1:9000/#/home/unity/add')
            })

            it('should not be able to create a new unit on empty form', function () {
                cy.get(`[data-test-id="addUnit"]`).should('be.visible')

                cy.get(`[data-test-id="addUnit"]`).should('be.disabled')
            })

            it('should not be able to create a new unit on empty name but other fields full', function () {
                const codiRedInput = 'codiRedTest'
                const addressInput = 'addressTest'
                const zipCodeInput = 'zipCodeTest'

                cy.get(`[data-test-id="codired"]`).find(`[data-test-id="input"]`).type(codiRedInput)
                cy.get(`[data-test-id="address"]`).find(`[data-test-id="input"]`).type(addressInput)
                cy.get(`[data-test-id="zipCode"]`).find(`[data-test-id="input"]`).type(zipCodeInput)

                cy.get(`[data-test-id="addUnit"]`).should('be.disabled')


            })

            it('should successfully fill cost center input', function () {
                const costCenterSearchQuery = '0030-ALICA'

                cy.get(`[data-test-id="cecoSearchModal"]`).find(`a`).click()
                cy.wait(2500)
                cy.get('[data-test-id="costCenterDetails"]').find('[data-test-id="costCenterDetails.name"]').contains(costCenterSearchQuery).click()
                cy.get(`[data-test-id="cecoInput"]`).find('input').then($element => {
                    console.log($element)
                    expect($element[0].defaultValue).to.equal(costCenterSearchQuery)
                })
            })

            it('should successfully fill province input', function () {
                const provinceSearchQuery = 'Madrid'

                cy.get(`[data-test-id="provinceSearchModal"]`).find(`a`).click()
                cy.wait(2500)
                cy.get('[data-test-id="provinceDetails"]').find('[data-test-id="provinceDetails.name"]').contains(provinceSearchQuery).click()
                cy.get(`[data-test-id="provinceInput"]`).find('input').then($element => {
                    console.log($element)
                    expect($element[0].defaultValue).to.equal(provinceSearchQuery)
                })
            })

            it('should successfully fill city input', function () {
                const citySearchQuery = 'Madrid'

                cy.get(`[data-test-id="citySearchModal"]`).find(`a`).click()
                cy.wait(2500)
                cy.get('[data-test-id="cityDetails"]').find('[data-test-id="cityDetails.name"]').contains(citySearchQuery).click()
                cy.get(`[data-test-id="cityInput"]`).find('input').then($element => {
                    console.log($element)
                    expect($element[0].defaultValue).to.equal(citySearchQuery)
                })
            })

            it('should successfully fill zone input', function () {
                const zoneSearchQuery = 'zona01'

                cy.get(`[data-test-id="zoneSearchModal"]`).find(`a`).click()
                cy.wait(2500)
                cy.get('[data-test-id="zoneDetails"]').find('[data-test-id="zoneDetails.name"]').contains(zoneSearchQuery).click()
                cy.get(`[data-test-id="zoneInput"]`).find('input').then($element => {
                    console.log($element)
                    expect($element[0].defaultValue).to.equal(zoneSearchQuery)
                })
            })

            it('should successfully fill customer input', function () {
                const customerSearchQuery = 'DEMO'

                cy.get(`[data-test-id="customerSearchModal"]`).find(`a`).click()
                cy.wait(2500)
                cy.get('[data-test-id="customerDetails"]').find('[data-test-id="customerDetails.name"]').contains(customerSearchQuery).click()
                cy.get(`[data-test-id="customerInput"]`).find('input').then($element => {
                    console.log($element)
                    expect($element[0].defaultValue).to.equal(customerSearchQuery)
                })
            })

            it('should sucessfully check YES on main unit', function () {
                cy.get(`[data-test-id="principalTrueInput"]`).check()
                cy.get(`[data-test-id="principalTrueInput"]`).should('be.checked')
                cy.get(`[data-test-id="principalFalseInput"]`).should('not.be.checked')
            })

            it('should sucessfully check NO on main unit', function () {
                cy.get(`[data-test-id="principalFalseInput"]`).check()
                cy.get(`[data-test-id="principalFalseInput"]`).should('be.checked')
                cy.get(`[data-test-id="principalTrueInput"]`).should('not.be.checked')
            })

            it('should let create new unit after writing in the name', function () {
                cy.get(`[data-test-id="name"]`).find(`[data-test-id="input"]`).type(testUnityName)
                cy.get(`[data-test-id="addUnit"]`).click()
                cy.wait(2500)
                cy.get(`[data-test-id="confirmActionMessageChild"]`).should('be.visible')
            })

            it('should correctly delete a newly created unit', function () {
                cy.contains(testUnityName).parent()
                    .find('[data-test-id="deleteUnity"]').click()
                cy.get('[data-test-id="confirmDeleteButton"]').click()
                cy.wait(2500)
                cy.get(`[data-test-id="unityTableDetails"]`)
                    .find(`[data-test-id="unityTableDetails.name"]`)
                    .contains(testUnityName).should('not.exist')
            })
        })

    })

})