import express from 'express';
import http from 'http';
import WebSocket  from 'ws';

const port = 6969;

const server = http.createServer(express);
const wss = new WebSocket.Server({ server })

const room = new Map<string, WebSocket[]>()

room.set("zone1", [])
room.set("zone2", [])
room.set("zone3", [])

wss.on('connection', function connection(ws) {
    console.log('Client connected');
    ws.on('error', function error(err) {
        console.error('WebSocket error:', err);
    })

    ws.on('message', function message(data) {
        console.log('received: %s', data);
        const parsedData = JSON.parse(data.toString());
        const { zone, message } = parsedData;
        if (!zone) return;
        if (room.has(zone)) {
            if (!room.get(zone)?.includes(ws)) {
                room.forEach((clients, existingZone) => {
                    const index = clients.indexOf(ws);
                    if (index !== -1) {
                        clients.splice(index, 1);
                        console.log('Client changed zone from: ', existingZone);
                    }
                });
                room.set(zone, [...room.get(zone)!, ws])
                console.log("Client added to zone: ", zone);
            }

            room.get(zone)?.forEach(client => {
                client.send(JSON.stringify(parsedData))
                //ajouter a mongoDB si j'ai le temps
            })
        }


    })

    ws.on('close', function close() {
        console.log('Client disconnected');
        room.forEach((clients, zone) => {
            const index = clients.indexOf(ws);
            if (index !== -1) {
                clients.splice(index, 1);
            }
        });

    })
})


server.listen(port, function() {
    console.log(`Server is listening on ${port}!`)
})