describe('template spec', () => {
  it('passes', () => {
    cy.intercept('POST', '**/rest/v1/rpc/get_deck_cards').as('getDeckCards');
    cy.intercept('POST', '**/rest/v1/rpc/collection_summary').as('getCollectionSummary');

    cy.visit('https://sharkinovhomecourt.vercel.app/login')
    cy.get('#root input[placeholder="Email"]').click();
    cy.get('#root input[placeholder="Email"]').type('lakerFan@lakerscourt.com');
    cy.get('#root input[placeholder="Password"]').click();
    cy.get('#root input[placeholder="Password"]').type('abc123');
    cy.get('#root button.text-white').click();
    cy.get('#root div.lg\\:gap-8 button:nth-child(5)').click();
    cy.get('#root div.hidden button:nth-child(6)').click();
    cy.get('#root button.bg-transparent').click();
    cy.get('#root div:nth-child(1) > div.grid > button:nth-child(2)').click();
    cy.get('#root div:nth-child(1) > div.grid > button:nth-child(3)').click();
    cy.get('#root div:nth-child(1) > div.grid > button:nth-child(4)').click();
    cy.get('#root div:nth-child(1) > div.grid > button:nth-child(5)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(2)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(3)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(4)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(5)').click();
    cy.get('#root div:nth-child(1) > div.grid > button:nth-child(1)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(1)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(2)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(3)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(4)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(5)').click();
    cy.get('#root div:nth-child(1) > div.grid > button:nth-child(2)').click();
    cy.get('#root div.md\\:gap-2 > div:nth-child(2)').click();
    cy.wait('@getCollectionSummary');
    cy.wait('@getDeckCards');
    cy.get('#root div.grid > button').should(($buttons) => {
      expect($buttons.length).to.be.greaterThan(0);
    });
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(1)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(2)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(3)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(4)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(5)').click();
    cy.get('#root div:nth-child(1) > div.grid > button:nth-child(3)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(1)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(2)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(3)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(4)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(5)').click();
    cy.get('#root div:nth-child(1) > div.grid > button:nth-child(4)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(1)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(2)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(3)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(4)').click();
    cy.get('#root div:nth-child(1) > div.grid > button:nth-child(5)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(1)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(2)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(3)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(4)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(5)').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(1)').click();
    cy.get('#root div:nth-child(1) > div.grid > button:nth-child(1)').click();
    cy.get('#root img.z-0').click();
    cy.get('#root div.md\\:grid-cols-4 > div:nth-child(2)').click();
    cy.get('#root div.bg-royal-blue').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(3)').click();
    cy.get('#root div:nth-child(2) div.flex').click();
    cy.get('#root div:nth-child(2) > div.grid > button:nth-child(2)').click();
    cy.get('#root div:nth-child(2) button.flex').click();
    cy.get('#root div:nth-child(2) button.flex span:nth-child(2)').click();
  })
})