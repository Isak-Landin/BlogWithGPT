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