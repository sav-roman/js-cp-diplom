document.querySelector('.ticket__title').textContent = localStorage.getItem('film_name');
document.querySelector('.ticket__chairs').textContent = localStorage.getItem('chairsTaken');
document.querySelector('.ticket__hall').textContent = localStorage.getItem('hall_name').slice(3);
document.querySelector('.ticket__start').textContent = localStorage.getItem('seance_time');
document.querySelector('.ticket__cost').textContent = localStorage.getItem('sumPrice');
document.querySelector('.acceptin-button').addEventListener('click', function() {
  //Отправка данных на сервер и переход по ссылке после отправки: 
  localStorage.getItem('timestamp'); //начало сеанса с учетом даты. Значение указывается в секундах
  localStorage.getItem('hall_id'); //id зала
  localStorage.getItem('seance_id'); //id сеанса
  localStorage.getItem('sendHtml'); //отправляемая разметка
  getServerValue('event=sale_add&timestamp=' + localStorage.getItem('timestamp') + '&hallId=' + localStorage.getItem('hall_id') + '&seanceId=' + localStorage.getItem('seance_id') + '&hallConfiguration=' + localStorage.getItem('sendHtml')).then(function() {
  location.href="ticket.html";//переход на страницу ticket.html
  });
});