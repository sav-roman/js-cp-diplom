//Функция возвращает массив содежащий текущую дату и день недели и так же на 5 дней вперед:
function dateArr() {
  let arr = [[], [], [], [], [], []];
  let date = new Date();
  for (let i = 0; i < 6; i++) {
    switch (date.getDay()) {
      case 0: arr[i][0] = "Вск"; break;
      case 1: arr[i][0] = "Пн"; break;
      case 2: arr[i][0] = "Вт"; break;
      case 3: arr[i][0] = "Ср"; break;
      case 4: arr[i][0] = "Чт"; break;
      case 5: arr[i][0] = "Пт"; break;
      case 6: arr[i][0] = "Сб"; break;
    }
    arr[i][1] = date.getDate();
    if (i < 6) {
      date = new Date(date.getTime() + 1000 * 60 * 60 * 24);
    } 
  }
  return arr;
}
//=================================================================

//Функция переключения навигационного меню:
function activNavElement(el) {
  document.querySelector('.page-nav__day_chosen').classList.remove('page-nav__day_chosen');
  el.classList.add('page-nav__day_chosen');
}
//=================================================================

//Функция формирующая контент страницы index.html на основании полученного ответа с сервера:
function indexContent(result) {
  //Сохранение элемента контента:
  let contentElements = Array.from(document.querySelectorAll('.movie'));
  let contentEltmentBase = contentElements[0];
  let contentMain = contentEltmentBase.parentElement;
  let seances = Array.from(contentMain.querySelectorAll('.movie-seances__hall'));
  for (let seanceEl of seances) {
    seanceEl.remove();
  }

  //Удаление старого контента:
  for(let i = 0; i < contentElements.length; i++) {
    contentElements[i].remove();
  }

  //Загрузка нового контента: 

  //Создаем массив закрытых залов:
  let closeHallArr = [];
  for(hallsEl of result.halls.result) {
    if(hallsEl.hall_open == 0) {
        closeHallArr.push(hallsEl.hall_id);
    }
  }
  //=============================

  //Формируем контент для каждого фильма из полученного списка:
  result.films.result.forEach(function(el) {
    contentMain.insertAdjacentElement('beforeEnd', contentEltmentBase.cloneNode(true));
    const elMod = contentMain.lastChild; //элемент class = "movie"
    elMod.querySelector('.movie__title').textContent = el.film_name;
    elMod.querySelector('.movie__synopsis').textContent = el.film_description;
    elMod.querySelector('.movie__data-duration').textContent = el.film_duration + ' минут';
    elMod.querySelector('.movie__data-origin').textContent = el.film_origin;
    elMod.querySelector('.movie__poster-image').setAttribute('src', el.film_poster);
    elMod.querySelector('.movie__poster-image').setAttribute('alt', el.film_name);
    const filmId = el.film_id; //id текущего фильма

    //Формируем массив залов для фильма текущей итерации и массив массивов сеансов, порядковый номер которого соответ-
    //ствует массиву залов:
    // Пример:
    // let hallModel = [Зал1, id1, Зал3, id3];
    // let seanceModel = [[10:00 idсеанса, 15:30 idсеанса],
    //                    [12:00 idсеанса, 16:45 idсеанса]];
    let hallModel = []; // Массив залов
    let seanceModel = []; // Массив сеансов
    elR = result.seances.result;
    for(let i = 0; i < elR.length; i++) {
      if(elR[i].seance_filmid == filmId && !closeHallArr.includes(elR[i].seance_hallid)) {
        let hallName = result.halls.result.find(el => el.hall_id == elR[i].seance_hallid).hall_name;//имя зала по id
        let hallId = result.halls.result.find(el => el.hall_id == elR[i].seance_hallid).hall_id;//id зала
        if(hallModel.indexOf(hallName) == -1) {
          hallModel.push(hallName);
          hallModel.push(hallId);
          seanceModel.push([elR[i].seance_time + ' ' + elR[i].seance_id]);
        } else {
          seanceModel[hallModel.indexOf(hallName)].push(elR[i].seance_time + ' ' + elR[i].seance_id);
        }
      }
    }

    //Слияние двух массивов:
    let j = 0;
    for(let i = 0; i < (hallModel.length / 2); i++) {
      seanceModel[i].unshift(hallModel[j+1]);
      seanceModel[i].unshift(hallModel[j]);
      j += 2;
    }
      
    //Сортировка массива по возрастанию номера зала:
    let seanceModelSort = seanceModel.sort(function(a, b) {
      return parseInt(a[0].slice(3)) - parseInt(b[0].slice(3));
    });
    //Формирование расписания сеансов с привязкой к залам на основе массива seanceModelSort:
    for(let elS of seanceModelSort) {
      elMod.insertAdjacentHTML("beforeEnd", '<div class="movie-seances__hall"><h3 class="movie-seances__hall-title">' + elS[0].replace('Зал', 'Зал ') + '</h3><ul class="movie-seances__list"></ul></div>');
      for(let i = 2; i < elS.length; i++) {
        //Привязка события к кнопке сеанса:
          //=====================================
        timeNow = new Date();  
        if(!Number(localStorage.getItem('time_tamp_day')) && (timeNow.getMinutes() + timeNow.getHours() * 60) > (Number(elS[i].slice(0, 2)) * 60 + Number(elS[i].slice(3, 5)))) {
          elMod.lastChild.querySelector('.movie-seances__list').insertAdjacentHTML("beforeEnd", '<li class="movie-seances__time-block"><a class="movie-seances__time" href="#0" style="background-color: #d9d2d2; color: gray; cursor: not-allowed;">' + elS[i].slice(0, 5) + '</a></li>');
        } else {
          elMod.lastChild.querySelector('.movie-seances__list').insertAdjacentHTML("beforeEnd", '<li class="movie-seances__time-block"><a class="movie-seances__time" href="hall.html">' + elS[i].slice(0, 5) + '</a></li>');
        }
          //======================================
        elMod.lastChild.querySelector('.movie-seances__list').lastChild.addEventListener('click', function() {
          //Запись в localStorage:
          localStorage.setItem('film_name', el.film_name);
          localStorage.setItem('seance_time', elS[i].slice(0, 5));
          localStorage.setItem('hall_name', elS[0]);
          localStorage.setItem('hall_id', elS[1]);
          localStorage.setItem('seance_id', elS[i].slice(6, 8));
          result.halls.result.forEach(function(elH) {
            if(elH.hall_id == elS[1]) {
              localStorage.setItem('hall_config', elH.hall_config);
              localStorage.setItem('hall_price_standart', elH.hall_price_standart);
              localStorage.setItem('hall_price_vip', elH.hall_price_vip);
            }
          });
        })
      }
    }
  });
}
//=================================================================

