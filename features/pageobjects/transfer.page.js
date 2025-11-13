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

    async getAvailableFromAccounts () {
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

    async getAvailableToAccounts () {
        // Esperar a que toAccountSelect se cargue
        await this.toAccountSelect.waitForExist({ timeout: 5000 });
        
        // Esperar a que las opciones se carguen
        await browser.waitUntil(
            async () => {
                const options = await this.toAccountSelect.$$('option');
                return options.length > 0;
            },
            { timeout: 5000, timeoutMsg: 'Expected to-account options to load after 5s' }
        );
        
        const options = await this.toAccountSelect.$$('option');
        const accountIds = [];
        
        for (const option of options) {
            const value = await option.getText();
            if (value && value.trim() !== '') {
                accountIds.push(value.trim());
            }
        }
        
        return accountIds;
    }

    async transferFunds (amount, fromAccount, toAccount) {
        // Esperar a que los selectores se carguen via AJAX
        await this.fromAccountSelect.waitForExist({ timeout: 10000 });
        await this.fromAccountSelect.waitForClickable({ timeout: 5000 });
        
        // Esperar a que las opciones se carguen dentro del select
        await browser.waitUntil(
            async () => {
                const options = await this.fromAccountSelect.$$('option');
                return options.length > 0;
            },
            { timeout: 5000, timeoutMsg: 'Expected account options to load after 5s' }
        );
        
        await browser.pause(500);
        await this.amountInput.setValue(amount);
        await browser.pause(500);
        
        await this.fromAccountSelect.selectByVisibleText(fromAccount);
        await browser.pause(300);
        
        await this.toAccountSelect.selectByVisibleText(toAccount);
        await browser.pause(300);
        
        await this.transferButton.waitForClickable({ timeout: 5000 });
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
        
        await browser.pause(1000);
    }

    open () {
        return super.open('transfer');
    }
}

export default new TransferPage();
