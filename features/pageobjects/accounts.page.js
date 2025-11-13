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

    open () {
        return super.open('overview.htm');
    }
}

export default new AccountsPage();
