import {renderDeleteModal} from '/static/js/render.js';
import {removeElement} from '/static/js/render.js';
import {renderProgressBar} from '/static/js/render.js';
import {renderEntryPlaceholder} from '/static/js/render.js';
import {renderEntryMessage} from '/static/js/render.js';

var note_being_deleted = []

var csrf_and_time = {
    'csrf_token': null,
    'time': Date.now()
};

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

    if (document.querySelector('.modal-backdrop') != null) {
        removeElement(document.querySelector('.modal-backdrop'));
    }

    var delete_link = event.target;
    var entry = delete_link.parentNode.parentNode;

    var id = entry.getAttribute('id');
    console.log(id);

    note_being_deleted.push(
        {
            '_id': id,
            'entry': entry,
            'csrf_token': csrf_token,
        }
    );

    document.body.appendChild(renderDeleteModal());
}

export function confirm_delete(event) {
    event.preventDefault();

    var is_deleted = 'Success';
    var url = '/delete/delete/' + note_being_deleted[0]._id;

    const searchResults = document.querySelector('#searchResults');
    const entry_placeholder = renderEntryPlaceholder();
    const loading_container = renderProgressBar();
    entry_placeholder.appendChild(loading_container);

    searchResults.replaceChild(entry_placeholder, note_being_deleted[0].entry);
    (async () => {
        await generate_or_reuse_csrf_token();

        fetch(url, {
            method: 'DELETE',    // Specify the method
            headers: {
                'Content-Type': 'application/json',  // Set content type to JSON
                'X-CSRF-TOKEN': csrf_and_time.csrf_token,
            }
        })
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
        })
        .then(data => {

        })
        .catch(error => {
            console.log(error);
            is_deleted = false;
        })
        .finally(() => {
            if (document.querySelector('#modalBackdrop')!= null || document.querySelector('.modal-backdrop') != null) {
                console.log('Trying to remove the modal backdrop...');
                removeElement(document.querySelector('.modal-backdrop'));
            }
            removeElement(loading_container);
            entry_placeholder.appendChild(renderEntryMessage(is_deleted));
            note_being_deleted = []
            if(is_deleted) {
                setTimeout(() => {
                    searchResults.removeChild(entry_placeholder);
                }, 10000);
            } else {
                setTimeout(() => {
                    searchResults.replaceChild();
                }, 10000);
            }

        });
    })();
}

export function cancel_delete(event) {
    event.preventDefault();
    var all_existing_modal_backdrops = document.querySelectorAll('.modal-backdrop');
    all_existing_modal_backdrops.forEach(modal_backdrop => {
        removeElement(modal_backdrop);
    });
}

async function generate_or_reuse_csrf_token() {
    var url = '/generate-csrf-token';
    if (csrf_and_time.csrf_token == null || Date.now() - csrf_and_time.time >= 180000) {
        await fetch(url)
        .then(response => response.json())
        .then(data => {
            csrf_and_time.csrf_token = data.csrf_token;
            csrf_and_time.time = Date.now();
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            return
        })
    }
}

