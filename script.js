"use strict";
const checkLibrary = function(){
    localStorage.setItem('index', '');
    let bookLibrary = JSON.parse(localStorage.getItem('library'));
    if(!bookLibrary) localStorage.setItem('library', JSON.stringify([]));
};
checkLibrary();

const bookLabelEditor = function(){
    const liBookLabel = document.querySelector('#book-count-label');
    const trTable = document.querySelectorAll('tr');
    let bookCount = trTable.length-1;

    if(bookCount <= 1){ liBookLabel.innerText = `Book: ${bookCount}`; } 
    else { liBookLabel.innerText = `Books: ${bookCount}`; }

    let bookLibrary = JSON.parse(localStorage.getItem('library'));
    bookCount = bookLibrary.length;
    let completed = 0;
    let tbr = 0;
    let reading = 0;

    for(let index = 0; index < bookCount; index++){
        if (bookLibrary[index].status === 'Completed'){ completed++; }
        else if (bookLibrary[index].status === 'To Be Read'){ tbr++; }
        else { reading++; }
    }

    const liBookReading = document.querySelector('#book-reading');
    const liBookTbr = document.querySelector('#book-tbr');
    const liBookCompleted = document.querySelector('#book-completed');

    liBookReading.innerText = `Reading: ${reading}`;
    liBookTbr.innerText = `To Be Read: ${tbr}`;
    liBookCompleted.innerText = `Completed: ${completed}`;
}

const inputRadioStatus = document.querySelectorAll('input[name="status"]');
const inputReadingPageContainer = document.querySelector('#reading-page-container');

const checkIfReading = function(e){
    const inputReadingPage = document.querySelector('#reading-page');
    if(e.target.value == 'Reading'){
        inputReadingPageContainer.removeAttribute('class');//changed 21:33 june 17
        inputReadingPage.setAttribute('required', 'true') } 
    else { 
        inputReadingPageContainer.classList.add('hidden'); 
        inputReadingPage.removeAttribute('required'); 
    }
}

const hideReadingPageContainer = function(){
    if(!inputReadingPageContainer.classList.contains('hidden')){
        inputReadingPageContainer.classList.add('hidden');
    }
};

inputRadioStatus.forEach(function(input){
    input.addEventListener('change', checkIfReading);
});

const btnNewBook = document.querySelector('#btn-newBook');
const btnReset = document.querySelector('#btn-reset');
const btnCancel = document.querySelector('#btn-close');
const divContainerInfo = document.querySelector('#container-info');
const divContainerForm = document.querySelector('#container-form');
const divTable = document.querySelector('#container-table');

const displayNewBookForm = function(){
    divContainerInfo.classList.add('hidden');
    divContainerForm.classList.remove('hidden');
    divTable.classList.add('hidden');
};

const hideNewBookForm = function(){
    divContainerInfo.classList.remove('hidden');
    divContainerForm.classList.add('hidden');
    divTable.classList.remove('hidden');
};

btnNewBook.addEventListener('click', displayNewBookForm);
btnReset.addEventListener('click', hideReadingPageContainer);
btnCancel.addEventListener('click', hideNewBookForm);

const headerLastTh = document.querySelector('#lastTh');
const liClearAllContainer = document.querySelector('#clearAll-container');
const btnEmptyLibrary = document.querySelector('#btn-emptyLibrary');

const toggleClearAllBtnVisibility = function() {
    liClearAllContainer.classList.remove('hidden')
    setTimeout(() => liClearAllContainer.classList.add('hidden'), 3000);
}

const clearAllBooks = function(){
    const confirmClear = confirm('Clear all book records? Click "OK" to proceed.');
    if(confirmClear){
        localStorage.setItem('library', JSON.stringify([]));
        // updateTable(); 
        displayBlocker(); }
    else{ return; }   
};

headerLastTh.addEventListener('click', toggleClearAllBtnVisibility);
btnEmptyLibrary.addEventListener('click', clearAllBooks);

