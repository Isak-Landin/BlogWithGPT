document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
  toggle.addEventListener('click', function() {
    const sectionId = this.parentNode.nextElementSibling.id;
    const section = document.getElementById(sectionId);
    const arrow = this.querySelector('.arrow');

    if (section.style.display === 'none' || !section.style.display) {
      section.style.display = 'block';
      arrow.innerHTML = '&#x25B2;'; // Arrow pointing up
    } else {
      section.style.display = 'none';
      arrow.innerHTML = '&#x25BC;'; // Arrow pointing down
    }
  });
});