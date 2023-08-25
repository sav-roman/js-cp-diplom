//Функция отправляющая запросы на сервер, bodyValue - тело запроса
async function getServerValue(bodyValue) {
    const result = await fetch("https://jscp-diplom.netoserver.ru/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyValue,
    });
    const response = await result.json();
    return response;
  }
//================================================================