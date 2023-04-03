///<reference types="Cypress"/>
///<reference types="cypress-iframe"/>

import 'cypress-file-upload'
import 'cypress-iframe'
import 'cypress-wait-until'
import HomePage from '../pageObjects/HomePage';
import ShopPage from '../pageObjects/ShopPage';
import LoginPage from '../pageObjects/LoginPage';

describe('Test Framework', () => {

    before(() =>{
        cy.fixture('test_data').then(function(fixture_data) {
            this.data = fixture_data
        })
    })

    it.skip("Custom actions with parametrizing data from json, Page objects", function() {
        const homePage = new HomePage()
        const shopPage = new ShopPage()
        var sum = 0

        cy.viewport(1280, 720)
        cy.visit(Cypress.env("shop_url"))//"https://rahulshettyacademy.com/angularpractice/")
        homePage.getEditBox().type(this.data.name)
        homePage.getGender().select(this.data.gender)

        homePage.getTwoWayDataBinding().should('have.value', this.data.name)
        homePage.getEditBox().should("have.attr", "minlength", 2)
        homePage.getEntrepreneurRadioButton().should('be.disabled')

        homePage.getShopTab().click()//.debug()
        //cy.pause()    
        this.data.productName.forEach(element => {
            cy.selectProduct(element)
        });

        shopPage.getCheckoutButton().click()

        cy.get('tr td:nth-child(4) strong').each((el, index, list) => {
            const amount = el.text()
            var res = amount.split(" ")[1].trim()
            sum = Number(sum) + Number(res)
        }).then(function() { cy.log(sum) })

        cy.get("h3 strong").then(function(el) {
            const amount = el.text()
            var total = amount.split(" ")[1].trim()
            expect(Number(total)).to.equal(sum)
        })

        cy.get(':nth-child(4) > :nth-child(5) > .btn').click()
        cy.get("#country").type("India")
        cy.get("a:contains('India')").click()
        cy.get("#checkbox2").check({force: true})
        cy.get("#checkbox2").should("be.checked")
        cy.get("input[type='submit']").click()
        //cy.get('.alert').should("include", "Success! Thank you! Your order will be delivered in next few weeks :-).")
        cy.get('.alert').should(($el) => {
            expect($el.text()).to.include("Success! Thank you! Your order will be delivered in next few weeks :-).");
          })

        //Check if element present
        cy.get("body").then($body => {
            if ($body.find('.CheckboxCaptcha-Button').length > 0) {
                cy.get('.CheckboxCaptcha-Button').click()
                cy.pause()
            }
        })



        const loginPage = new LoginPage()

        const fileName = 'cypress/fixtures/read-write/attachment.txt'

        cy.viewport(1280, 720)
        cy.visit(Cypress.env("url"))

        homePage.getSignInButton().click()
        loginPage.login(Cypress.env("user_id"), Cypress.env("user_password"))
        
        cy.writeFile('cypress/fixtures/read-write/attachment.txt', "Test file for testing email attachment")


        cy.get('#nav-mail').click()
        cy.get('#mailNewBtn').click()

        cy.get("body")
        .then(function($body) {
        cy.get('div#mailTo input').type(this.data.email)
        cy.get('#mailSubject').type(this.data.mail_theme)
        cy.get('.GCSDBRWBKSB > :nth-child(2)').click()
        cy.get('#new_email_attach input').attachFile('read-write/attachment.txt')
        cy.get("[id*=upload_id]", { timeout: 60000 }).should('not.exist')
        cy.get('#mailSend').click()

        cy.get('[style="margin-top:20px;text-align:center"] > .loadingIcon').should('not.be.visible')

        // cy.get("body")
        // .then(function($body) {
            if ($body.find("tr[id^='gwt-uid-9']").length > 0) {  
                cy.get('tr[class*="trow"]:first-of-type').then(function(el) {                
                    dataID = el.attr('id')
                    cy.log('First ' + dataID)
                })
            }
        })       

    })


    it("Test mail recieve and move to trash", function () {
        // Cypress.config("defaultCommandTimeout", 10000)
        const homePage = new HomePage()
        const loginPage = new LoginPage()

        const fileName = 'cypress/fixtures/read-write/attachment.txt'

        cy.viewport(1280, 720)
        cy.visit(Cypress.env("url"))

        homePage.getSignInButton().click()
        loginPage.login(Cypress.env("user_id"), Cypress.env("user_password"))
        
        cy.writeFile('cypress/fixtures/read-write/attachment.txt', "Test file for testing email attachment")

        cy.get('#nav-mail').click()
        cy.get('#mailNewBtn').click()
        cy.get('div#mailTo input').type(this.data.email)
        cy.get('#mailSubject').type(this.data.mail_theme)
        cy.get('.GCSDBRWBKSB > :nth-child(2)').click()
        cy.get('#new_email_attach input').attachFile('read-write/attachment.txt')
        cy.get("[id*=upload_id]", { timeout: 60000 }).should('not.exist')
        cy.get('#mailSend').click()

        cy.get('[style="margin-top:20px;text-align:center"] > .loadingIcon').should('not.be.visible')

        // cy.get("body")
        // .then(function($body) {
        //     if ($body.find("tr[id^='gwt-uid-9']").length > 0) {  
        //         cy.get('tr[class*="trow"]:first-of-type').then(function(el) {                
        //             dataID = el.attr('id')
        //             cy.log('First ' + dataID)
        //         })
        //     }
        // })       

        cy.waitUntil(() => {                   

            // cy.get("body").then($body => {
                // if ($body.find("tr[id^='gwt-uid-9']").length > 0) {   

                    cy.get("tr[class*='trow']").each((el, index, list) => {

                        const mail_theme = el.find("div.listSubject").attr('title')
                        if(mail_theme === this.data.mail_theme){

                            let eachMailId = el.attr('id')
                            let eachMailIdNum = parseInt(eachMailId.split('_')[1].trim())
                            let dataIDNum = parseInt(dataID.split('_')[1].trim())
                            if(eachMailIdNum > dataIDNum) {
                                cy.log(eachMailIdNum)
                                cy.log(dataIDNum)
                                return
                            }
                        }
                })
            //   } 
            // })
            cy.wait(1000)
            cy.get('div[class~="toolbar"] div[class*="Refresh"]').click()
        })

        // cy.get("div[class='ComposeDoneScreen-Actions']").click()

        // cy.get("body").then($body => {
        //     if ($body.find("div[class^='ns-view-messages-item-wrap ']").length > 0) {
        //         cy.get("div[class^='ns-view-messages-item-wrap ']").eq(0).then(function (el) {
        //             if (el.attr("data-id") != dataID) {
        //                 dataID = el.attr("data-id")+''
        //             }
        //         })
        //     }
        // })

        // cy.waitUntil(() => {
        //     cy.get("button[class$='-SyncButton']").click()

        //     cy.get("body").then($body => {
        //         if ($body.find("div[class^='ns-view-messages-item-wrap ']").length > 0) {

        //             cy.get("div[class^='ns-view-messages-item-wrap ']").each((el, index, list) => {

        //             let theme = el.find("span[class$='mail-MessageSnippet-Item_subject'] span[title]").text()
        //             cy.log("MAIL THEME " + theme)
        //             cy.log("Test DATA THEME " + this.data.mail_theme)
        //             cy.log("INCLUDE " + theme.includes(this.data.mail_theme))

        //             var mailDataID = el.attr("data-id") + ''                    
        //             cy.log("MAIL DATA ID " + mailDataID)
        //             let dataIDNum = parseInt(dataID.split('t')[1].trim())
        //             let maildataIDNum = parseInt(mailDataID.split('t')[1].trim())
        //             cy.log("MAIL SPLIT DATA ID " + maildataIDNum)

        //             if (theme.includes(this.data.mail_theme)) {

        //                 mailIndex = index
                        
        //             } 
        //         }).then(() => {})
        //       } 
        //     })
        // })

    })


});