const book = {
    edit: function() {
        showBookEditor(this.index);
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
    const readingPageContainer = document.querySelector('#reading-page-container');
    readingPageContainer.classList.add('hidden');
    const message = document.querySelector('#success-msg');
    message.classList.toggle('hidden');
    setTimeout(() => message.classList.toggle('hidden'), 1500);
    displayBlocker();
    updateTable();
};

document.addEventListener('submit', submitHandler);

const setValue = function(index){ 
    if(typeof index != "number"){ index = localStorage.getItem('index'); }
    let bookLibrary = JSON.parse(localStorage.getItem('library'));
    let book = bookLibrary[index];
    const inputTitle = document.querySelector('#input-title');
    const inputAuthor = document.querySelector('#input-author');
    const inputPages = document.querySelector('#input-pages');
    // const radio = document.querySelector('input[name="status"]:checked');
    const statusComplete = document.querySelector('#status-complete');
    const statusTbr = document.querySelector('#status-tbr');
    const statusReading = document.querySelector('#status-reading');
    const readingPageContainer = document.querySelector('#reading-page-container');
    const readingPage = document.querySelector('#reading-page');

    inputTitle.value = book.title;
    inputAuthor.value = book.author;
    inputPages.value = book.pages;

    if(book.status == 'Completed'){ statusComplete.checked = 'true'; } 
    else if (book.status == 'To Be Read'){ statusTbr.checked = 'true'; } 
    else { statusReading.checked = 'true';
        readingPageContainer.classList.remove('hidden');
        readingPage.value = book.status.replace( /^\D+/g, '');
    }
};

const form = document.querySelector('form');
const formH3 = document.querySelector('form h3');
const formButtons = document.querySelector('#form-buttons');
const editorButtons = document.querySelector('#book-editor-buttons');

const toggleDisplay = function(){
    divContainerForm.classList.toggle('hidden');
    divTable.classList.toggle('hidden');
    divContainerInfo.classList.toggle('hidden');
};

const changeFormIntoEditor = function(){
    form.setAttribute('style', 'background-color: var(--green); color: var(--primary);');
    formH3.classList.toggle('hidden');
    formButtons.classList.toggle('hidden');
    editorButtons.removeAttribute('class');
};

const changeEditorIntoForm = function(){
    // const inputReadingPageContainer = document.querySelector('#reading-page-container');
    form.removeAttribute('style');
    formH3.classList.toggle('hidden');
    formButtons.classList.toggle('hidden');
    editorButtons.classList.add('hidden');
    inputReadingPageContainer.classList.add('hidden');
    document.querySelector('form').reset();
    localStorage.setItem('index', '');
    toggleDisplay();
};

const showBookEditor = function(index) {
    toggleDisplay();
    changeFormIntoEditor();
    setValue(index);
    localStorage.setItem('index', index);
    // console.log(localStorage.getItem('index'));
    // let x = localStorage.getItem('index');
    // console.log(typeof x);
};

const btnResetValue = document.querySelector('#btn-reset-value');
btnResetValue.addEventListener('click', setValue);
const btnCancelEdit = document.querySelector('#btn-cancel-edit');
btnCancelEdit.addEventListener('click', changeEditorIntoForm);

// let bookLibrary = JSON.parse(localStorage.getItem('library'));
// Object.setPrototypeOf(bookLibrary[0], book);
//index or id inside the objects?
//fix info's, they shouldn't be seen if the button close is hit while the library is empty
//should I group all the addEventListener and clickable node/btn down below?

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
    const formButtons = document.querySelector('#form-buttons');

    if(bookLibrary.length === 0){
        divContainerForm.classList.remove('hidden');
        divContainerInfo.classList.add('hidden');
        btnCancel.classList.add('hidden');
        formButtons.setAttribute('style', 'justify-content: space-evenly;');
        divTable.classList.add('hidden'); } 
    else {
        // divContainerForm.classList.add('hidden');
        // divContainerInfo.classList.remove('hidden');
        if(btnCancel.classList.contains('hidden')){
            btnCancel.classList.remove('hidden');
            formButtons.removeAttribute('style');
        }
        // divTable.classList.remove('hidden');
    }
};
displayBlocker();