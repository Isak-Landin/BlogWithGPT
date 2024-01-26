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
        renderDefaultNotes();
        return;
    }
    var url = '/search/' + searchTerm;
    fetch(url)
      .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                console.log('No entries');
                renderNoResultsPlaceholder(document.getElementById('search_field').value);
                return;
            }
            renderEntries(data)
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

function renderDefaultNotes(){
    var url = '/load-default-notes'
    fetch(url)
        .then(response => response.json())
            .then(data => {
                renderEntries(data)
            })
            .catch(error => {
                console.error('Error:', error);
            });
}

function renderNoResultsPlaceholder(searchTerm) {
    const container = document.getElementById('searchResults'); // The container where entries are displayed
    container.innerHTML = ''; // Clear existing entries

    const article = document.createElement('article');
    article.className = 'noResults';

    const title = document.createElement('h2');
    title.className = 'noResults__title';
    title.textContent = searchTerm.length <= 20 ? 'No results for the search term: ' + '' + searchTerm : searchTerm.substring(0, 20) + '...';

    const content = document.createElement('p');
    content.className = 'noResults__content';

    const link = document.createElement('a');
    link.className = 'noResults__supportLink';

    article.appendChild(title);
    article.appendChild(content);
    article.appendChild(link);

    container.appendChild(article);
}

function renderError(error) {
    const container = document.getElementById('searchResults'); // The container where entries are displayed
}

function renderEntries(entries) {
    // Reformatting in order to make the rendering of the content a application-available function.
    const container = document.getElementById('searchResults'); // The container where entries are displayed
    container.innerHTML = ''; // Clear existing entries

    entries.forEach(entry => {
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
    });
}