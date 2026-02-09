# Lead QA Assignment

## A1:Strategy: Hybrid — API-first for authentication, UI-level for core purchase intent
I use a hybrid automation strategy:
API-level automation for authentication (login / token setup)
UI-level automation for product discovery and cart


This choice is driven by risk, stability, and execution speed, not tooling preference.
API for authentication
Authentication is:
High-risk (if it fails, no user can transact)
Low business value to test via UI repeatedly 
High flakiness risk in UI (captcha, redirects, rate limits, animations, etc.)


By authenticating via API and injecting the session into the browser:
Tests become 10–20x faster
Failures point directly to real auth bugs, not UI noise
The UI tests focus on what matters: user behavior after login
UI for product & cart flows
The cart is the revenue engine.
Add-to-cart must validate:
Frontend state
Backend persistence
API → UI data mapping
Price, quantity, product name consistency






## A2 — Critical test scenarios
These are the first 7 scenarios I would automate because they protect the revenue-generating path and the highest-risk areas of the system.
### 1. Login with seeded user (happy path)
Test Scenario: Verify that a known valid user can successfully authenticate and access the system.
Why critical:: If login fails, no customer can reach the purchase flow. Using a seeded user also ensures test stability and data isolation.
### 2. Login with invalid credentials
Test Scenario:Attempt to login with a wrong password and verify the correct error message is shown.
Why critical::Prevents security and UX issues such as:
brute-force bypass
incorrect error handling
users being blocked incorrectly
### 3. Browse or search products
Test Scenario:User can load the product list and/or search for an item.
Why critical:If products cannot be found, users cannot purchase - this is a direct revenue blocker.
### 4. Open product detail page
Test Scenario:Select a product and verify its details (name, price, availability) are visible.
Why critical: Broken product pages cause silent revenue loss even when the backend is working.
### 5. Add product to cart
Test Scenario:Add a product to the cart from the product detail page.
Why critical: This is the purchase intent signal — if this fails, tracking, checkout, and conversion all fail.
### 6. Verify cart contents
Test Scenario:Verify cart contains the correct:
- product name
- quantity
- price
Why critical:Wrong price or product creates:
- customer complaints
- financial loss
- legal risk
### 7. Cart persistence (same session, after refresh)
Test Scenario:Refresh the page and verify the cart still contains the item.
Why critical:Cart loss is one of the most common causes of cart abandonment in e-commerce.

## A3. Implement automated tests (required)
### How to Build
- clone repo to you computer
- access to folder via terminal and run build command
- docker compose up --build
### Local SUT
- Local url: http://localhost:3000
- Product url:http://localhost:3000/products
- Cart url:http://localhost:3000/cart


## Section B — Test Architecture & Maintainability
B2 — Flaky Test Prevention
Flaky tests are one of the biggest risks in fast-moving e-commerce teams because they reduce trust in CI and slow down releases. The most common causes of flakiness are:
Common causes
Asynchronous UI and network delays
Pages may render before data is fully loaded, causing assertions to run too early.


Unstable selectors
 Tests that rely on CSS classes or DOM structure break when the UI changes.


Shared or inconsistent test data
 Reusing the same user, cart, or product across tests causes unpredictable state.


Race conditions between frontend and backend
 The UI may show a result before the backend has completed processing.
Concrete techniques to prevent flakiness
### 1. Use stable selectors
I rely on data-testid, roles, or semantic attributes instead of CSS or DOM-based selectors. This makes tests resilient to UI refactoring.
### 2. Use API for state setup
Login, user creation, and cart cleanup are done via API instead of UI. This makes tests faster, more reliable, and removes unnecessary UI dependencies.
### 3. Isolate and control test data
Each test starts with a known user and a clean cart. No test depends on data created by another test.
### 4. Use condition-based waits, not fixed delays
I avoid sleep or hardcoded timeouts. Tests wait for real signals such as:
- network responses
- element visibility
- backend state changes
### 5. Add observability for failures
In CI, failed tests automatically capture:
- screenshots
- videos
- logs
This allows fast root-cause analysis instead of rerunning flaky tests blindly.

## Section C — CI/CD & Execution
C1- CI Integration
### How tests run in CI
Tests run automatically on every pull request and merge to main.
CI builds the app and test containers using Docker.
docker compose starts the system and runs Playwright tests in a clean, isolated environment.
Test results, screenshots, and videos are collected on failure.
This guarantees the same environment in local and CI and avoids “works on my machine” issues.
### When tests block deployment
Deployment is blocked if login or add-to-cart tests fail.
These flows represent user access and revenue, so any failure is a release-blocking risk.
Non-critical tests can be non-blocking, but core business flows always gate releases.

## Section D — Leadership & Quality Judgment
D1 — What NOT to Automate
UI look & feel (layout, colors, visual alignment)
These change frequently and break UI tests without impacting business.
 Visual review or visual regression tools are more suitable than functional automation.


Email or notification delivery
Third-party services are unreliable and slow in automation.
These are better verified using logs, mocks, and production monitoring.


Payment provider integration
Real payment flows are expensive, slow, and risky to automate.
They should be covered by sandbox tests and production monitoring instead of CI automation.
These areas are monitored or tested manually because they:
change often,
rely on external systems,
or provide low confidence when automated compared to their maintenance cost.
This allows automation to stay focused on core, stable, revenue-critical user flows.
