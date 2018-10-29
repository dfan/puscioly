const puppeteer = require('puppeteer');
const CREDS = require('./creds');
const MAJORS = require('./majors');

/* Get Started:
 * 1. Run `npm i --save puppeteer`
 * 2. Make creds.js with module.exports = {
        username: '<USERNAME>',
        password: '<PASSWORD>'
      }
 * 3. node emailScraper.js
 */
async function run() {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  await page.goto('https://tigernet.princeton.edu');

  // dom element selectors (Chrome -> inspect -> copy selector)
  const STUDENT_BUTTON_SELECTOR = '#cid_40_rptSsoProviders_ctl02_btnProvider';
  const USERNAME_SELECTOR = '#username';
  const PASSWORD_SELECTOR = '#password';
  const LOGIN_BUTTON_SELECTOR = '#fm1 > div.login > p > input.btn-submit';
  const ALUMNI_DIRECTORY_BUTTON_SELECTOR = '#imodcmscalendar1016 > div.cms-listing > div > div > div:nth-child(2) > div.thumb > a';
  const YEAR_SELECTOR = '#mf_882 > option:nth-child(%d)';
  const SUBMIT_BUTTON_SELECTOR = '#imod-view-content > section > div.imod-search-form.imod-field-label-align-left > div.imod-button-section > button';
  const VIEW_DETAILS_SELECTOR = '#imod-view-content > div:nth-child(%s) > div > div > div.imod-directory-member-data-container > div.imod-directory-member-more > a';
  const NEXT_BUTTON_SELECTOR = '#imod-view-content > div.imod-directory-search-results-pager.ng-isolate-scope > div > div.imod-pager-desktop > div.imod-pager-arrow.imod-pager-next.ng-scope > a';
  const FIRST_NAME_SELECTOR = '#imod-view-content > div > div > div:nth-child(1) > div.imod-profile-step-content > div.imod-profile-category.ng-isolate-scope > div.imod-profile-fields > ul > li:nth-child(1) > div.imod-profile-field-data.ng-binding.ng-scope';
  const LAST_NAME_SELECTOR = '#imod-view-content > div > div > div:nth-child(1) > div.imod-profile-step-content > div.imod-profile-category.ng-isolate-scope > div.imod-profile-fields > ul > li:nth-child(2) > div.imod-profile-field-data.ng-binding.ng-scope';
  const EMAIL_SELECTOR = '#imod-view-content > div > div > div:nth-child(2) > div.imod-profile-step-content > div.imod-profile-category.ng-isolate-scope > div.imod-profile-fields > ul > li:nth-child(1) > div.imod-profile-field-data.ng-binding.ng-scope';

  await page.click(STUDENT_BUTTON_SELECTOR);
  await page.waitFor(1000);
  await page.type(USERNAME_SELECTOR, CREDS.username);
  await page.type(PASSWORD_SELECTOR, CREDS.password);
  await page.click(LOGIN_BUTTON_SELECTOR);
  await page.waitFor(1000);
  await page.waitForSelector(ALUMNI_DIRECTORY_BUTTON_SELECTOR);
  await page.evaluate((selector) => {
    document.querySelector(selector).click();
  }, ALUMNI_DIRECTORY_BUTTON_SELECTOR);
  //await page.$(ALUMNI_DIRECTORY_BUTTON_SELECTOR)
  // await page.click(ALUMNI_DIRECTORY_BUTTON_SELECTOR);
  await page.waitFor(1000);
  
  // Choose the years
  var years = [];
  for (let i = 1; i <= 40; i++) {
    let selector = YEAR_SELECTOR.replace("%d", i.toString());
    await page.waitForSelector(selector);
    const value = await page.evaluate((selector) => {
      return document.querySelector(selector).value
    }, selector);
    years.push(value);
  }
  page.select('#mf_882', ...years) // spread operator
  
  // Choose the majors
  // Command click to select multiple options
  var majors = []
  for (let i = 0; i < MAJORS.selectors.length; i++) {
    await page.waitForSelector(MAJORS.selectors[i]);
    const value = await page.evaluate((selector) => {
      return document.querySelector(selector).value
    }, MAJORS.selectors[i]);
    majors.push(value);
  }
  page.select('#mf_409', ...majors)
  
  await page.waitForSelector(SUBMIT_BUTTON_SELECTOR);
  await page.evaluate((selector) => {
    document.querySelector(selector).click();
  }, SUBMIT_BUTTON_SELECTOR);
  await page.waitFor(1500);

  let numPages = 35;
  let toSkip = 5;

  for (let i = 1; i <= numPages; i++) {
    if (i > toSkip) {
      for (let index = 9; index <= 28; index++) {
        // First name on page is nth-child(9), last is 28
        let currSelector = VIEW_DETAILS_SELECTOR.replace("%s", index.toString());

        await page.waitForSelector(currSelector);
        await page.evaluate((selector) => {
          document.querySelector(selector).click();
        }, currSelector);
        await page.waitFor(1000);

        await page.waitForSelector(FIRST_NAME_SELECTOR);
        await page.waitForSelector(LAST_NAME_SELECTOR);
        await page.waitForSelector(EMAIL_SELECTOR);

        const result = await page.evaluate((FIRST_NAME_SELECTOR, LAST_NAME_SELECTOR, EMAIL_SELECTOR) => {
            let firstName = document.querySelector(FIRST_NAME_SELECTOR).innerText;
            let lastName = document.querySelector(LAST_NAME_SELECTOR).innerText;
            let emailAddress = document.querySelector(EMAIL_SELECTOR).innerText;
            return {firstName, lastName, emailAddress}
        }, FIRST_NAME_SELECTOR, LAST_NAME_SELECTOR, EMAIL_SELECTOR);
        
        if (i === 0 && index === 9) {
          console.log('FirstName, LastName, Email');
        }
        console.log(result.firstName + ', ' + result.lastName + ', ' + result.emailAddress);

        // Go back
        await page.goBack();
        await page.waitFor(1000);
      } 
    }
    await page.waitForSelector(NEXT_BUTTON_SELECTOR);
    await page.evaluate((selector) => {
      document.querySelector(selector).click();
    }, NEXT_BUTTON_SELECTOR);
    await page.waitFor(1000);
  }
  await browser.close();
}

run();