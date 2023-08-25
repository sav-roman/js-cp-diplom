//Функция выбора мест для бронирования:
function chairTake() {
  let confStepRow = Array.from(document.querySelectorAll('.conf-step__row'));
  for(let i = 0; i < confStepRow.length; i++) { // i
    let confStepChair = Array.from(confStepRow[i].querySelectorAll('.conf-step__chair'));
    for(let j = 0; j < confStepChair.length; j++) { //j
      if(!confStepChair[j].classList.contains('conf-step__chair_taken') && !confStepChair[j].classList.contains('conf-step__chair_disabled')) {
        confStepChair[j].addEventListener('click', function() {     
          confStepChair[j].classList.toggle('conf-step__chair_selected');
          let curPrice;
          if(confStepChair[j].classList.contains('conf-step__chair_standart')) {
            curPrice = Number(localStorage.getItem('hall_price_standart'));
          }
          if(confStepChair[j].classList.contains('conf-step__chair_vip')) {
            curPrice = Number(localStorage.getItem('hall_price_vip'));
          }
          //Выделение кнопки при наличие выбранных мест:
          let selectedTrigger = document.querySelector('.conf-step__wrapper').querySelector('.conf-step__chair_selected');
          if (selectedTrigger && document.querySelector('button').getAttribute('disabled')) {
            document.querySelector('button').removeAttribute("disabled");
          } else if(!selectedTrigger && !document.querySelector('button').getAttribute('disabled')) {
            document.querySelector('button').setAttribute("disabled", "disabled");
          }
          //Задаем параметр выбранного элемента с указанием ряда и места или наоборот удаляем в случае снятия выделения
          if(chairsTaken.includes((i + 1) + '/' + (j + 1))) {
            chairsTaken = chairsTaken.replace(', ' + (i + 1) + '/' + (j + 1), '');
            sumPrice = sumPrice - curPrice;
          } else {
            chairsTaken = chairsTaken.concat(', ' + (i + 1) + '/' + (j + 1));
            sumPrice = sumPrice + curPrice;
          }
        });
      }
    }
  }
}
//===================================
let chairsTaken = '';
let sumPrice = 0;

//Время сеанса - timestamp в секундах:
let dayNow = new Date();
let timeTampDate = (dayNow.getTime() - dayNow.getMilliseconds()) / 1000 - dayNow.getSeconds() - dayNow.getMinutes() * 60 - dayNow.getHours() * 3600;
let timeSeanceSec = Number(localStorage.getItem('seance_time').slice(0, 2)) * 3600 + Number(localStorage.getItem('seance_time').slice(3, 5)) * 60;
let timestamp = timeTampDate + Number(localStorage.getItem('time_tamp_day')) + timeSeanceSec;

//Формирование страницы:
document.querySelector('.buying__info-title').textContent = localStorage.getItem('film_name');
document.querySelector('.buying__info-start').textContent = "Начало сеанса: " + localStorage.getItem('seance_time');
document.querySelector('.buying__info-hall').textContent = localStorage.getItem('hall_name').replace('Зал', 'Зал ');
document.querySelector('.conf-step__wrapper').innerHTML = localStorage.getItem('hall_config');

//Запрос на серевер:
getServerValue("event=get_hallConfig&timestamp=" + timestamp + "&hallId=" + localStorage.getItem('hall_id') + "&seanceId=" + localStorage.getItem('seance_id')).then(function(result) {
  if(result) {
    document.querySelector('.conf-step__wrapper').innerHTML = result;
    chairTake();
  }
});
document.querySelector('.price-standart').textContent = localStorage.getItem('hall_price_standart');
document.querySelector('.price-vip').textContent = localStorage.getItem('hall_price_vip');
chairTake();

//Увеличение размера по двойному тапу для устройств с экраном меньше 990px:
if(window.screen.width < 990) {
  function detectDoubleTapClosure() {
    let lastTap = 0;
    let timeout;
    return function detectDoubleTap(event) {
      const curTime = new Date().getTime();
      const tapLen = curTime - lastTap;
      if (tapLen < 500 && tapLen > 0) {
        if(document.querySelector('body').style.zoom == 2) {
          document.querySelector('body').style.zoom = 1;
        } else {
          document.querySelector('body').style.zoom = 2;
        }
        event.preventDefault();
      } else {
        timeout = setTimeout(() => {
          clearTimeout(timeout);
        }, 500);
      }
      lastTap = curTime;
    };
  }
  document.body.addEventListener('touchend', detectDoubleTapClosure());
}
//===================================================================================

//Бронирование выбранных мест:
document.querySelector('button').addEventListener('click', function() {
  chairsTaken = chairsTaken.replace(', ', '');
  localStorage.setItem('timestampDay', timeTampDate + Number(localStorage.getItem('time_tamp_day')));//Дата сеанса в секундах
  localStorage.setItem('chairsTaken', chairsTaken);//Забронированные места
  localStorage.setItem('sumPrice', sumPrice);//Общая сумма к оплате
  localStorage.setItem('timestamp', timestamp);//Начало сеанса в секундах от 1970г
  //Формирование и сохранение разметки для отправки на сервер:
  let sendHtml = document.querySelector('.conf-step__wrapper').innerHTML.replace( /conf-step__chair_selected/g, "conf-step__chair_taken");
  localStorage.setItem('sendHtml', sendHtml);
  //=========================================================
  location.href="payment.html"; //переход на страницу payment.html
});