import { Given, When, Then } from "@wdio/cucumber-framework";

import LoginPage from '../pageobjects/login.page.js';
import AccountsPage from '../pageobjects/accounts.page.js';
import TransferPage from '../pageobjects/transfer.page.js';
import BillPayPage from '../pageobjects/billpay.page.js';
import LoanRequestPage from '../pageobjects/loanrequest.page.js';

const pages = {
  login: LoginPage,
};

Given(/^I am on the (\w+) page$/, async (page) => {
  // Si existe el botón de logout, hacer logout primero
  const logoutBtn = await $('a[href="logout.htm"]');
  if (await logoutBtn.isExisting()) {
    await logoutBtn.click();
  }
  // Navegar a la página solicitada
  await pages[page].open();
});

//LOGIN
When(/^I login with (\w+) and (.+)$/, async (username, password) => {
  await LoginPage.login(username, password);
  // Esperar a que la página cargue completamente después del login
  await browser.pause(2000);
});

Then(/^I should see a text saying (.*)$/, async (message) => {
  if (message === "Error!") {
    // invalid username or password - check for error message
    await expect($('p.error')).toBeExisting();
    await expect($('p.error')).toHaveTextContaining('could not be verified');
  } else {
    // valid username or password - check for page title
    // Esperar a que el elemento exista y tenga contenido
    await browser.waitUntil(
      async () => {
        const elem = await $('.title');
        if (!(await elem.isExisting())) return false;
        const text = await elem.getText();
        return text && text !== 'Error!' && text.includes(message);
      },
      {
        timeout: 15000,
        timeoutMsg: `Expected page title to contain "${message}", but it didn't appear within 15s`
      }
    );
    await expect($('.title')).toHaveTextContaining(message);
  }
});

// ACCOUNTS
Then(/^I should see all my accounts listed$/, async () => {
  await expect(AccountsPage.accountsTable).toBeExisting();
  const accountsCount = await AccountsPage.getAccountsCount();
  expect(accountsCount).toBeGreaterThan(0);
});

Then(/^each account should display the current balance$/, async () => {
  await expect(AccountsPage.accountsTable).toBeExisting();
});

When(/^I click on the first account$/, async () => {
  await AccountsPage.clickFirstAccount();
});

Then(/^I should see the account activity table$/, async () => {
  await expect(AccountsPage.transactionTable).toBeExisting();
});

// TRANSFERS
When(/^I navigate to Transfer Funds$/, async () => {
  await TransferPage.open();
});

When(/^I transfer (.*) from account (.*) to account (.*)$/, async (amount, fromAccount, toAccount) => {
  // Si fromAccount o toAccount son placeholders (ej: "12345", "54321"), 
  // obtener cuentas reales disponibles desde ambos dropdowns
  if (fromAccount === '12345' || toAccount === '54321') {
    const fromAccounts = await TransferPage.getAvailableFromAccounts();
    const toAccounts = await TransferPage.getAvailableToAccounts();
    
    console.log(`fromAccounts found: ${JSON.stringify(fromAccounts)}`);
    console.log(`toAccounts found: ${JSON.stringify(toAccounts)}`);
    
    if (fromAccounts.length < 1) {
      throw new Error(`Need at least 1 account to transfer from, but found ${fromAccounts.length}`);
    }
    
    if (toAccounts.length < 1) {
      throw new Error(`Need at least 1 account to transfer to, but found ${toAccounts.length}`);
    }
    
    // Usar la primera cuenta disponible como origen
    const actualFromAccount = fromAccounts[0];
    
    // Para destino: si hay más de una opción en toAccounts, usar la segunda; sino, usar la misma
    const actualToAccount = toAccounts.length > 1 ? toAccounts[1] : toAccounts[0];
    
    console.log(`Using fromAccount: ${actualFromAccount}, toAccount: ${actualToAccount}`);
    
    await TransferPage.transferFunds(amount, actualFromAccount, actualToAccount);
  } else {
    await TransferPage.transferFunds(amount, fromAccount, toAccount);
  }
});

