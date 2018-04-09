Feature: User visits the login page
    In order to login to the CAAS server (and other apps as well) with my UP Mail account
    As a user
    I want to interact with the login page.

Scenario: View login page
    Given I am on the login page
    And I am not logged in
    Then I should see "Sign In"
    And I should see a "Sign In With Your UP Mail Account" button

    Given I am on the login page
    And I am logged in
    Then I should see "You are already logged in."
    And I should see a list of applications I can access

# TODO: Add scenario where the user clicks on the "Sign In With Your UP Mail Account" button.
