"use strict";
const liBookLabel = document.querySelector('#book-count-label');
const trTable = document.querySelectorAll('tr');

const bookLabelEditor = function(){
    let bookCount = trTable.length-1;
    if(bookCount <= 1){
        liBookLabel.innerText = `Book: ${bookCount}`;
    } else {
        liBookLabel.innerText = `Books: ${bookCount}`;
    }
}
bookLabelEditor();

const inputReadingPageContainer = document.querySelector('#reading-page-container');
const inputReadingPage = document.querySelector('#reading-page');
const inputRadioStatus = document.querySelectorAll('input[name="status"]');

const checkIfReading = function(e){
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

