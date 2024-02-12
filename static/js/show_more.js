import {renderShowMoreModal} from '/static/js/render.js';
import {renderShowMore} from '/static/js/render.js';


document.addEventListener('DOMContentLoaded', () => {
        let all_show_mores = document.querySelectorAll('.entry__footer-show-more');

        all_show_mores.forEach(show_more => {
            show_more.addEventListener('click', show_more);
        });

        let all_entries_shown = document.querySelectorAll('.entry');
        all_entries_shown.forEach(entry => {
            const content = entry.querySelector('.entry__content');
            if (content.scrollHeight > content.clientHeight) {
                const showMoreDiv = renderShowMore();

                const footer = entry.querySelector('.entry__footer');
                const removeLink = footer.querySelector('.entry__footer-remove');
                footer.insertBefore(showMoreDiv, removeLink);
                console.log('This is a confirmation that show more is needed');
            }
        });

    }
);

// <a href="#" class="entry__footer-show-more">Show more</a>
export function show_more(event) {
    const target = event.target;
    const entry = target.parentNode.parentNode;
    const content = entry.querySelector('.entry__content');

    const modal_backdrop = renderShowMoreModal();

}
