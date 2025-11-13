Feature: Loan Request Service
  Como usuario autenticado,
  quiero solicitar préstamos,
  para obtener financiamiento adicional.

  Background:
    Given I am on the login page
    When I login with john and demo

  Scenario: Successful loan request with sufficient funds
    When I navigate to Request Loan
    And I request a loan of 1000 with down payment 100 from account 12345
    And I submit the loan request
    Then I should see a loan confirmation message Congratulations

  Scenario: Loan request denied due to insufficient funds
    When I navigate to Request Loan
    And I request a loan of 999999 with down payment 10000 from account 12345
    And I submit the loan request
    Then I should see a loan error message denied

  Scenario: Loan request with invalid amount
    When I navigate to Request Loan
    And I request a loan of -100 with down payment 50 from account 12345
    And I submit the loan request
    Then I should see a loan error message Error

  Scenario: Loan request with zero down payment
    When I navigate to Request Loan
    And I request a loan of 5000 with down payment 0 from account 12345
    And I submit the loan request
    Then I should see a loan error message Error
