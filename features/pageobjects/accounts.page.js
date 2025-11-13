import Page from './page.js';

class AccountsPage extends Page {
    get accountsTable () {
        return $('table#accountTable');
    }

    get firstAccountLink () {
        return $('table#accountTable tbody tr:first-child td:first-child a');
    }

    get transactionTable () {
        return $('#transactionTable');
    }

    async clickFirstAccount () {
        await this.firstAccountLink.waitForExist({ timeout: 5000 });
        await this.firstAccountLink.click();
    }

    async getAccountsCount () {
        // Esperar a que las filas se carguen via AJAX
        await browser.waitUntil(
            async () => (await $$('table#accountTable tbody tr')).length > 0,
            {
                timeout: 5000,
                timeoutMsg: 'Expected accounts table to have rows after 5s'
            }
        );
        const rows = await $$('table#accountTable tbody tr');
        // Restar las filas de "Total" (hay 2 duplicadas según el HTML)
        return rows.length - 2;
    }

    async getAccountIds () {
        // Esperar a que las filas se carguen
        await browser.waitUntil(
            async () => (await $$('table#accountTable tbody tr')).length > 0,
            {
                timeout: 5000,
                timeoutMsg: 'Expected accounts table to have rows after 5s'
            }
        );
        
        // Obtener todos los enlaces de cuenta
        const accountLinks = await $$('table#accountTable tbody tr td:first-child a');
        const accountIds = [];
        
        for (const link of accountLinks) {
            const accountId = await link.getText();
            // Solo agregar si no es vacío y no es parte del total row
            if (accountId && accountId.trim() !== '') {
                accountIds.push(accountId.trim());
            }
        }
        
        return accountIds;
    }

    open () {
        return super.open('overview.htm');
    }
}

export default new AccountsPage();