//Основная часть:=================================================================

//Задание актуальных дней недели и дат:
let arrayNavDay = Array.from(document.querySelectorAll('.page-nav__day'));
for(elNd of arrayNavDay) {
  if (elNd.classList.contains('page-nav__day_chosen')) {
    elNd.classList.remove('page-nav__day_chosen');
  }
}
document.querySelectorAll('.page-nav__day')[localStorage.getItem('time_tamp_day') / (3600 * 24)].classList.add('page-nav__day_chosen');
let arrDayWeek = dateArr();
let pageNavDayWeek = Array.from(document.querySelectorAll('.page-nav__day-week'));
let pageNav = Array.from(document.querySelectorAll('.page-nav__day'));
pageNavDayWeek.forEach(function(el, index) {
  el.textContent = arrDayWeek[index][0];
  el.parentElement.querySelector('.page-nav__day-number').textContent = arrDayWeek[index][1];
  //Выделение цветом выходных дней:
  if((arrDayWeek[index][0] == "Вск" || arrDayWeek[index][0] == "Сб") && !(pageNav[index].classList.contains('page-nav__day_weekend'))) {
    pageNav[index].classList.add('page-nav__day_weekend');
  } else if(!(arrDayWeek[index][0] == "Вск" || arrDayWeek[index][0] == "Сб") && (pageNav[index].classList.contains('page-nav__day_weekend'))) {
    pageNav[index].classList.remove('page-nav__day_weekend');
  }
  //=========================================
  el.parentElement.addEventListener('click', function(ev) {
    ev.preventDefault();
    localStorage.setItem('time_tamp_day', index * 3600 * 24);
  });
});

//Загрузка контента index.html:
getServerValue("event=update").then(function(result) {
  indexContent(result);
  //Переключение между вкладками дней недели:
  pageNav.forEach(function(el) {
    el.addEventListener('click', function(ev) {
      ev.preventDefault();
      activNavElement(el);
      indexContent(result);
    });
  });
  //==========================================
});
//==========================================