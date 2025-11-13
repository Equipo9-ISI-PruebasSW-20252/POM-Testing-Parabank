import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    get inputUsername () {
        return $('input[name="username"]');
    }

    get inputPassword () {
        return $('input[name="password"]');
    }

    get btnSubmit () {
        return $('input[type="submit"][value="Log In"]');
    }
   
    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    async login (username, password) {
        // Esperar a que los campos estén listos
        await this.inputUsername.waitForExist({ timeout: 10000 });
        await this.inputUsername.waitForClickable({ timeout: 5000 });
        
        // Limpiar y escribir username
        await this.inputUsername.clearValue();
        await browser.pause(500);
        await this.inputUsername.setValue(username);
        await browser.pause(500);
        
        // Limpiar y escribir password
        await this.inputPassword.clearValue();
        await browser.pause(500);
        await this.inputPassword.setValue(password);
        await browser.pause(500);
        
        // Esperar y hacer click en submit
        await this.btnSubmit.waitForClickable({ timeout: 5000 });
        await this.btnSubmit.click();
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    open () {
        return super.open('index');
    }
}

export default new LoginPage();
