"use strict";
const checkLibrary = function(){
    let bookLibrary = JSON.parse(localStorage.getItem('library'));
    if(!bookLibrary) localStorage.setItem('library', JSON.stringify([]));
};
checkLibrary();

const bookLabelEditor = function(){
    const liBookLabel = document.querySelector('#book-count-label');
    const trTable = document.querySelectorAll('tr');
    let bookCount = trTable.length-1;

    if(bookCount <= 1){
        liBookLabel.innerText = `Book: ${bookCount}`;
    } else {
        liBookLabel.innerText = `Books: ${bookCount}`;
    }
}

const inputRadioStatus = document.querySelectorAll('input[name="status"]');

const checkIfReading = function(e){
    const inputReadingPageContainer = document.querySelector('#reading-page-container');
    const inputReadingPage = document.querySelector('#reading-page');
    if(e.target.value == 'Reading'){
        inputReadingPageContainer.classList.remove('hidden');
        inputReadingPage.setAttribute('required', 'true') } 
    else { 
        inputReadingPageContainer.classList.add('hidden'); 
        inputReadingPage.removeAttribute('required'); 
    }
}

inputRadioStatus.forEach(function(input){
    input.addEventListener('change', checkIfReading);
});

const btnNewBook = document.querySelector('#btn-newBook');
const btnCancel = document.querySelector('#btn-cancel');
const divContainerInfo = document.querySelector('#container-info');
const divContainerForm = document.querySelector('#container-form');

const showForm = function(){
    divContainerInfo.classList.add('hidden');
    divContainerForm.classList.remove('hidden');
};

const hideForm = function(){
    divContainerInfo.classList.remove('hidden');
    divContainerForm.classList.add('hidden');
};

btnNewBook.addEventListener('click', showForm);
btnCancel.addEventListener('click', hideForm);

const headerLastTh = document.querySelector('#lastTh');
const liClearAllContainer = document.querySelector('#clearAll-container');
const btnEmptyLibrary = document.querySelector('#btn-emptyLibrary');

const toggleClearAllBtnVisibility = function() {
    liClearAllContainer.classList.toggle('hidden');
}

const clearAllBooks = function(){
    const confirmClear = confirm('Clear all book records? Click "OK" to proceed.');
    if(confirmClear){
        localStorage.setItem('library', JSON.stringify([]));
        updateTable(); }
    else{ return; }   
};

headerLastTh.addEventListener('click', toggleClearAllBtnVisibility);
btnEmptyLibrary.addEventListener('click', clearAllBooks);

const book = {
    edit: function() {
        // let bookLibrary = JSON.parse(localStorage.getItem('library'));
        console.log(this.index);
    },
    delete: function() {
        let bookLibrary = JSON.parse(localStorage.getItem('library'));
        const confirmDelete = confirm(`Delete ${this.title}? Click "OK" to proceed.`);
        if(confirmDelete){
            bookLibrary.splice(this.index, 1);
            localStorage.setItem('library', JSON.stringify(bookLibrary));
            updateTable();
            displayBlocker(); }
        else{ return; }
    }
};

const submitHandler = function(event){
    event.preventDefault();

    let formInput = document.querySelectorAll('form input');
    const radio = document.querySelector('input[name="status"]:checked');

    let result = Array.from(formInput).reduce((acc, input) => (
        { ...acc, [input.name]: input.value }),{});

    if(radio.value != 'Reading') result.status = radio.value;
    if(radio.value === "Reading" && result.bookmark){
        if(Number(result.bookmark) >= Number(result.pages)){
            const message = document.querySelector('#error-msg');
            message.classList.toggle('hidden');
            setTimeout(() => message.classList.toggle('hidden'), 2000);
            return;
        }
        result.status = `Reading p.${result.bookmark}`;
    }

    delete result.bookmark;
    document.querySelector('form').reset();

    let bookLibrary = JSON.parse(localStorage.getItem('library'));
    const newBook = {};

    newBook.title = result.title;
    newBook.author = result.author;
    newBook.pages = result.pages;
    newBook.status = result.status;
    
    bookLibrary.push(newBook);
    localStorage.setItem('library', JSON.stringify(bookLibrary));
    const message = document.querySelector('#success-msg');
    message.classList.toggle('hidden');
    setTimeout(() => message.classList.toggle('hidden'), 1500);
    displayBlocker();
    updateTable();
};

// let bookLibrary = JSON.parse(localStorage.getItem('library'));
// Object.setPrototypeOf(bookLibrary[0], book);
//index or id inside the objects?
//reading pages shouldn't be higher than the number of pages

document.addEventListener('submit', submitHandler);

const updateTable = function(){
    let bookLibrary = JSON.parse(localStorage.getItem('library'));
    if(bookLibrary.length == 0) return;
    let bookCount = bookLibrary.length ;
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    
    for(let index = 0; index < bookCount; index++){
        Object.setPrototypeOf(bookLibrary[index], book);
        bookLibrary[index].index = index;

        const tr = document.createElement('tr');
        tr.setAttribute('class', 'tr-book');
        const tdTitle = document.createElement('td');
        tdTitle.innerText = bookLibrary[index].title;
        const tdAuthor = document.createElement('td');
        tdAuthor.innerText = bookLibrary[index].author;
        const tdPages = document.createElement('td');
        tdPages.setAttribute('class', 'pages');
        tdPages.innerText = bookLibrary[index].pages;
        const tdStatus = document.createElement('td');
        tdStatus.setAttribute('class', 'status');
        tdStatus.innerText = bookLibrary[index].status;
        const tdManage = document.createElement('td');
        tdManage.setAttribute('class', 'manage'); 

        const btnEdit = document.createElement('button');
        btnEdit.setAttribute('class', 'edit');
        const spanEdit = document.createElement('span');
        spanEdit.setAttribute('class', 'material-icons-outlined middle');
        spanEdit.innerText = "edit";
        const btnDelete = document.createElement('button');
        btnDelete.setAttribute('class', 'delete');
        const spanDelete = document.createElement('span');
        spanDelete.setAttribute('class', 'material-icons-outlined middle');
        spanDelete.innerText = "delete";

        tbody.appendChild(tr);
        tr.appendChild(tdTitle);
        tr.appendChild(tdAuthor);
        tr.appendChild(tdPages);
        tr.appendChild(tdStatus);
        tr.appendChild(tdManage);

        tdManage.appendChild(btnEdit);
        btnEdit.appendChild(spanEdit);
        tdManage.appendChild(btnDelete); 
        btnDelete.appendChild(spanDelete);

        btnEdit.onclick = () => bookLibrary[index].edit();
        btnDelete.onclick = () => bookLibrary[index].delete();
    }
    bookLabelEditor();
};
updateTable();

const displayBlocker = function(){
    let bookLibrary = JSON.parse(localStorage.getItem('library'));
    let divTable = document.querySelector('#container-table');
    if(bookLibrary.length === 0){
        divContainerForm.classList.remove('hidden');
        divContainerInfo.classList.add('hidden');
        divTable.classList.add('hidden'); } 
    else {
        // divContainerForm.classList.add('hidden');
        // divContainerInfo.classList.remove('hidden');
        divTable.classList.remove('hidden');
    }
};
displayBlocker();