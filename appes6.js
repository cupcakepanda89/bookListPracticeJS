class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {

    // Add book to list
    addBookToList(book) {
        const list = document.getElementById('book-list');

        // Create tr element
        const row = document.createElement('tr');
        // Insert cols
        row.innerHTML = `<td>${book.title}</td>
                         <td>${book.author}</td>
                         <td>${book.isbn}</td>
                         <td><a href="#" class="delete">X</a></td>`;

        list.appendChild(row);
    }

    // Show Alert
    showAlert(message, className) {
        // Create div
        const div = document.createElement('div');
        // Add classess
        div.className = `alert ${className}`;
        // Add text
        div.appendChild(document.createTextNode(message));
        // Get parent
        const container = document.querySelector('.container');
        // Get form 
        const form = document.querySelector('#book-form');
        // Insert alert before form element
        container.insertBefore(div, form);

        // timeour after 3 sec
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    // Delete book
    deleteBook(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    // Clear Fields
    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}
// Local Storage class
class Store{
    static getBook(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem(`books`));
        }

        return books;
    }

    static displayBooks(){
        const books = Store.getBook();
        books.forEach(function(book){
            const ui = new UI();

            // Add book to UI
            ui.addBookToList(book);
        });        
    }

    static addBook(book){
        const books = Store.getBook();
        books.push(book);

        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBook();
        
        books.forEach(function(book,index){
            if(book.isbn === isbn){
                books.splice(index,1);
            }
        });

        localStorage.setItem('books',JSON.stringify(books));

    }

}

// DOM Load Event
document.addEventListener('DOMContentLoaded',Store.displayBooks());

// Event Listeners for Add book
document.getElementById('book-form').addEventListener('submit', function (e) {
    // Get forms values
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value;

    // Instantiate book        
    const book = new Book(title, author, isbn);

    // Instantiate UI
    const ui = new UI();

    // Validate
    if (title === '' || author === '' || isbn === '') {
        // Error alert
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        // Add book to the list
        ui.addBookToList(book);

        // Add book to Local Storage
        Store.addBook(book);

        // Show success
        ui.showAlert('Book Added!', 'success');

        // Clear fields
        ui.clearFields();
    }

    // console.log(book);
    e.preventDefault();
});

// Add Event Listener for Delete Book
document.getElementById('book-list').addEventListener('click', function (e) {
    // Instantiate UI
    const ui = new UI();

    // Delete book
    ui.deleteBook(e.target);

    // Remove from LocalStorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show message 
    ui.showAlert('Book Removed!', 'success');

    e.preventDefault();
});
