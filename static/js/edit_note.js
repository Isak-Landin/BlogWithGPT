const note_being_edited = []

document.addEventListener('DOMContentLoaded', () => {
        let all_edit_links = document.querySelectorAll('.entry__footer-edit');

        all_edit_links.forEach(edit_link => {
            edit_link.addEventListener('click', start_edit_note)
        })
    }
)

function start_edit_note(event) {
    if (note_being_edited.length !== 0){
        document.alert('You cannot edit more than one note at a time!');
        return;
    }

    event.preventDefault();

    var edit_link = event.currentTarget;
    var entry = edit_link.parentElement.parentElement;
    var entry__content = entry.querySelector('.entry__content');

    var note_mongo_id = entry.getAttribute('id');
    var entry__content_text = entry__content.innerHTML;

    var note_data = {
        '_id': note_mongo_id,
        'content': entry__content_text
     };
    note_being_edited.push(note_data);
    render_edit_mode(entry, entry__content);
}

function render_edit_mode(entry, entry__content) {
    if (note_being_edited.length === 0){
        document.alert('You must start editing a note first!');
        return;
    }

    var textarea = document.createElement('textarea');
    textarea.id = 'entry__content-edit-mode';
    textarea.value = note_being_edited[0].content.trim();

    entry.replaceChild(textarea, entry__content);

    var edit_link = entry.querySelector('.entry__footer-edit');
    var delete_link = entry.querySelector('.entry__footer-remove');

    var save_button = document.createElement('button');
    save_button.id = 'entry__footer-save-button';
    save_button.className = 'entry__footer-button';
    save_button.role = 'button';
    save_button.textContent = 'Save';
    save_button.addEventListener('click', (event) => save_edit_mode(event, entry));

    var cancel_button = document.createElement('button');
    cancel_button.id = 'entry__footer-cancel-button';
    cancel_button.className = 'entry__footer-button';
    cancel_button.role = 'button';
    cancel_button.textContent = 'Cancel';
    cancel_button.addEventListener('click', (event) => cancel_edit_mode(event, entry));

    var entry__footer = entry.querySelector('.entry__footer');
    entry__footer.replaceChild(save_button, delete_link);
    entry__footer.replaceChild(cancel_button, edit_link);

}

function save_edit_mode(event, entry) {
    event.preventDefault();

    var id_of_edited_note = entry.getAttribute('id'); // Get the id of the note that was edited
    var id_of_note_being_edited = note_being_edited[0]['_id'];

    console.log(note_being_edited);
    console.log(id_of_edited_note);
    console.log(id_of_note_being_edited);

    if (id_of_edited_note!== id_of_note_being_edited){
        alert('Internal error: The id of the edited note does not match the id of the note being edited!');
        return;
    }

    var textarea = document.getElementById('entry__content-edit-mode');
    var content = textarea.value.trim();
    if (content.length === 0){
        document.alert('You cannot save an empty note!');
        return;
    }
    var url = '/edit/save/' + id_of_edited_note;
    const data = {
        'content': content,
    }
    fetch(url, {
        method: 'PUT',    // Specify the method
        headers: {
            'Content-Type': 'application/json',  // Set content type to JSON
        },
        body: JSON.stringify(data)
    })

    exit_edit_mode(event);
}

function cancel_edit_mode(event) {
    event.preventDefault();

    exit_edit_mode(event);
}

function exit_edit_mode(event) {

}