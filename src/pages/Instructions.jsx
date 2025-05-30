import React from "react";

const Instructions = () => {
    return (
        <div className="container mt-5">
            <h2>📘 Протокол взаимодействия с игрой</h2>

            <section className="mt-4">
                <h4>Подключение по WebSocket</h4>
                <p>
                    Подключитесь к серверу, подставив ваш <code>game_id</code> и токен:
                </p>
                <pre>
          <code>{`wss://course.af.shvarev.com/ws/{game_id}?token={token}`}</code>
        </pre>
            </section>

            <section className="mt-4">
                <h4>Запуск игры</h4>
                <p>После подключения хост отправляет команду старта:</p>
                <pre>
          <code>{`{"event":"start_game"}`}</code>
        </pre>
            </section>

            <section className="mt-4">
                <h4>Получение начального состояния (<code>init_state</code>)</h4>
                <p>Сервер пришлёт объект с полем <code>event</code>:</p>
                <pre>
          <code>
{`{
  "event": "init_state",
  "tick": 0,
  "width": <number>,
  "height": <number>,
  "grid": [ /* массив строк "WALL", "EMPTY", "DESTRUCTIBLE" */ ],
  "players": {
    "<id1>": { "x": <number>, "y": <number>, "alive": true },
    "<id2>": { /* вторая ячейка */ }
  },
  "bombs": [ /* массив бомб */ ],
  "fire": [ /* массив огненных эффектов */ ]
}`}
          </code>
        </pre>
            </section>

            <section className="mt-4">
                <h4>ID игрока</h4>
                <p>
                    Ключи в объекте <code>players</code> — это идентификаторы игроков. Ваш
                    <strong> player_id </strong> нужно использовать при отправке действий.
                </p>
                <pre>
          <code>
{`"players": {
  "0": { ... },  // игрок с id = 0
  "1": { ... }   // игрок с id = 1
}`}
          </code>
        </pre>
            </section>

            <section className="mt-4">
                <h4>Обновления по тикам</h4>
                <p>После старта, на каждый тик приходит обновлённое состояние без поля <code>event</code>:</p>
                <pre>
          <code>
{`{
  "tick": <number>,
  "width": <number>,
  "height": <number>,
  "grid": [ /* текущее поле */ ],
  "players": { /* текущие позиции */ },
  "bombs": [ /* текущие бомбы */ ],
  "fire": [ /* текущие огни */ ]
}`}
          </code>
        </pre>
            </section>

            <section className="mt-4">
                <h4>Отправка действий</h4>
                <p>
                    Чтобы совершить ход, отправьте сообщение с вашим <code>player_id</code> и
                    действием:
                </p>
                <pre>
          <code>{`{"player_id": "<ваш_id>", "action": "UP"}`}</code>
        </pre>
                <p>Допустимые значения <code>action</code>:</p>
                <ul>
                    <li><code>UP</code></li>
                    <li><code>DOWN</code></li>
                    <li><code>LEFT</code></li>
                    <li><code>RIGHT</code></li>
                    <li><code>STAY</code></li>
                    <li><code>BOMB</code></li>
                </ul>
            </section>
        </div>
    );
};

export default Instructions;
