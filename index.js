const root = document.querySelector(".cards");

const myLibrary = [];

function Book(title, author, pages, read = null, salaries = null) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.salaries = salaries;
  this.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${
      this.read == null ? "not read yet" : this.read
    }`;
  };
}

Book.prototype.cost = function () {
  return this.salaries;
};

function bookHTML(title, author, pages, salaries, read = null) {
  return `
    <div class="title">Title: ${title}</div>
    <div class="author">Author: ${author}</div>
    <div class="pages">Pages: ${pages}</div>
    <div class="salaries">Salaries: ${parseInt(salaries)}$</div>
    <div class="status">Read: ${read == null ? "Not Read" : "Read"}</div>
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

function addBookToLibrary(title, author, pages, read = null, salaries = "1$") {
  let book = new Book(title, author, pages, read, salaries);
  myLibrary.push(book);
}

function displayLibraryBooks() {
  myLibrary.forEach((book, counter) => {
    let div = document.createElement("div");
    div.className = "card";
    div.dataset.bookNumber = counter;
    div.innerHTML = bookHTML(
      book.title,
      book.author,
      book.pages,
      book.salaries
    );
    root.appendChild(div);
  });
}

function researchBook(data) {
  for (let i = 0; i < myLibrary.length; i++) {
    if (i == data) {
      return [myLibrary[i], i];
    }
  }
}

function deleteBookFromLibrary(data) {
  let bookIndex = researchBook(data.dataset.bookNumber)[1];
  myLibrary[bookIndex] = null; // I think that i delete i :))))
  root.removeChild(data);
}

function changeReadStatus(data, status) {
  let book = researchBook(data.dataset.bookNumber)[0];
  book.read = status == "read" ? "Read!" : "Not Read";
  data.querySelector(".status").textContent = `Read: ${book.read}`;
}

function insertBookToLibrary(title, author, pages, salaries) {
  let div = document.createElement("div");
  div.className = "card";
  div.dataset.bookNumber = myLibrary.length - 1;
  div.innerHTML = bookHTML(title, author, pages, salaries);
  root.appendChild(div);
}

addBookToLibrary("The Hobbit", "J. R. R. Tolkien", 295, null, "100$");
addBookToLibrary(
  "The Lord Of The Rings",
  "J. R. R. Tolkien",
  400,
  null,
  "200$"
);

// Observe any DOM Mutations

function observer(mutatuions) {
  const deleteBook = document.querySelectorAll(".delete");
  const readBooks = document.querySelectorAll(".change-status");

  readBooks.forEach((read) =>
    read.addEventListener("click", function (e) {
      let toggle = e.target.closest(".change-status");
      let data = e.target.closest(".card");

      toggle.classList.toggle("on-read");

      if (toggle.classList.contains("on-read")) {
        changeReadStatus(data, "read");
      } else {
        changeReadStatus(data, "notread");
      }
    })
  );
  deleteBook.forEach((book) =>
    book.addEventListener("click", function (e) {
      console.log("click")
      let data = e.target.closest(".card");
      deleteBookFromLibrary(data);
    })
  );
}

const rootObserver = new MutationObserver(observer);

// Event listeners
const form = document.querySelector(".new-book");

window.addEventListener("DOMContentLoaded", () => {
  rootObserver.observe(root, {
    childList: true,
  });

  displayLibraryBooks();
  const add = document.querySelector(".add");
  const cancel = document.querySelector(".cancel");
  const newBook = document.querySelector(".new");

  add.addEventListener("click", function (e) {
    e.preventDefault();

    if (form.classList.contains("hidden")) {
      form.classList.remove("hidden");
    }
  });

  cancel.addEventListener("click", function (e) {
    e.preventDefault();
    form.classList.add("hidden");
  });

  newBook.addEventListener("click", function (e) {
    e.preventDefault();

    const inputTitle = document.querySelector(".input-title").value;
    const inputAuthor = document.querySelector(".input-author").value;
    const inputPages = document.querySelector(".input-pages").value;
    const inputSalaries = document.querySelector(".input-salaries").value;

    addBookToLibrary(
      inputTitle,
      inputAuthor,
      inputPages,
      undefined,
      inputSalaries
    );
    insertBookToLibrary(inputTitle, inputAuthor, inputPages, inputSalaries);
    form.classList.add("hidden");
  });
});