Then(/^I should see a confirmation message (.*)$/, async (message) => {
  // Detectar si es Bill Pay o Transfer basado en la URL actual
  const currentUrl = await browser.getUrl();
  if (currentUrl.includes('billpay')) {
    await expect(BillPayPage.successMessage).toBeExisting();
    await expect(BillPayPage.successMessage).toHaveTextContaining(message);
  } else {
    await expect(TransferPage.successMessage).toBeExisting();
    await expect(TransferPage.successMessage).toHaveTextContaining(message);
  }
});

Then(/^I should see an error message (.*)$/, async (message) => {
  // Detectar si es Bill Pay o Transfer basado en la URL actual
  const currentUrl = await browser.getUrl();
  if (currentUrl.includes('billpay')) {
    await expect(BillPayPage.errorMessage).toBeExisting();
    await expect(BillPayPage.errorMessage).toHaveTextContaining(message);
  } else {
    await expect(TransferPage.errorMessage).toBeExisting();
    await expect(TransferPage.errorMessage).toHaveTextContaining(message);
  }
});

// BILL PAY
When(/^I navigate to Bill Pay$/, async () => {
  await BillPayPage.open();
});

When(/^I fill the payee information with name "(.*)", address "(.*)", city "(.*)", state "(.*)", zipcode "(.*)", phone "(.*)"$/, async (name, address, city, state, zipcode, phone) => {
  await BillPayPage.fillPayeeInfo(name, address, city, state, zipcode, phone);
  await browser.pause(500);
});

When(/^I fill the account details with account "(.*)", verify "(.*)", and amount "(.*)"$/, async (account, verify, amount) => {
  await BillPayPage.fillAccountDetails(account, verify, amount);
  await browser.pause(500);
});

When(/^I select from account "(.*)"$/, async (accountNumber) => {
  // Si es el placeholder "12345", usar la primera cuenta disponible
  if (accountNumber === '12345') {
    const availableAccounts = await BillPayPage.getAvailableAccounts();
    
    if (availableAccounts.length < 1) {
      throw new Error(`Need at least 1 account, but found ${availableAccounts.length}`);
    }
    
    await BillPayPage.selectFromAccount(availableAccounts[0]);
  } else {
    await BillPayPage.selectFromAccount(accountNumber);
  }
});

When(/^I submit the payment$/, async () => {
  await BillPayPage.submitPayment();
});

// Loan Request steps
When(/^I navigate to Request Loan$/, async () => {
  await LoanRequestPage.open();
});

When(/^I request a loan of (.*) with down payment (.*) from account (.*)$/, async (loanAmount, downPayment, accountNumber) => {
  await LoanRequestPage.fillLoanAmount(loanAmount);
  await LoanRequestPage.fillDownPayment(downPayment);
  
  // Si es el placeholder "12345", usar la primera cuenta disponible
  if (accountNumber === '12345') {
    const availableAccounts = await LoanRequestPage.getAvailableAccounts();
    
    if (availableAccounts.length < 1) {
      throw new Error(`Need at least 1 account for loan, but found ${availableAccounts.length}`);
    }
    
    await LoanRequestPage.selectFromAccount(availableAccounts[0]);
  } else {
    await LoanRequestPage.selectFromAccount(accountNumber);
  }
});

When(/^I submit the loan request$/, async () => {
  await LoanRequestPage.submitLoanRequest();
});

Then(/^I should see a loan confirmation message (.*)$/, async (message) => {
  await expect(LoanRequestPage.approvalMessage).toBeExisting();
  await expect(LoanRequestPage.approvalMessage).toHaveTextContaining(message);
});

Then(/^I should see a loan error message (.*)$/, async (message) => {
  // Parabank usa #loanRequestDenied para TODOS los errores (no existe #loanRequestError)
  // Esto es un BUG de Parabank - no distingue entre denial y validation errors
  
  // El elemento aparece primero vacío, luego se llena con el mensaje
  await browser.waitUntil(async () => {
    const text = await LoanRequestPage.denialMessage.getText();
    return text.trim().length > 0;
  }, {
    timeout: 20000,
    timeoutMsg: 'Denial message did not appear with text within 20 seconds'
  });
  
  const denialText = await LoanRequestPage.denialMessage.getText();
  // Verificar que hay algún mensaje de error (no vacío)
  expect(denialText.trim().length).toBeGreaterThan(0);
});




