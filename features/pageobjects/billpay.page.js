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
        await this.payeeNameInput.waitForExist({ timeout: 5000 });
        
        await this.payeeNameInput.setValue(name);
        await this.addressInput.setValue(address);
        await this.cityInput.setValue(city);
        await this.stateInput.setValue(state);
        await this.zipCodeInput.setValue(zipcode);
        await this.phoneInput.setValue(phone);
    }

    async fillAccountDetails (account, verify, amount) {
        await this.accountNumberInput.setValue(account);
        await this.verifyAccountInput.setValue(verify);
        await this.amountInput.setValue(amount);
    }

    async selectFromAccount (accountNumber) {
        await this.fromAccountSelect.waitForExist({ timeout: 5000 });
        
        // Esperar a que las opciones se carguen
        await browser.waitUntil(
            async () => {
                const options = await this.fromAccountSelect.$$('option');
                return options.length > 0;
            },
            { timeout: 5000, timeoutMsg: 'Expected account options to load after 5s' }
        );
        
        await this.fromAccountSelect.selectByVisibleText(accountNumber);
    }

    async submitPayment () {
        await this.sendPaymentButton.click();
        
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
