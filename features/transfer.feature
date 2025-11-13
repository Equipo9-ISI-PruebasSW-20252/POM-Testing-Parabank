Feature: Transfer Funds
  As an authenticated user
  I want to transfer funds between my accounts
  So that I can manage my money flexibly

  Background:
    Given I am on the login page
    When I login with john and demo
    Then I should see a text saying Accounts Overview

  Scenario Outline: Successful transfer between accounts
    When I navigate to Transfer Funds
    And I transfer <amount> from account <from_account> to account <to_account>
    Then I should see a confirmation message Transfer Complete!

    Examples:
      | amount | from_account | to_account |
      | 100    | 12345        | 54321      |

  Scenario: Transfer with insufficient funds should fail
    When I navigate to Transfer Funds
    And I transfer 999999 from account 12345 to account 54321
    Then I should see a confirmation message Invalid
