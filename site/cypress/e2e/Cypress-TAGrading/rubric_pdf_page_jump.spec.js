// Each component of grading_scanned_exam is assigned the upload.pdf page with its number
const component = (title) => cy.contains('[data-testid="component-container"]', title);

function openComponent(title) {
    component(title).click(20, 25);
    component(title).find('[data-testid="save-tools-save"]', { timeout: 20000 }).should('contain', 'Save');
}

function saveComponent(title) {
    component(title).find('[data-testid="save-tools-save"]').click();
    component(title).find('[data-testid="save-tools-save"]').should('not.exist');
}

function shouldShowPdfPage(page) {
    cy.get('#submission_browser', { timeout: 20000 }).should(($panel) => {
        const doc = $panel[0].ownerDocument;
        const rect = $panel[0].getBoundingClientRect();
        const middle = (Math.max(rect.top, 0) + Math.min(rect.bottom, doc.defaultView.innerHeight)) / 2;
        const shown = doc.elementFromPoint(rect.left + (rect.width / 2), middle)?.closest('.page');
        expect(shown?.id, 'PDF page in the middle of the Files panel').to.equal(`pageContainer${page}`);
    });
}

describe('Rubric PDF page jump', () => {
    beforeEach(() => {
        cy.login('instructor');
        cy.visit(['sample', 'gradeable', 'grading_scanned_exam', 'grading', 'grade?who_id=xnS0mfdE4QILD3b&sort=id&direction=ASC']);
        cy.get('[data-testid="panel-selector-toggle"]').click();
        cy.get('[data-testid="layout-two-panel-equal-apply"]').click();
        cy.get('[data-testid="show-submission"]').click();
        cy.get('#submission_browser_btn [data-testid="panel-position-select"]').select('leftTop');
        cy.get('[data-testid="grading-rubric-panel-toggle"]').click();
        cy.get('#grading_rubric_btn [data-testid="panel-position-select"]').select('rightTop');
        cy.get('.openable-element-submissions').contains('upload.pdf').should('exist');
        cy.get('[data-testid="component-container"]', { timeout: 20000 }).should('have.length', 3);
    });

    it('opens upload.pdf at the page of the opened component', () => {
        openComponent('Question 2');
        shouldShowPdfPage(2);
    });

    it('scrolls the open upload.pdf to the page of each opened component', () => {
        openComponent('Question 3');
        shouldShowPdfPage(3);
        saveComponent('Question 3');
        openComponent('Question 1');
        shouldShowPdfPage(1);
    });
});
