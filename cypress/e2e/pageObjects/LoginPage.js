class LoginPage
{
    getUserIDInput(){
        return cy.get('#UserID')
    }
    getPasswordInput(){
        return cy.get('#Password')
    }
    getSubmitButton(){
        return cy.get("[type='submit']")
    }

    login(userId, password) {
        this.getUserIDInput().type(userId)
        this.getPasswordInput().type(password)
        this.getSubmitButton().click()
    }

}

export default LoginPage