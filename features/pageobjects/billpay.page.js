import Page from './page.js';

class BillPayPage extends Page {
    // Payee information fields
    get payeeNameInput () {
        return $('input[name="payee.name"]');
    }

    get addressInput () {
        return $('input[name="payee.address.street"]');
    }

    get cityInput () {
        return $('input[name="payee.address.city"]');
    }

    get stateInput () {
        return $('input[name="payee.address.state"]');
    }

    get zipCodeInput () {
        return $('input[name="payee.address.zipCode"]');
    }

    get phoneInput () {
        return $('input[name="payee.phoneNumber"]');
    }

    // Account details
    get accountNumberInput () {
        return $('input[name="payee.accountNumber"]');
    }

    get verifyAccountInput () {
        return $('input[name="verifyAccount"]');
    }

    get amountInput () {
        return $('input[name="amount"]');
    }

    get fromAccountSelect () {
        return $('select[name="fromAccountId"]');
    }

    get sendPaymentButton () {
        return $('input[type="button"][value="Send Payment"]');
    }

    // Success/Error messages
    get successMessage () {
        return $('#billpayResult h1');
    }

    get errorMessage () {
        return $('#billpayError');
    }

    get validationErrors () {
        return $$('[id^="validationModel"]');
    }

    async fillPayeeInfo (name, address, city, state, zipcode, phone) {
        // Esperar a que los campos estén disponibles
        await this.payeeNameInput.waitForExist({ timeout: 10000 });
        await this.payeeNameInput.waitForClickable({ timeout: 5000 });
        await browser.pause(500);
        
        await this.payeeNameInput.setValue(name);
        await browser.pause(200);
        await this.addressInput.setValue(address);
        await browser.pause(200);
        await this.cityInput.setValue(city);
        await browser.pause(200);
        await this.stateInput.setValue(state);
        await browser.pause(200);
        await this.zipCodeInput.setValue(zipcode);
        await browser.pause(200);
        await this.phoneInput.setValue(phone);
        await browser.pause(200);
    }

    async fillAccountDetails (account, verify, amount) {
        await this.accountNumberInput.waitForClickable({ timeout: 5000 });
        await browser.pause(300);
        await this.accountNumberInput.setValue(account);
        await browser.pause(200);
        await this.verifyAccountInput.setValue(verify);
        await browser.pause(200);
        await this.amountInput.setValue(amount);
        await browser.pause(200);
    }

    async getAvailableAccounts () {
        await this.fromAccountSelect.waitForExist({ timeout: 5000 });
        
        // Esperar a que las opciones se carguen
        await browser.waitUntil(
            async () => {
                const options = await this.fromAccountSelect.$$('option');
                return options.length > 0;
            },
            { timeout: 5000, timeoutMsg: 'Expected account options to load after 5s' }
        );
        
        const options = await this.fromAccountSelect.$$('option');
        const accountIds = [];
        
        for (const option of options) {
            const value = await option.getText();
            if (value && value.trim() !== '') {
                accountIds.push(value.trim());
            }
        }
        
        return accountIds;
    }

    async selectFromAccount (accountNumber) {
        await this.fromAccountSelect.waitForExist({ timeout: 10000 });
        await this.fromAccountSelect.waitForClickable({ timeout: 5000 });
        
        // Esperar a que las opciones se carguen
        await browser.waitUntil(
            async () => {
                const options = await this.fromAccountSelect.$$('option');
                return options.length > 0;
            },
            { timeout: 5000, timeoutMsg: 'Expected account options to load after 5s' }
        );
        
        await browser.pause(500);
        await this.fromAccountSelect.selectByVisibleText(accountNumber);
        await browser.pause(300);
    }

    async submitPayment () {
        await this.sendPaymentButton.waitForClickable({ timeout: 5000 });
        await browser.pause(500);
        await this.sendPaymentButton.click();
        await browser.pause(2000);
        
        // Esperar a que aparezca el resultado o error
        await browser.waitUntil(
            async () => {
                const result = await $('#billpayResult');
                const error = await $('#billpayError');
                const resultDisplayed = await result.isDisplayed();
                const errorDisplayed = await error.isDisplayed();
                const validationErrors = await this.validationErrors;
                
                return resultDisplayed || errorDisplayed || validationErrors.length > 0;
            },
            { timeout: 10000, timeoutMsg: 'Expected result, error, or validation message to appear' }
        );
    }

    async open () {
        // En lugar de navegar directamente, hacer click en el enlace del menú
        const billPayLink = await $('a[href="billpay.htm"]');
        await billPayLink.waitForExist({ timeout: 5000 });
        await billPayLink.click();
        
        // Esperar a que el formulario esté listo
        await this.payeeNameInput.waitForExist({ timeout: 5000 });
    }
}

export default new BillPayPage();
