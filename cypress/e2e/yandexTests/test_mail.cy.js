///<reference types="Cypress"/>

import 'cypress-file-upload'
import 'cypress-wait-until'

//import HomePage from '../pageObjects/HomePage';
let dataID = '';
let mailIndex;

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})

describe('Test Framework', () => {

    before(() => {
        cy.fixture('example').then(function (fixture_data) {
            this.data = fixture_data
        })
    })

    it("Using test data from fixture, config", function () {
        // Cypress.config("defaultCommandTimeout", 10000)

        cy.viewport(1280, 720)
        cy.visit(Cypress.env("url"))

        cy.get("body").then($body => {
            if ($body.find('.CheckboxCaptcha-Button').length > 0) {
                cy.get('.CheckboxCaptcha-Button').click()
                cy.pause()
            }
        });

        cy.get('.Button2_view_default').click()
        cy.get('#passp-field-login').type(Cypress.env("user_name"))
        cy.get("#passp\\:sign-in").click()
        cy.get('#passp-field-passwd').type(Cypress.env("user_password"))
        cy.get('#passp\\:sign-in').click()


        cy.get("body").then($body => {
            if ($body.find("div[class^='ns-view-messages-item-wrap ']").length > 0) {
                cy.get("div[class^='ns-view-messages-item-wrap ']").eq(0).then(function (el) {
                    dataID = el.prop("data-id")+''
                })
            }
        })

        // Write letter
        cy.get('.Layout-m__root--fQu5R > .Button2_type_link').click()
        cy.get("#compose-field-1").click()
        cy.get("div.ContactsSuggestItemDesktop-Name").eq(0).click()
        cy.get('#compose-field-subject-4').type(this.data.mail_theme)

        cy.get("input[class^='WithUpload-FileInput']").attachFile("file.pdf")
        cy.get("div[class^='LoadingProgress']", { timeout: 20000 }).should('not.exist')
        cy.get("div[class*='-SendButton'] button").click()

        cy.get("div[class='ComposeDoneScreen-Actions']").click()

        cy.get("body").then($body => {
            if ($body.find("div[class^='ns-view-messages-item-wrap ']").length > 0) {
                cy.get("div[class^='ns-view-messages-item-wrap ']").eq(0).then(function (el) {
                    if (el.prop("data-id") != dataID) {
                        dataID = el.prop("data-id")+''
                    }
                })
            }
        })


        cy.waitUntil(() => {
            cy.get("button[class$='-SyncButton']").click()


            cy.get("body").then($body => {
                if ($body.find("div[class^='ns-view-messages-item-wrap ']").length > 0) {
                    cy.get("div[class^='ns-view-messages-item-wrap ']").each((el, index, list) => {

                    let theme = el.find("span[class$='mail-MessageSnippet-Item_subject'] span[title]").text()
                    cy.log("MAIL THEME" + theme)
                    var mailDataID = el.attr("data-id") + ''
                    
                    cy.log("MAIL DATA ID " + mailDataID)
                    //let dataIDNum = parseInt(dataID.split('t')[1].trim)
                    let maildataIDNum = parseInt(mailDataID.split('t')[1].trim())
                    cy.log("MAIL SPLIT DATA ID " + maildataIDNum)

                    if (theme.includes(this.data.mail_theme)) {
                        
                        mailIndex = index
                        return cy.get("button[class$='-SyncButton']").click().then(() => true)
                    } else {
                        return cy.get("button[class$='-SyncButton']").click().then(() => false)
                    }
                })
              }
            })
        })

    })


});

