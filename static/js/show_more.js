import {renderShowMoreModal} from '/static/js/render.js';


document.addEventListener('DOMContentLoaded', () => {
        let all_show_mores = document.querySelectorAll('.entry__footer-show-more');

        all_show_mores.forEach(show_more => {
            show_more.addEventListener('click', show_more);
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
