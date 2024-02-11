import {start_edit_mode} from '/static/js/edit_note.js';
import {render_delete} from '/static/js/delete_note.js';
import {confirm_delete} from '/static/js/delete_note.js';
import {cancel_delete} from '/static/js/delete_note.js';
import {show_more} from '/static/js/show_more.js';

export function renderEntry(entry) {
    const article = document.createElement('article');
    article.className = 'entry';
    article.id = entry._id;

    const header = document.createElement('div');
    header.className = 'entry__header';

    const title = document.createElement('h2');
    title.className = 'entry__title';
    title.textContent = entry.title;

    const time = document.createElement('time');
    time.className = 'entry__date';
    time.setAttribute('datetime', entry.date);
    time.textContent = '· ' + entry.formattedDate;

    header.appendChild(title);
    header.appendChild(time);

    const content = document.createElement('p');
    content.className = 'entry__content';
    content.textContent = entry.content;

    const footer = document.createElement('div');
    footer.className = 'entry__footer';

    const editLink = document.createElement('a');
    editLink.href = '#';
    editLink.className = 'entry__footer-edit';
    editLink.textContent = '✎';
    editLink.addEventListener('click', start_edit_mode);

    const removeLink = document.createElement('a');
    removeLink.href = '#';
    removeLink.className = 'entry__footer-remove';
    removeLink.textContent = '✕';
    removeLink.addEventListener('click', render_delete);

    footer.appendChild(editLink);
    footer.appendChild(removeLink);

    article.appendChild(header);
    article.appendChild(content);
    article.appendChild(footer);

    article.style.position = 'absolute';
    article.style.top = '-9999px';
    article.style.left = '-9999px';
    article.style.visibility = 'hidden';

    if (article.scrollHeight > article.clientHeight) {
        const showMore = renderShowMore();
        article.insertBefore(showMore, removeLink);
    }

    return article;
}

export function renderEntryPlaceholder(entry_height) {
    const article = document.createElement('article');
    article.className = 'entry';
    article.id = 'entry_placeholder';

    article.style.height = entry_height + 'px';

    return article;
}

export function placeProgressBarBeforeElement(element_to_be_placed_before) {
    const outerContainer = renderProgressBar();
    const return_value = element_to_be_placed_before.insertAdjacentElement('beforebegin', outerContainer);

    return outerContainer;
}

export function renderProgressBar() {
    const outerContainer = document.createElement('div');
    outerContainer.className = 'progress';

    const innerContainer = document.createElement('div');
    innerContainer.className = 'color';
    outerContainer.appendChild(innerContainer);

    const innerText = document.createElement('p');
    innerText.className = 'text';
    innerText.textContent = 'Loading...';
    innerContainer.appendChild(innerText);


    /* const loading_circle = document.createElement('div');
    loading_circle.className = 'loading-circle';

    loading_container.appendChild(loading_circle); */

    return outerContainer;
}

export function removeElement(element_to_be_removed) {
    console.log(element_to_be_removed);
    element_to_be_removed.parentNode.removeChild(element_to_be_removed);
}

export function renderEntryMessage(status) {
    const message_container = document.createElement('div');
    const message_container_text = document.createElement('p');
    message_container.appendChild(message_container_text);

    if (status === 'Success'){
        message_container.className = 'alert alert-success';
        message_container_text.textContent = 'We successfully modified your note!';
    } else {
        message_container.className = 'alert alert-danger';
        message_container.textContent = 'Something went wrong! Please refresh the page';
    }

    return message_container;
}

export function renderDeleteModal() {
    const modalBackdrop = document.createElement('div');
    modalBackdrop.className ='modal-backdrop';
    modalBackdrop.id ='modalBackdrop';
    modalBackdrop.addEventListener('click', function(event) {
        if (event.target === this){
            cancel_delete(event);
        }

    })

    const modalContent = document.createElement('div');
    modalContent.className ='modal-content';
    modalContent.id ='modalContent';
    modalBackdrop.appendChild(modalContent);

    const modalHeader = document.createElement('div');
    modalHeader.className ='modal-content__header';
    modalHeader.id ='modalHeader';
    modalContent.appendChild(modalHeader);

    const modalMain = document.createElement('div');
    modalMain.className ='modal-content__main';
    modalMain.id ='modalMain';
    modalContent.appendChild(modalMain);

    const modalFooter = document.createElement('div');
    modalFooter.className ='modal-content__footer';
    modalFooter.id ='modalFooter';
    modalContent.appendChild(modalFooter);

    const modalExitLink = document.createElement('a');
    modalExitLink.href = '#';
    modalExitLink.className ='modal-content__header-exit';
    modalExitLink.textContent = '✕';
    modalExitLink.addEventListener('click', cancel_delete);
    modalHeader.appendChild(modalExitLink);

    const modalText = document.createElement('p');
    modalText.className ='modal-content__main-text';
    modalText.textContent = 'Are you sure you want to delete this note?';
    modalMain.appendChild(modalText);


    const confirm_button = document.createElement('button');
    confirm_button.className = 'btn btn-danger';
    confirm_button.id = 'confirm_button';
    confirm_button.textContent = 'Confirm';
    confirm_button.addEventListener('click', confirm_delete);
    modalFooter.appendChild(confirm_button);

    const cancel_button = document.createElement('button');
    cancel_button.className = 'btn btn-secondary';
    cancel_button.id = 'cancel_button';
    cancel_button.textContent = 'Cancel';
    cancel_button.addEventListener('click', cancel_delete);
    modalFooter.appendChild(cancel_button);

    return modalBackdrop;
}


export function renderShowMoreModal (event) {
    const activated_entry = event.target.parentNode.parentNode;

    const modalBackdrop = document.createElement('div');
    modalBackdrop.className ='show-more__modal-backdrop';
    modalBackdrop.id ='showMoreModalBackdrop';

    const modalContent = document.createElement('div');
    modalContent.className ='show-more__modal-content';
    modalContent.id ='showMoreModalContent';
    modalBackdrop.appendChild(modalContent);


}

// div class="plus"></div>
export function renderShowMore () {
    const showMore = document.createElement('div');
    showMore.className ='plus';
    showMore.addEventListener('click', show_more);

    return showMore;
}