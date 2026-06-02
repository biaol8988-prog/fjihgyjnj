document.addEventListener('DOMContentLoaded', () => {
  console.log('AI Myth Universe loaded');

  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('active');
    });
  });
});