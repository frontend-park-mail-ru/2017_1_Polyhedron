

const ws = require('ws');

const server = new ws.Server({
    port: 8081
});

server.on('connection', function(ws) {
    console.log("Connection established");

    ws.on('message', function(message) {
        console.log('получено сообщение ' + message);
    });

    ws.on('close', function() {
        console.log('соединение закрыто ');
    });

    let defeatMessage = {
        type: "DefeatEvent",
        data: {
            playerIndex: 0,
            looserIndex: Math.round(Math.random() * 4),
        }
    };

    let counter = 0;

    setInterval(() => {
        let pi = 0;
        let ei = Math.round(Math.random() * 2 + 1);
        let offset = Math.random() * 10 - 5;

        let enemyMoveMessage = {
            type: "EnemyPositionCorrectionEvent",
            data: {
                playerIndex: pi,
                enemyIndex: ei,
                offset: offset,
            }
        };

        ws.send(JSON.stringify(enemyMoveMessage));

        counter += 1;
        console.log(counter);

        if (counter % 10 === 0) {
            const getCoord = () => Math.random() * 100 + 100;

            let ballCorrectionMessage = {
                type: "BallPositionCorrectionEvent",
                data: [getCoord(), getCoord()]
            };
            ws.send(JSON.stringify(ballCorrectionMessage));
            console.log("Sent ball correction")
        }

        if (counter === 100) {
            ws.send(JSON.stringify(defeatMessage));
            console.log("Lose")
        }
    }, 100);
});
