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
}

export default LoginPage