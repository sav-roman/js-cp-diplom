document.querySelector('.ticket__title').textContent = localStorage.getItem('film_name');
document.querySelector('.ticket__chairs').textContent = localStorage.getItem('chairsTaken');
document.querySelector('.ticket__hall').textContent = localStorage.getItem('hall_name').slice(3);
document.querySelector('.ticket__start').textContent = localStorage.getItem('seance_time');

//Формирование строки для передачи в QRCreator.js:
let seanceDate = new Date(Number(localStorage.getItem('timestampDay')) * 1000);
seanceDate = seanceDate.getDate() + '.' + (Number(seanceDate.getMonth()) + 1) + '.' + seanceDate.getFullYear();
let qrCodeValue = 'Дата сеанса: ' + seanceDate + '; Время сеанса: ' + localStorage.getItem('seance_time') + '; Зал №: ' + localStorage.getItem('hall_name').slice(3) + '; Ряд/Место: ' + localStorage.getItem('chairsTaken') + '.';
//Генерация qr-кода:
let qrResult = QRCreator(qrCodeValue).result;
qrResult.classList.add('ticket__info-qr');
document.querySelector('.ticket__info-qr').replaceWith(qrResult);