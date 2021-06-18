"use strict";
const btnMenu = document.querySelector('#menu');
const btnCloseMenu = document.querySelector('#close-menu');
const footer = document.querySelector('footer');
const inputRadioStatus = document.querySelectorAll('input[name="status"]');
const inputReadingPageContainer = document.querySelector('#reading-page-container');

const btnNewBook = document.querySelector('#btn-newBook');
const btnReset = document.querySelector('#btn-reset');
const btnCancel = document.querySelector('#btn-close');
const divContainerInfo = document.querySelector('#container-info');
const divContainerForm = document.querySelector('#container-form');
const divTable = document.querySelector('#container-table');

const headerLastTh = document.querySelector('#lastTh');
const liClearAllContainer = document.querySelector('#clearAll-container');
const btnEmptyLibrary = document.querySelector('#btn-emptyLibrary');

const form = document.querySelector('form');
const formH3 = document.querySelector('form h3');
const formButtons = document.querySelector('#form-buttons');
const editorButtons = document.querySelector('#book-editor-buttons');

const btnSaveEdit = document.querySelector('#btn-save-edit');
const btnResetValue = document.querySelector('#btn-reset-value');
const btnCancelEdit = document.querySelector('#btn-cancel-edit');

const checkLibrary = function(){
    localStorage.setItem('index', '');
    let bookLibrary = JSON.parse(localStorage.getItem('library'));
    if(!bookLibrary) localStorage.setItem('library', JSON.stringify([]));
};

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

const checkIfReading = function(e){
    const inputReadingPage = document.querySelector('#reading-page');
    if(e.target.value == 'Reading'){
        inputReadingPageContainer.removeAttribute('class');
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

const displayNewBookForm = function(){
    if(footer.classList.contains('hidden')){
        closeMenu();
    }
    divContainerInfo.classList.add('hidden');
    divContainerForm.classList.remove('hidden');
    divTable.classList.add('hidden');
};

const hideNewBookForm = function(){
    divContainerInfo.classList.remove('hidden');
    divContainerForm.classList.add('hidden');
    divTable.classList.remove('hidden');
};

const toggleClearAllBtnVisibility = function() {
    liClearAllContainer.classList.remove('hidden')
    setTimeout(() => liClearAllContainer.classList.add('hidden'), 3000);
}

const clearAllBooks = function(){
    const confirmClear = confirm('Clear all book records? Click "OK" to proceed.');
    if(confirmClear){
        localStorage.setItem('library', JSON.stringify([]));
        closeMenu();
        displayBlocker();
    }
};

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

const showError = function(text){
    const message = document.querySelector('#error-msg');
    const h3 = document.querySelector('#error-msg h3');
    h3.innerText = text;
    message.classList.toggle('hidden');
    setTimeout(() => message.classList.toggle('hidden'), 2000);
}

const getData = function(){
    let formInput = document.querySelectorAll('form input');
    const radio = document.querySelector('input[name="status"]:checked');
    let result = Array.from(formInput).reduce((acc, input) => (
        { ...acc, [input.name]: input.value }),{});

    if((!result.title || !result.author) || (Number(result.pages) < 1
        || (radio.value === 'Reading' && result.bookmark == ''))){
        showError('Error: Missing Data Input!');
        return;
    }

    if(radio.value != 'Reading') result.status = radio.value;
    if(radio.value === 'Reading' && result.bookmark){
        if(Number(result.bookmark) >= Number(result.pages)){
            showError('Error: Number of Pages should be higher than Reading Page!');
            return;
        }
        result.status = `Reading p.${result.bookmark}`;
    }
    delete result.bookmark;
    if(localStorage.getItem('index') == ''){
        const message = document.querySelector('#success-msg');
        message.classList.toggle('hidden');
        setTimeout(() => message.classList.toggle('hidden'), 1500);
    }
    return result;
}

const submitHandler = function(event){
    event.preventDefault();

    let result = getData();
    if(!result){ return; }
    
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
    displayBlocker();
    updateTable();
};

const setValue = function(index){
    //change the value of index if the function parameter recieved an event argument
    if(typeof index != "number"){ index = localStorage.getItem('index'); }
    let bookLibrary = JSON.parse(localStorage.getItem('library'));
    let book = bookLibrary[index];
    const inputTitle = document.querySelector('#input-title');
    const inputAuthor = document.querySelector('#input-author');
    const inputPages = document.querySelector('#input-pages');

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
};

const editBook = function(){
    let result = getData();
    if(!result) { return; }

    let bookLibrary = JSON.parse(localStorage.getItem('library'));
    bookLibrary[localStorage.getItem('index')] = result;
    localStorage.setItem('library', JSON.stringify(bookLibrary));
    localStorage.setItem('index', '');
    changeEditorIntoForm();
    updateTable();
}

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
        tr.setAttribute('tabindex', '0');
        const tdTitle = document.createElement('td');
        tdTitle.innerText = bookLibrary[index].title;
        const tdAuthor = document.createElement('td');
        tdAuthor.innerText = bookLibrary[index].author;
        tdAuthor.setAttribute('class', 'author');
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
        if(btnCancel.classList.contains('hidden')){
            btnCancel.classList.remove('hidden');
            formButtons.removeAttribute('style');
        }
    }
};

const displayMenu = function(){
    if(divContainerInfo.classList.contains('hidden')){
        alert('Error: Form is on display!')
        return;
    }
    divTable.classList.add('hidden');
    divContainerInfo.setAttribute('style', 'display: flex;');
    footer.classList.add('hidden');
}

const closeMenu = function(){
    divTable.classList.remove('hidden');
    divContainerInfo.removeAttribute('style');
    footer.classList.remove('hidden');
}

checkLibrary();
updateTable();
displayBlocker();

inputRadioStatus.forEach(function(input){
    input.addEventListener('change', checkIfReading);
});
btnNewBook.addEventListener('click', displayNewBookForm);
btnReset.addEventListener('click', hideReadingPageContainer);
btnCancel.addEventListener('click', hideNewBookForm);

document.addEventListener('submit', submitHandler);

headerLastTh.addEventListener('click', toggleClearAllBtnVisibility);
btnEmptyLibrary.addEventListener('click', clearAllBooks);

btnSaveEdit.addEventListener('click', editBook);
btnResetValue.addEventListener('click', setValue);
btnCancelEdit.addEventListener('click', changeEditorIntoForm);

btnMenu.addEventListener('click', displayMenu);
btnCloseMenu.addEventListener('click', closeMenu);

window.onresize = function(e){ 
    if((window.innerWidth > 800 && footer.classList.contains('hidden'))){
        location.reload(); 
    }
}