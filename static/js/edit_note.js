const note_editing = []

document.addEventListener('DOMContentLoaded', () => {
        let all_edit_links = document.querySelectorAll('.entry__footer-edit');

        all_edit_links.forEach(edit_link => {
            edit_link.addEventListener('click', start_edit_note)
        })
    }
)

function start_edit_note(event) {
    if (note_editing.length !== 0){
        document.alert('You cannot edit more than one note at a time!');
        return;
    }

    event.preventDefault();

    var edit_link = event.currentTarget;
    var entry = edit_link.parentElement.parentElement;
    var entry_content = entry.querySelector('.entry__content');

    var note_mongo_id = entry.getAttribute('id');
    var entry_content_text = entry_content.innerHTML;

    const note_data = {note_mongo_id, entry_content_text};
    note_editing.push(note_data);

}