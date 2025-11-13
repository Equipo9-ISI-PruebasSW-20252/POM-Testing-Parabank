import Page from './page.js';

/**
 * sub page containing specific selectors and methods for the Loan Request page
 */
class LoanRequestPage extends Page {
    /**
     * define selectors using getter methods
     */
    // Input fields
    get loanAmountInput() {
        return $('#amount');
    }

    get downPaymentInput() {
        return $('#downPayment');
    }

    get fromAccountDropdown() {
        return $('#fromAccountId');
    }

    // Submit button
    get applyNowButton() {
        return $('input[type="button"][value="Apply Now"]');
    }

    // Result messages
    get loanProviderName() {
        return $('#loanProviderName');
    }

    get loanStatus() {
        return $('#loanStatus');
    }

    get approvalMessage() {
        return $('#loanRequestApproved');
    }

    get denialMessage() {
        return $('#loanRequestDenied');
    }

    get errorMessage() {
        return $('#loanRequestError');
    }

    /**
     * Methods to interact with the page
     */
    async fillLoanAmount(amount) {
        await this.loanAmountInput.waitForExist({ timeout: 10000 });
        await this.loanAmountInput.waitForClickable({ timeout: 5000 });
        await browser.pause(500);
        await this.loanAmountInput.setValue(amount);
    }

    async fillDownPayment(downPayment) {
        await this.downPaymentInput.waitForClickable({ timeout: 5000 });
        await browser.pause(500);
        await this.downPaymentInput.setValue(downPayment);
    }

    async getAvailableAccounts() {
        await this.fromAccountDropdown.waitForExist({ timeout: 5000 });
        // Wait for options to be populated
        await browser.waitUntil(
            async () => {
                const options = await this.fromAccountDropdown.$$('option');
                return options.length > 0;
            },
            {
                timeout: 5000,
                timeoutMsg: 'Expected account dropdown to have options after 5s'
            }
        );
        
        const options = await this.fromAccountDropdown.$$('option');
        const accountIds = [];
        
        for (const option of options) {
            const value = await option.getText();
            if (value && value.trim() !== '') {
                accountIds.push(value.trim());
            }
        }
        
        return accountIds;
    }

    async selectFromAccount(accountNumber) {
        await this.fromAccountDropdown.waitForExist({ timeout: 10000 });
        await this.fromAccountDropdown.waitForClickable({ timeout: 5000 });
        // Wait for options to be populated
        await browser.waitUntil(
            async () => {
                const options = await this.fromAccountDropdown.$$('option');
                return options.length > 0;
            },
            {
                timeout: 5000,
                timeoutMsg: 'Expected account dropdown to have options after 5s'
            }
        );
        await browser.pause(500);
        await this.fromAccountDropdown.selectByVisibleText(accountNumber);
        await browser.pause(300);
    }

    async submitLoanRequest() {
        await this.applyNowButton.waitForClickable({ timeout: 5000 });
        await this.applyNowButton.click();
        await browser.pause(1000);
        
        // Wait for one of the result elements to appear
        await browser.waitUntil(
            async () => {
                const approval = await this.approvalMessage.isExisting();
                const denial = await this.denialMessage.isExisting();
                const error = await this.errorMessage.isExisting();
                return approval || denial || error;
            },
            {
                timeout: 10000,
                timeoutMsg: 'Expected loan result to be displayed after 10s'
            }
        );
    }

    /**
     * Navigate to Request Loan page using menu link
     */
    async open() {
        const loanLink = await $('a[href="requestloan.htm"]');
        await loanLink.waitForExist({ timeout: 5000 });
        await loanLink.click();
        await this.loanAmountInput.waitForExist({ timeout: 5000 });
    }
}

export default new LoanRequestPage();
