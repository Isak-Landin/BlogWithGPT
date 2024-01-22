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
        'mongo_id': note_mongo_id,
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

    console.log(entry);
    console.log(entry__content);
    entry.replaceChild(textarea, entry__content);

    entry.querySelector('.entry__footer-edit').remove();
    entry.querySelector('.entry__footer-remove').remove();
}