const root = document.querySelector(".cards");
const form = document.querySelector(".new-book");
const add = document.querySelector(".add");
const cancel = document.querySelector(".cancel");
const newBook = document.querySelector(".new");

const myLibrary = [];

class Book {
  constructor(title, author, pages, readStatus, salaries) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readStatus = readStatus;
    this.salaries = salaries;
  }

  info() {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${
      this.read == null ? "not read yet" : this.read
    }`;
  }

  static addBookToLibrary(title, author, pages, read, salaries) {
    let book = new Book(title, author, pages, read, salaries);
    myLibrary.push(book);
  }

  static researchBook(data) {
    for (let i = 0; i < myLibrary.length; i++) {
      if (i == data) {
        return [myLibrary[i], i];
      }
    }
  }

  static createTemplate() {
    Book.addBookToLibrary(
      "What do you do with an idea?",
      "Kobi Yamada",
      100,
      "Not Read",
      "10$"
    );
    Book.addBookToLibrary(
      "The Lord of the Rings",
      "J. R. R. Tolkien",
      100,
      "Read",
      "100$"
    );
    Book.addBookToLibrary(
      "The Status Civilization",
      "Robert Shackley",
      100,
      "Read",
      "100$"
    );
  }
}

// Because i need a book template for my page
Book.createTemplate();

class DOMController extends Book {
  constructor(title, author, pages, readStatus, salaries) {
    super(title, author, pages, readStatus, salaries);
  }

  static newElement(HTMLelement, className, data, HTML) {
    let element = document.createElement(HTMLelement);
    element.className = className;
    element.dataset.bookNumber = data;
    element.innerHTML = HTML;
    root.appendChild(element);
  }

  static bookHTML(title, author, pages, salaries, read) {
    return `
    <div class="title">Title: ${title}</div>
    <div class="author">Author: ${author}</div>
    <div class="pages">Pages: ${pages}</div>
    <div class="salaries">Salaries: ${parseInt(salaries)}$</div>
    <div class="status">Read: ${
      read == null || read == undefined ? "Not Read" : "Read"
    }</div>
    <div class="card-buttons">
        <div class="delete">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
            d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
            />
        </svg>
        </div>
        <div class="change-status">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
            d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
            />
        </svg>
        </div>
    </div>`;
  }

  static displayLibraryBooks() {
    root.innerHTML = ``;
    myLibrary.forEach((book, counter) =>
      this.newElement(
        "div",
        "card",
        counter,
        DOMController.bookHTML(
          book.title,
          book.author,
          book.pages,
          book.salaries
        )
      )
    );
  }

  static insertBookToLibrary(title, author, pages, salaries) {
    DOMController.newElement(
      "div",
      "card",
      myLibrary.length - 1,
      DOMController.bookHTML(title, author, pages, salaries)
    );
  }

  static deleteBookFromLibrary(data) {
    let bookIndex = Book.researchBook(data.dataset.bookNumber)[1];
    myLibrary[bookIndex] = null; // I think that i delete i :))))
    root.removeChild(data);
  }

  static changeReadStatus(data, status) {
    let book = Book.researchBook(data.dataset.bookNumber)[0];
    book.read = status == "read" ? "Read!" : "Not Read";
    data.querySelector(".status").textContent = `Read: ${book.read}`;
  }
}

class EventListeners extends DOMController {
  static readListener(e) {
    let toggle = e.target.closest(".change-status");
    let data = e.target.closest(".card");

    toggle.classList.toggle("on-read");

    if (toggle.classList.contains("on-read")) {
      DOMController.changeReadStatus(data, "read");
    } else {
      DOMController.changeReadStatus(data, "notread");
    }
  }

  static deleteListener(e) {
    let data = e.target.closest(".card");
    DOMController.deleteBookFromLibrary(data);
  }

  static addListener(e) {
    e.preventDefault();

    if (form.classList.contains("hidden")) {
      form.classList.remove("hidden");
    }
  }

  static cancelListener(e) {
    e.preventDefault();
    form.classList.add("hidden");
  }

  static newBookListener() {
    // e.preventDefault();

    const inputTitle = document.querySelector(".input-title").value;
    const inputAuthor = document.querySelector(".input-author").value;
    const inputPages = document.querySelector(".input-pages").value;
    const inputSalaries = document.querySelector(".input-salaries").value;

    Book.addBookToLibrary(
      inputTitle,
      inputAuthor,
      inputPages,
      undefined,
      inputSalaries
    );

    EventListeners.insertBookToLibrary(
      inputTitle,
      inputAuthor,
      inputPages,
      inputSalaries
    );
    form.classList.add("hidden");
  }

  static displayLibraryBooks() {
    super.displayLibraryBooks();
    document
      .querySelectorAll(".change-status")
      .forEach((book) =>
        book.addEventListener("click", EventListeners.readListener)
      );
    document
      .querySelectorAll(".delete")
      .forEach((book) =>
        book.addEventListener("click", EventListeners.deleteListener)
      );
  }

  static insertBookToLibrary(title, author, pages, salaries) {
    super.insertBookToLibrary(title, author, pages, salaries);
    document
      .querySelectorAll(".change-status")
      .forEach((book) =>
        book.addEventListener("click", EventListeners.readListener)
      );
    document
      .querySelectorAll(".delete")
      .forEach((book) =>
        book.addEventListener("click", EventListeners.deleteListener)
      );
  }

  formListener() {
    add.addEventListener("click", EventListeners.addListener);
    cancel.addEventListener("click", EventListeners.cancelListener);
    // newBook.addEventListener("click", (e) => {
    //   if (!form.classList.contains("hasError")) {
        
    //   }
    // });
  }
}

class formValidation {
  constructor(title, author, pages, salaries) {
    this.titleError = title;
    this.authorError = author;
    this.pagesError = pages;
    this.salariesError = salaries;
    this.formError = "Your inputs is wrong. Rewrite it again.";
  }

  validate() {
    const form = document.querySelector(".new-book");

    const errorField = document.querySelector(".error");

    const inputTitle = document.querySelector(".input-title");
    const inputAuthor = document.querySelector(".input-author");
    const inputPages = document.querySelector(".input-pages");
    const inputSalaries = document.querySelector(".input-salaries");

    const bindThis = this;

    this.validateLayout(inputTitle, errorField, bindThis, "titleError");
    this.validateLayout(inputAuthor, errorField, bindThis, "authorError");
    this.validateLayout(inputPages, errorField, bindThis, "pagesError");
    this.validateLayout(inputSalaries, errorField, bindThis, "salariesError");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const noValidate = !inputTitle.validity.valid
        ? inputTitle
        : !inputAuthor.validity.valid
        ? inputAuthor
        : !inputPages.validity.valid
        ? inputPages
        : !inputSalaries.validity.valid
        ? inputSalaries
        : "";
      if (noValidate !== "") {
        form.className = "new-book hasError";
        bindThis.showError(noValidate, bindThis["formError"]);
      } else {
        form.className = "new-book hidden";
        EventListeners.newBookListener();
      }
    });
  }

  validateLayout(input, errorField, bindThis, errorMessage) {
    const form = document.querySelector(".new-book");
    input.addEventListener("input", function () {
      if (input.validity.valid) {
        form.className = "new-book hasError";
        errorField.textContent = "";
        errorField.className = "error";
      } else {
        bindThis.showError(input, bindThis[errorMessage]);
      }
    });
  }

  showError(field, errorText) {
    const errorField = document.querySelector(".error");

    if (field.validity.valueMissing) {
      errorField.textContent = errorText;
    } else if (field.validity.tooShort) {
      errorField.textContent = `${errorText}. Field should be at least ${field.minLength} character,
      you entered ${field.value.length}`;
    }

    errorField.className = "error active";
  }
}

const formValidator = new formValidation(
  "Title Input Wrong",
  "Author Input Wrong",
  "Pages Input Wrong",
  "Salaries Input Wrong"
);

formValidator.validate();

EventListeners.displayLibraryBooks();

const formListener = new EventListeners().formListener;

formListener();
