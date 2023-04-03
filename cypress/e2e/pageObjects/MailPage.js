class MailPage
{
    getMailToInput(){
        return cy.get('div#mailTo input')
    }

    getMailTheme(){
        return cy.get('#mailSubject')
    }

    enterMailToAndTheme(mailTo, mailTheme){
        this.getMailToInput().type(mailTo)
        this.getMailTheme().type(mailTheme)
    }

    waitNewEmailWithTheme(mail_id, count = 10, wait = 1000) {
        if(count <= 0) return

        cy.get('div[class~="toolbar"] div[class*="Refresh"]').click()
        cy.get('tbody:not([style*="display: none"]) div.loadingIcon').should('not.exist')

        cy.get("body").then($body => {
            if ($body.find('tr[class*="trow"]:first-of-type').length > 0) {
                cy.get('tr[class*="trow"]:first-of-type').then(function (el) {
                    const mail_theme = parseInt(el.find("div.listSubject").attr('title'))
                    if (mail_theme === mail_id) {
                        return false
                    }
                    else {                        
                        count -= 1
                        cy.wait(wait)
                        waitNewEmailWithTheme(mail_id, count)
                    }
                })
            } else {
                count -= 1
                cy.wait(wait)
                waitNewEmailWithTheme(mail_id, count)
            } 
        })
    }

}

export default MailPage