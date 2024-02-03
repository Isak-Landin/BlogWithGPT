import {renderDeleteModal} from '/static/js/render.js';
import {removeElement} from '/static/js/render.js';
import {renderProgressBar} from '/static/js/render.js';
import {renderEntryPlaceholder} from '/static/js/render.js';
import {renderEntryMessage} from '/static/js/render.js';

var note_being_deleted = []

var note_being_deleted = []

document.addEventListener('DOMContentLoaded', () => {
        let all_delete_links = document.querySelectorAll('.entry__footer-remove');

        all_delete_links.forEach(delete_link => {
            delete_link.addEventListener('click', render_delete)
        });
    }
);

/*
{
    _id: "5a42212e42212e422",
    entry: entry_element
}
*/

export function render_delete(event) {
    event.preventDefault();

    var delete_link = event.target;
    var entry = delete_link.parentNode.parentNode;

    var id = entry.getAttribute('id');

    note_being_deleted.push(
        {
            _id: id,
            entry: entry
        }
    );

    document.body.appendChild(renderDeleteModal());
}

export function confirm_delete(event) {
    event.preventDefault();

    var is_deleted = 'Success';
    var url = '/delete/delete/' + note_being_deleted._id;

    const searchResults = document.querySelector('#searchResults');
    const entry_placeholder = renderEntryPlaceholder();
    const loading_container = renderProgressBar();
    entry_placeholder.appendChild(loading_container);

    searchResults.replaceChild(entry_placeholder, note_being_deleted[0].entry);

    fetch(url, {
        method: 'DELETE',    // Specify the method
        headers: {
            'Content-Type': 'application/json',  // Set content type to JSON
        }
    })
    .then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
    })
    .then(data => {

    })
    .error(error => {
        console.log(error);
        is_deleted = false;
    })
    .finally(() => {
        if (document.querySelector('#modalBackdrop')!= null || document.querySelector('.modal-backdrop') != null) {
            removeElement(document.querySelector('#modalBackdrop'));
        }
        removeElement(loading_container);
        entry_placeholder.appendChild(renderEntryMessage(is_deleted));
        setTimeout(() => {
            searchResults.removeChild(entry_placeholder);
        }, 10000);
    });
}

export function cancel_delete(event) {
    event.preventDefault();
}

