///<reference types="Cypress"/>

import 'cypress-file-upload'
import 'cypress-wait-until'

import HomePage from '../pageObjects/HomePage';
import LoginPage from '../pageObjects/LoginPage';
import MailPage from '../pageObjects/MailPage';

const random = () => Cypress._.random(0, 1e6)
const mail_id = random()

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})

describe('Test mail recieve with mailfence', () => {

    before(() => {
        cy.fixture('test_data').then(function (fixture_data) {
            this.data = fixture_data
        })
    })

    it("Test mail recieve and move to trash", function () {
        // Cypress.config("defaultCommandTimeout", 10000)
        const homePage = new HomePage()
        const loginPage = new LoginPage()
        const mailPage = new MailPage()

        const fileName = 'read-write/attachment.txt'

        cy.viewport(1280, 720)
        cy.visit(Cypress.env("url"))

        homePage.getSignInButton().click()
        loginPage.login(Cypress.env("user_id"), Cypress.env("user_password"))

        cy.writeFile('cypress/fixtures/read-write/attachment.txt', "Test file for testing email attachment")

        cy.get('div[class~="toolbar"] div[class*="Refresh"]').click()
        cy.get('tbody:not([style*="display: none"]) div.loadingIcon').should('not.exist')

        cy.get('#nav-mail').click()
        cy.get('#mailNewBtn').click()
        cy.get('div#mailTo input').type(this.data.email)
        cy.get('#mailSubject').type(mail_id)
        cy.get('.GCSDBRWBKSB > :nth-child(2)').click()
        cy.get('#new_email_attach input').attachFile(fileName)
        cy.get("[id*=upload_id]", { timeout: 60000 }).should('not.exist')
        cy.get('#mailSend').click()
        cy.get('tbody:not([style*="display: none"]) div.loadingIcon').should('not.exist')

        cy.reload()

        mailPage.waitNewEmailWithTheme(mail_id)

        

        //Open email
        //cy.get('tr[class*="trow"]:first-of-type').click()


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



    it.skip("Test2", () => {
        cy.visit(Cypress.env("url"))


        const homePage = new HomePage()
        const loginPage = new LoginPage()

        homePage.getSignInButton().click()
        loginPage.login(Cypress.env("user_id"), Cypress.env("user_password"))

    })


});

