'use strict';

// Импортируем модули, отвечающие за работу с http и с файловой системой
const http = require('http');
const fs = require('fs');

// Создаём фукнцию-обработчик запросов
const worker = function (request, response) {
	// Выводим лог
	console.log(`${request.method} ${request.url}`);
	const url = request.url;

	// Определяем, какой из файлов мы будем использовать
	let content;
	if (url === '/') {
		content = fs.readFileSync('./static/index.html', 'utf8');
	} else {
		content = fs.readFileSync('./static/hello.html', 'utf8');
	}

	// Записываем заголовок в ответ
	response.writeHead(200, {"Content-Type": "text/html"});

	// Данные в ответ
	response.write(content);
	response.end();
	console.log('complete');
};

// Создаём сервер
const server = http.createServer(worker);

// Определяем, соединения на каком порту будет обрабатывать сервер
const port = process.env.PORT || 3000;
console.log(`Сервер запущен! Порт ${port}`);

// Запускаем сервер
server.listen(port);
