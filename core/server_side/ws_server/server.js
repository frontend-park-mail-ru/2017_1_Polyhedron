

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


    let counter = 0;

    setInterval(() => {
        let pi = 0;
        let ei = Math.round(Math.random() * 2 + 1);
        let offset = Math.random() * 10 - 5;

        /*
        let enemyMoveMessage = {
            type: "EnemyPositionCorrectionEvent",
            data: {
                playerIndex: pi,
                enemyIndex: ei,
                offset: offset,
            }
        };

        ws.send(JSON.stringify(enemyMoveMessage));
        */

        counter += 1;
        console.log(counter);

        if (counter % 10 === 0) {
            //ws.send(getBallCorrection());
            //console.log("Sent ball correction")
        }

        if (counter % 1 === 0) {
            ws.send(getTotalUpdate());
            console.log("Sent total update");
        }

        if (counter === 100) {
            //ws.send(getDefeatMessage());
            //console.log("Lose")
        }
    }, 1000);

    let getBallCorrection = () => {
        const getCoord = () => Math.random() * 100 + 100;

        return JSON.stringify({
            type: "BallPositionCorrectionEvent",
            data: [getCoord(), getCoord()]
        });
    };

    let getTotalUpdate = () => {
        let message = {data: {}};
        message.type = 'WorldUpdateEvent';
        message.data = {
            playerIndex: 1,

            platformsUpdate: [
                {
                    index: 0,
                    position: [10, 0]
                },
                {
                    index: 1,
                    position: [10, 0]
                },
                {
                    index: 2,
                    position: [10, 0]
                },
                {
                    index: 3,
                    position: [10, 0]
                }
            ],

            ballUpdate: {
                position: [100, 150],
                //velocity: [100, 100]
            }
        };
        return JSON.stringify(message);
    };

    let getDefeatMessage = () => {
        return JSON.stringify({
            type: "DefeatEvent",
            data: {
                playerIndex: 0,
                looserIndex: Math.round(Math.random() * 4),
            }
        });
    };
});
