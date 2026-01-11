Feature: BMP Health Tracking
  As a municipal asset manager
  I want to track the long-term health of permanent stormwater BMPs
  So that I can ensure compliance and schedule maintenance effectively

  Scenario: Registering a new BMP asset
    Given a detention pond named "Pond-01" in the North District
    When I register the asset into the BMP portal
    Then the initial health score should be 100
    And the maintenance status should be "Healthy"

  Scenario: Recording maintenance and impact on health
    Given an existing BMP asset "Pond-01" with health 100
    When a maintenance record is added for "Sediment Removal"
    Then the last maintenance date should be today
    And the health score should remain above 90

  Scenario: Detecting a critical health decline
    Given a BMP asset "Pond-01" that has not been maintained for 2 years
    When the health check is calculated
    Then the maintenance status should be "Overdue"
    And a maintenance alert should be generated
