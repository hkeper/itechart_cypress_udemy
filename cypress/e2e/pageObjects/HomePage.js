class HomePage
{
    getSignInButton(){
        return cy.get('#signin')
    }

    getEditBox(){
        return cy.get('input[name="name"]').eq(0)
    }
    getTwoWayDataBinding(){
        return cy.get(":nth-child(4) > .ng-valid")
    }
    getGender(){
        return cy.get('select')
    }
    getEntrepreneurRadioButton(){
        return cy.get('#inlineRadio3')
    }
    getShopTab(){
        return cy.get(':nth-child(2) > .nav-link')
    }

}

export default HomePage