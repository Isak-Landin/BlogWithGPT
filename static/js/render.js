import {start_edit_mode} from '/static/js/edit_note.js';

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

    footer.appendChild(editLink);
    footer.appendChild(removeLink);

    article.appendChild(header);
    article.appendChild(content);
    article.appendChild(footer);

    return article;
}


export function renderProgressCircle(element_to_be_placed_before) {
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

    const return_value = element_to_be_placed_before.insertAdjacentElement('beforebegin', outerContainer);
    console.log(element_to_be_placed_before.parentNode);
    console.log(return_value);
    return outerContainer;
}

export function removeElement(element_to_be_removed) {
    element_to_be_removed.parentNode.removeChild(element_to_be_removed);
}

export function renderEntryMessage(message) {
    const message_container = document.createElement('div');
    const message_container_text = document.createElement('p');
    message_container.appendChild(message_container_text);

    if (message === 'Success'){
        message_container.className = 'alert alert-success';
        message_container_text.textContent = 'We successfully saved the edited note!';
    } else {
        message_container.className = 'alert alert-danger';
        message_container.textContent = 'Something went wrong! Please refresh the page';
    }

    return message_container;
}