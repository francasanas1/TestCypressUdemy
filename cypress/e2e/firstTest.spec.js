/// <reference types="cypress" />

const { Dropdown } = require("bootstrap");
const exp = require("constants");

describe("First test suite", () => {
  it("Fitst test case", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    //by tab name
    cy.get("input");

    //by ID
    cy.get("#inputEmail1");

    //by Class value
    cy.get(".input-full-width");

    //by attribute name
    cy.get("[fullwidth]");

    //by Attributte and value
    cy.get('[placeholder="Email"]');

    //by entire Class value
    cy.get('[class="input-full-width size-medium shape-rectangle"]');

    //by two attributes
    cy.get('[placeholder="Email"][fullwidth]');

    //by tag attribute id and class
    cy.get('input[placeholder="Email"]#inputEmail1.input-full-width');

    //by cypress attribute
    cy.get('[data-cy="imputEmail1"]');
  });

  it("second teste case", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    //Theory
    //get ()- find elements on the page by locator globally
    //find()- find child elements by locator
    // contains() - find HTML text and by text and locator

    cy.contains("Sign in");
    cy.contains('[status="warning"]', "Sign in"); //para el contain se puede aclarar con el atributo
    cy.contains("nb-card", "Horizontal form").find("button"); //OK
    cy.contains("nb-card", "Horizontal form").contains("Sign in");
    cy.contains("nb-card", "Horizontal form").get("button"); //trae todos los botones (no hay que usar child para hijos)

    //Cypress chains and DOM
    cy.get("#inputEmail3")
      .parents("form")
      .find("button")
      .should("contain", "Sign in")
      .find("nb-checkbox")
      .click();
  });

  //formas de llamar a un mismo objeto
  it("save subject of the command", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    //CANT DO THINGS LIKE THIS
    // const UsingTheGrid = cy.contains("nb-card", "Using the Grid");
    // UsingTheGrid.find("[for=inputEmail1]").should("contain", "Email");
    // UsingTheGrid.find("[for=inputPassword2]").should("contain", "Password");

    // 1 Cypress Alias
    cy.contains("nb-card", "Using the Grid").as("UsingTheGrid");
    cy.get("@UsingTheGrid")
      .find("[for=inputEmail1]")
      .should("contain", "Email");
    cy.get("@UsingTheGrid")
      .find("[for=inputPassword2]")
      .should("contain", "Password");

    //2 Cypress Then() method (Es otra forma de utilizar una sola variable, sin tener q mencionarla tanto)
    cy.contains("nb-card", "Using the Grid").then((usingTheGrid) => {
      cy.wrap(usingTheGrid)
        .find("[for=inputEmail1]")
        .should("contain", "Email");
      cy.wrap(usingTheGrid)
        .find("[for=inputPassword2]")
        .should("contain", "Password");
      //cy.wrap sirve para transformar el elemento mencionado en un elemento de Cypress encadenable, lo que permite agregar funciones como find y should
    });
  });

  //extraccion de valores text
  it("extract text values", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    //1
    cy.get("[for=exampleInputEmail1]").should("contain", "Email address");

    //2 (extraccion del texto HTML)
    cy.get("[for=exampleInputEmail1]").then((label) => {
      const labelText = label.text();
      expect(labelText).to.equal("Email address");
      cy.wrap(labelText).should("contain", "Email address");
    });

    //3
    cy.get("[for=exampleInputEmail1]")
      .invoke("text")
      .then((text) => {
        expect(text).to.equal("Email address");
      });
    cy.get("[for=exampleInputEmail1]")
      .invoke("text")
      .as("labelText")
      .should("contain", "Email address");

    //4
    cy.get("[for=exampleInputEmail1]")
      .invoke("attr", "class") // se coloca el atributo y el nombre del atributo con el que se va a trabajar
      .then((classValue) => {
        expect(classValue).to.equal("label");
      });

    //5 invoke property (hay que probar las propiedades primero para despues validar el contenido de los campos)
    cy.get("#exampleInputEmail1").type("test@test.com");
    cy.get("#exampleInputEmail1")
      .invoke("prop", "value")
      .should("contain", "test@test.com")
      .then((property) => {
        expect(property).to.equal("test@test.com");
      });
  });

  //pruebas con botones
  it("radio buttons", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    cy.contains("nb-card", "Using the Grid")
      .find('[type="radio"]')
      .then((radioButtons) => {
        cy.wrap(radioButtons).eq(0).check({ force: true }).should("be.checked"); //force: true se utiliza cuando el elemento esta oculto
        cy.wrap(radioButtons).eq(1).check({ force: true });
        cy.wrap(radioButtons).eq(0).should("not.be.checked");
        cy.wrap(radioButtons).eq(2).should("be.disabled");
        //para radio buttons es conveniente utilizar "check"
      });
  });

  //prueba con check-box
  it("checkboxes", () => {
    cy.visit("/");
    cy.contains("Modal & Overlays").click();
    cy.contains("Toastr").click();

    //cy.get('[type="checkbox"]').check({force:true})
    cy.get('[type="checkbox"]').eq(0).check({ force: true });
    cy.get('[type="checkbox"]').eq(1).click({ force: true });
    //para check-box es conveniente utilizar "click" o "unclick" pq independientemente del estado anterior hace click
  });

  //prueba para calendarios Date picker
  it("Date picker", () => {
    function selectDayFromCurrent(day) {
      let date = new Date();
      date.setDate(date.getDate() + day); //toma el dia actual (getDate) luego modifica ese dia (setDate) agregandole 5 dias mas
      let futureDay = date.getDate();
      let futureMonth = date.toLocaleDateString("en-US", { month: "short" }); //transforma una fecha en un string
      let futureYear = date.getFullYear();
      let dateToAssert = `${futureMonth} ${futureDay}, ${futureYear}`;
      cy.get("nb-calendar-navigation")
        .invoke("attr", "ng-reflect-date")
        .then((dateAttribute) => {
          if (
            !dateAttribute.includes(futureMonth) ||
            !dateAttribute.includes(futureYear)
          ) {
            cy.get('[data-name="chevron-right"]').click();
            selectDayFromCurrent(day);
          } else {
            cy.get(".day-cell")
              .not(".bounding-month")
              .contains(futureDay)
              .click();
          }
        });
      return dateToAssert;
    }

    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Datepicker").click();
    cy.contains("nb-card", "Common Datepicker")
      .find("input")
      .then((input) => {
        cy.wrap(input).click();
        const dateToAssert = selectDayFromCurrent(5);
        cy.wrap(input).invoke("prop", "value").should("contain", dateToAssert);
        cy.wrap(input).should("have.value", dateToAssert);
      });
  });

  //Pruebas de listas y desplegables
  it("Lists and dropdowns", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Datepicker").click();

    //1
    cy.get("nav nb-select").click();
    cy.get(".options-list").contains("Dark").click();
    cy.get("nav nb-select").should("contain", "Dark");

    //2
    cy.get("nav nb-select").then((dropDown) => {
      cy.wrap(dropDown).click();
      cy.get(".options-list nb-option").each((listItem, index) => {
        const itemText = listItem.text().trim(); //trim() sirve para eliminar los espacios al rededor de una palabra
        cy.wrap(listItem).click();
        cy.wrap(dropDown).should("contain", itemText);
        if (index < 3) {
          cy.wrap(dropDown).click();
        }
      });
    });
  });

  it("Web tables", () => {
    cy.visit("/");
    cy.contains("Tables & Data").click();
    cy.contains("Smart Table").click();

    //1 Get the row by text
    cy.get("tbody")
      .contains("tr", "Larry")
      .then((tableRow) => {
        cy.wrap(tableRow).find(".nb-edit").click();
        cy.wrap(tableRow).find('[placeholder="Age"]').clear().type("35");
        cy.wrap(tableRow).find(".nb-checkmark").click();
        cy.wrap(tableRow).find("td").eq(6).should("contain", "35");
      });

    //2 Get row by index
    cy.get("thead").find(".nb-plus").click();
    cy.get("thead")
      .find("tr")
      .eq(2)
      .then((tableRow) => {
        cy.wrap(tableRow).find('[placeholder="First Name"]').type("John");
        cy.wrap(tableRow).find('[placeholder="Last Name"]').type("Smith");
        cy.wrap(tableRow).find(".nb-checkmark").click();
      });
    //first() sirve para seleccionar el primer elemento tr
    cy.get("tbody tr")
      .first()
      .find("td")
      .then((tableColumns) => {
        cy.wrap(tableColumns).eq(2).should("contain", "John");
        cy.wrap(tableColumns).eq(3).should("contain", "Smith");
      });

    //3 Get each row validation
    const age = [20, 30, 40, 200];
    cy.wrap(age).each((age) => {
      cy.get('thead [placeholder="Age"]').clear().type(age);
      cy.wait(500); //wait sirve para que la busqueda se demore un poco asi la pagina tenga tiempo de cargar
      cy.get("tbody tr").each((tableRow) => {
        if (age == 200) {
          cy.wrap(tableRow).should("contain", "No data found");
        } else {
          cy.wrap(tableRow).find("td").eq("6").should("contain", age);
        }
      });
    });
  });

  //Ventana emergente cuando ponemos el mouse sobre un boton
  it("Tooltips", () => {
    cy.visit("/");
    cy.contains("Modal & Overlays").click();
    cy.contains("Tooltip").click();

    cy.contains("nb-card", "Colored Tooltips").contains("Default").click();
    cy.get("nb-tooltip").should("contain", "This is a tooltip");
  });

  //IMPORTANTE test para cuadros de dialogo por fuera del DOM
  it.only("Dialog box", () => {
    cy.visit("/");
    cy.contains("Tables & Data").click();
    cy.contains("Smart Table").click();

    //1 Verificar el mensaje correcto en el Pop Up
    cy.get("tbody tr").first().find(".nb-trash").click();
    cy.on("window:confirm", (confirm) => {
      expect(confirm).to.equal("Are you sure you want to delete?");
    });

    //2 el restulado de este evento se asigna a stub
    const stub = cy.stub();
    cy.on("window:confirm", stub);
    //Con cy.on(), se intercepta el evento que ocurre cuando se muestra una ventana de confirmación.
    cy.get("tbody tr")
      .first()
      .find(".nb-trash")
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith(
          "Are you sure you want to delete?"
        );
        //stub.getCall(0) accede a la primera vez que se llamó el stub (en este caso, la primera aparición de window.confirm)
      });

    //3 queremos cancelar el PopUp y no confirmar
    cy.get("tbody tr").first().find(".nb-trash").click();
    cy.on("window:confirm", (confirm) => false);
  });
});
