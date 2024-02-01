import {renderEntry} from './render.js';
import {renderProgressBar} from './render.js';
import {placeProgressBarBeforeElement} from './render.js';
import {removeElement} from './render.js';
import {renderEntryMessage} from './render.js';
import {renderEntryPlaceholder} from './render.js';

/*
    {
        '_id': note_mongo_id,
        'entry__content': entry__content,
        'content': entry__content_text,
        'entry': entry,
        'entry_height': entry_height
     }
*/

var note_being_edited = []


var test_token = null;

document.addEventListener('DOMContentLoaded', () => {
        let all_edit_links = document.querySelectorAll('.entry__footer-edit');

        all_edit_links.forEach(edit_link => {
            edit_link.addEventListener('click', start_edit_mode)
        })
    }
)

export function start_edit_mode(event) {
    if (note_being_edited.length !== 0){
        alert('You cannot edit more than one note at a time!');
        return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    var edit_link = event.currentTarget;
    var entry = edit_link.parentElement.parentElement;
    var entry__content = entry.querySelector('.entry__content');

    var note_mongo_id = entry.getAttribute('id');
    var entry__content_text = entry__content.innerHTML;

    var note_data = {
        '_id': note_mongo_id,
        'entry__content': entry__content,
        'content': entry__content_text,
        'entry': entry,
        'entry_height': entry.clientHeight,
     };
    note_being_edited.push(note_data);
    render_edit_mode();
}

function render_edit_mode() {
    event.preventDefault();
    if (note_being_edited.length === 0){
        document.alert('You must start editing a note first!');
        return;
    }
    console.log('Inserting progress bar');
    const loading_container = placeProgressBarBeforeElement(note_being_edited[0].entry.querySelector('.entry__footer').querySelector('.entry__footer-remove'));
    console.log(loading_container);
    console.log(note_being_edited[0].entry.querySelector('.entry__footer').querySelector('.entry__footer-remove'));
    fetch('/generate-csrf-token')
        .then(response => response.json())
        .then(data => {
            console.log('Is this printed twice?');
            if (data.csrf_token === null){
                alert('Error: Could not generate CSRF token!');
                return;
            }
            const form = document.createElement('form');
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrf_token';
            csrfInput.value = data.csrf_token;
            test_token = data.csrf_token;

            form.appendChild(csrfInput);

            var textarea = document.createElement('textarea');
            textarea.id = 'entry__content-edit-mode';
            textarea.value = note_being_edited[0].content.trim();

            form.appendChild(textarea);

            note_being_edited[0].entry.replaceChild(form, note_being_edited[0].entry__content);

            var edit_link = note_being_edited[0].entry.querySelector('.entry__footer-edit');
            var delete_link = note_being_edited[0].entry.querySelector('.entry__footer-remove');

            var save_button = document.createElement('button');
            save_button.id = 'entry__footer-save-button';
            save_button.className = 'entry__footer-button';
            save_button.role = 'button';
            save_button.textContent = 'Save';
            save_button.addEventListener('click', save_edit_mode);

            var cancel_button = document.createElement('button');
            cancel_button.id = 'entry__footer-cancel-button';
            cancel_button.className = 'entry__footer-button';
            cancel_button.role = 'button';
            cancel_button.textContent = 'Cancel';
            cancel_button.addEventListener('click', cancel_edit_mode);

            var entry__footer = note_being_edited[0].entry.querySelector('.entry__footer');
            entry__footer.replaceChild(save_button, delete_link);
            entry__footer.replaceChild(cancel_button, edit_link);
        })
        /*
        .catch(error => {
            console.error('Error:', error);
            exit_edit_mode();
        });
        */
        .finally(() => {
            removeElement(loading_container);
        });


}

function save_edit_mode(event) {
    var error_or_save = 'save'
    event.preventDefault();

    const entry = note_being_edited[0].entry;

    var id_of_edited_note = entry.getAttribute('id'); // Get the id of the note that was edited
    var id_of_note_being_edited = note_being_edited[0]['_id'];

    if (id_of_edited_note!== id_of_note_being_edited){
        alert('Internal error: The id of the edited note does not match the id of the note being edited!');
        return;
    }

    var textarea = document.getElementById('entry__content-edit-mode');
    var content = textarea.value.trim();
    if (content.length === 0){
        alert('You cannot save an empty note!');
        return;
    }
    var url = '/edit/edit/' + id_of_edited_note;
    const data = {
        'content': content,
    }

    const loading_circle = placeProgressBarBeforeElement(note_being_edited[0].entry.querySelector('.entry__footer').querySelector('#entry__footer-save-button'));
    console.log(loading_circle);

    fetch(url, {
        method: 'PUT',    // Specify the method
        headers: {
            'Content-Type': 'application/json',  // Set content type to JSON
            'X-CSRF-TOKEN': test_token
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message){
            console.log(data.message);
        } else if (data.error){
            console.log(data.error);
            error_or_save = 'error';
        }
        else {
            error_or_save = 'error';
            console.log(data);
        }
    })
    .catch(error => {
        error_or_save = 'error';
        console.error('Error:', error);
        document.alert('Internal error: Could not save the edited note!: ' + error);
    })
    .finally(() => {
        removeElement(loading_circle);
        exit_edit_mode(event, error_or_save);
    });

}

function cancel_edit_mode(event) {
    var error_or_cancel = 'cancel';

    event.preventDefault();

    exit_edit_mode(event, error_or_cancel);
}

function exit_edit_mode(event, save_error_cancel = 'cancel') {
    var is_saved = false;
    if (note_being_edited.length === 0){
        alert('Something went wrong! Please refresh the page and try again!');
        return;
    }

    if (save_error_cancel === 'save') {
        is_saved = true;
        const url = '/edit/' + note_being_edited[0]._id;
        fetch(url)
        .then(response => response.json())
        .then(data => {
            const message_container = renderEntryMessage(data.message);

            const new_article = renderEntry(data.note);
            new_article.appendChild(message_container);

            const searchResults = document.querySelector('#searchResults');
            searchResults.replaceChild(new_article, note_being_edited[0].entry);
            note_being_edited.entry = new_article;

            setTimeout(() => {
                new_article.removeChild(message_container);
            }, 10000);

        })
        .catch(error => {
            is_saved = false;
            console.log(error);
        })
        .finally(() => {
            note_being_edited = []
        });
    } else if (save_error_cancel === 'error') {
        if (note_being_edited[0].entry.querySelector('.alert-danger') !== null || note_being_edited[0].entry.querySelector('.alert-success') !== null){
            const error_message_containers = note_being_edited[0].entry.querySelectorAll('.alert-danger');
            const success_message_containers = note_being_edited[0].entry.querySelectorAll('.alert-success')

            error_message_containers.forEach(message_container => {
                note_being_edited[0].entry.removeChild(message_container);
            });

            success_message_containers.forEach(message_container => {
                note_being_edited[0].entry.removeChild(message_container);
            });
        }
        const message_container = renderEntryMessage('Canceling edit...');
        note_being_edited[0].entry.appendChild(message_container);

    } else if (save_error_cancel === 'cancel') {
        const searchResults = document.querySelector('#searchResults');

        const entry_placeholder = renderEntryPlaceholder(note_being_edited[0].entry_height);
        const loading_element = renderProgressBar();

        entry_placeholder.appendChild(loading_element);


        searchResults.replaceChild(entry_placeholder, note_being_edited[0].entry);

        const url = '/edit/' + note_being_edited[0]._id;
        fetch(url, {
            method: 'GET',    // Specify the method
            headers: {
                'Content-Type': 'application/json',  // Set content type to JSON
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.note) {
                const article = renderEntry(data.note);
                searchResults.replaceChild(article, entry_placeholder);

                note_being_edited[0].entry = article;
            } else {
                if (data.error) {
                    console.log('error: ' + data.error);
                } else {
                    console.log('Something went wrong and no error was returned from the server');
                }
                alert('Something went wrong, please refresh the page.')
            }
        });
    }





    // TODO what we could do instead of replacing the inner textarea and form with a custom built tag...
    // TODO let's instead use the same generation method that we use to generate each note when searching for notes...
    // The referenced to this exists in search_entries.js
}   // TODO Let's make the function used in the search_entries.js file a stand-alone function and import it to both files...