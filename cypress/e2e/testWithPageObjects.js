const { navigateTo } = require("../support/page_objects/navigationPage");
const {
  onFormLayoutsPage,
} = require("../support/page_objects/formLayoutsPages");
const { onDatePickerPage } = require("../support/page_objects/datePickerPage");
const { onSmartTablePage } = require("../support/page_objects/smartTablePage");

describe("Test with Page Objects", () => {
  beforeEach("open application", () => {
    cy.openHomePage();
    //Before each es para que haga esta visita antes de cada test
  });

  it("verify navigations across the pages", () => {
    navigateTo.formLayoutPage();
    navigateTo.datePickerPage();
    navigateTo.toasterPage();
    navigateTo.smartTablePage();
    navigateTo.tooltipPage();
  });

  it.only("Should submit Inline and Basic form and select tomorrow date in the calendar", () => {
    navigateTo.formLayoutPage();
    onFormLayoutsPage.submitInlineFormWithNameAndEmail(
      "Artem",
      "test@test.com"
    );
    onFormLayoutsPage.submitBasicFormWithEmailAndPassword(
      "test@test.com",
      "password"
    );
    navigateTo.datePickerPage();
    onDatePickerPage.selectCommonDatePickerDateFromToday(1);
    onDatePickerPage.selectDatePickerWithRangeFromToday(7, 14);
    navigateTo.smartTablePage();
    onSmartTablePage.addNewRecordWithFirstAndLastName("Artem", "Bordan");
    onSmartTablePage.upDateAgeByFirstName("Artem", 25);
    onSmartTablePage.deleteRowByIndex(1);
  });
});
