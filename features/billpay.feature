Feature: Bill Payment Service
  Como usuario autenticado,
  quiero realizar pagos a beneficiarios,
  para cumplir con mis compromisos financieros.

  Background:
    Given I am on the login page
    When I login with john and demo

  Scenario: Successful bill payment
    When I navigate to Bill Pay
    And I fill the payee information with name "Electric Company", address "123 Main St", city "Springfield", state "IL", zipcode "62701", phone "5551234567"
    And I fill the account details with account "12345", verify "12345", and amount "150"
    And I select from account "12345"
    And I submit the payment
    Then I should see a confirmation message Bill Payment Complete

  Scenario: Bill payment with account mismatch
    When I navigate to Bill Pay
    And I fill the payee information with name "Water Company", address "456 Oak Ave", city "Chicago", state "IL", zipcode "60601", phone "5559876543"
    And I fill the account details with account "12345", verify "54321", and amount "100"
    And I select from account "12345"
    And I submit the payment
    Then I should see an error message Error!

  Scenario: Bill payment with empty payee name
    When I navigate to Bill Pay
    And I fill the payee information with name "", address "789 Pine Rd", city "Peoria", state "IL", zipcode "61602", phone "5551112222"
    And I fill the account details with account "12345", verify "12345", and amount "50"
    And I select from account "12345"
    And I submit the payment
    Then I should see an error message Error!

  Scenario: Bill payment with invalid amount
    When I navigate to Bill Pay
    And I fill the payee information with name "Gas Company", address "321 Elm St", city "Rockford", state "IL", zipcode "61101", phone "5553334444"
    And I fill the account details with account "12345", verify "12345", and amount "abc"
    And I select from account "12345"
    And I submit the payment
    Then I should see an error message Error!
