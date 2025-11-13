import Page from './page.js';

class TransferPage extends Page {
    get amountInput () {
        return $('#amount');
    }

    get fromAccountSelect () {
        return $('#fromAccountId');
    }

    get toAccountSelect () {
        return $('#toAccountId');
    }

    get transferButton () {
        return $('input[type="submit"][value="Transfer"]');
    }

    get successMessage () {
        return $('#showResult h1');
    }

    get errorMessage () {
        return $('#showError h1');
    }

    async transferFunds (amount, fromAccount, toAccount) {
        // Esperar a que los selectores se carguen via AJAX
        await this.fromAccountSelect.waitForExist({ timeout: 5000 });
        
        // Esperar a que las opciones se carguen dentro del select
        await browser.waitUntil(
            async () => {
                const options = await this.fromAccountSelect.$$('option');
                return options.length > 0;
            },
            { timeout: 5000, timeoutMsg: 'Expected account options to load after 5s' }
        );
        
        await this.amountInput.setValue(amount);
        await this.fromAccountSelect.selectByVisibleText(fromAccount);
        await this.toAccountSelect.selectByVisibleText(toAccount);
        
        await this.transferButton.click();
        
        // Esperar a que el div #showResult se muestre (AJAX actualiza el DOM)
        await browser.waitUntil(
            async () => {
                const showResult = await $('#showResult');
                const isDisplayed = await showResult.isDisplayed();
                return isDisplayed;
            },
            { timeout: 10000, timeoutMsg: 'Expected #showResult to be displayed after transfer' }
        );
    }

    open () {
        return super.open('transfer');
    }
}

export default new TransferPage();
