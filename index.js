'use strict';

const express    = require('express');
const bodyParser = require('body-parser');
const request    = require('request');
const app        = express();

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json())

app.get('/', function (req, res) 
{
	res.send('Hello PlatziBot!')
})

app.get('/webhook', function (req, res) 
{
    if (req.query['hub.verify_token'] === 'android_msg_says_hello') 
	{
        res.send(req.query['hub.challenge']);
    } 
	else 
	{
        res.send('android_bot_says_bye');
    }
});

/*
Comunicacion con la api de facebook
Conexion entre webhook y la api de facebook 

Token android_msg_says_hello
*/


app.post('/webhook', function (req, res) 
{
    const data = req.body;
	
    if (data.object == 'page') 
	{
        data.entry.forEach(function (pageEntry) 
		{
            pageEntry.messaging.forEach(function (messagingEvent) 
			{
                receiveMessage(messagingEvent);
            });
        });
        res.sendStatus(200); 
    }
});

/*
Recibir los mensajes desde Facebook Messenger

Recibe los mensajes e itera por cada elemento del objeto recibido
*/


const receiveMessage = (event) => 
{
	const senderId    = event.sender.id; // Id único del usuario
	const messageText = event.message.text; // Mensaje que nos envió
	const messageData = 
	{
		recipient : 
		{
			id : senderId
		},
		message: 
		{
			text: messageText
		}
	};
	
	sendMessage(messageData);  
}

/*
Funcion recibir mensajes. se encarga de extraer la informacion del usuario y crear un mensajes
que repita lo que nos escribe
*/