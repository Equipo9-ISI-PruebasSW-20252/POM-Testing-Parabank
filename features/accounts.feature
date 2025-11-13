Feature: Account Statement Consultation
  As an authenticated user
  I want to view my account statements
  So that I can know my balance and recent movements

  Background:
    Given I am on the login page
    When I login with john and demo
    Then I should see a text saying Accounts Overview

  Scenario: View all user accounts
    Then I should see all my accounts listed
    And each account should display the current balance

  Scenario: View account details
    When I click on the first account
    Then I should see the account activity table
