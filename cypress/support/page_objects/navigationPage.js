function selectGroupMenuItem(groupName) {
  //el script de abajo es en caso de que el menu Forms ya este abierto
  cy.contains("a", groupName).then((menu) => {
    cy.wrap(menu)
      .find(".expand-state g g")
      .invoke("attr", "data-name")
      .then((attr) => {
        if (attr.includes("left")) {
          cy.wrap(menu).click();
        }
      });
  });
}

export class NavigationPage {
  formLayoutPage() {
    selectGroupMenuItem("Forms");
    cy.contains("Form Layouts").click();
  }

  datePickerPage() {
    selectGroupMenuItem("Forms");
    cy.contains("Datepicker").click();
  }

  toasterPage() {
    selectGroupMenuItem("Modal & Overlays");
    cy.contains("Tooltip").click();
  }

  smartTablePage() {
    selectGroupMenuItem("Tables & Data");
    cy.contains("Smart Table").click();
  }

  tooltipPage() {
    selectGroupMenuItem("Modal & Overlays");
    cy.contains("Tooltip").click();
  }
}

export const navigateTo = new NavigationPage();
