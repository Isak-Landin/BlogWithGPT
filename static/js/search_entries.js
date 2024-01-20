document.addEventListener(
    'DOMContentLoaded', () => {
        const search_field = document.getElementById('search_field');

        if(search_field){
            search_field.addEventListener('input', search);
        } else {
            console.error('No search field found!');
        }
    }
)



function search(event) {
    var searchTerm = document.getElementById('search_field').value;
    if (searchTerm.length === 0) {
        console.log('No search term entered');
        return;
    }
    var url = '/search/' + searchTerm;
    fetch(url)
      .then(response => response.json())
        .then(data => {
            renderEntries(data)
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

function renderError(error) {
    const container = document.getElementById('searchResults'); // The container where entries are displayed
}

function renderEntries(entries) {
    if (entries.length === 0) {
        renderNoResultsPlaceholder();
        return;
    }

    const container = document.getElementById('searchResults'); // The container where entries are displayed
    container.innerHTML = ''; // Clear existing entries

    entries.forEach(entry => {
        const article = document.createElement('article');
        article.className = 'entry';

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

        const removeLink = document.createElement('a');
        removeLink.href = '#';
        removeLink.className = 'entry__footer-remove';
        removeLink.textContent = '✕';

        footer.appendChild(editLink);
        footer.appendChild(removeLink);

        article.appendChild(header);
        article.appendChild(content);
        article.appendChild(footer);

        container.appendChild(article);
    }, 250);
}