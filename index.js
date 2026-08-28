const express = require('express');
const app = express();
app.get('/', (req,res)=> res.send('B-BOY WONDER IS ONLINE 🔥'));
app.listen(process.env.PORT || 3000, ()=> console.log('PORT OPEN'));

const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const P = require('pino')

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info')
  const sock = makeWASocket({ logger: P({ level: 'silent' }), auth: state, printQRInTerminal: true })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', (u)=> {
    const { connection, lastDisconnect } = u
    if(connection === 'close') startBot()
    if(connection === 'open') console.log('BOT CONNECTED!')
  })
  sock.ev.on('messages.upsert', async m => {
    const msg = m.messages[0]; if(!msg.message) return
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text
    const from = msg.key.remoteJid
    if(text === '.ping') await sock.sendMessage(from, { text: 'Pong! B-BOY WONDER ONLINE 🏀' })
    if(text === '.menu') await sock.sendMessage(from, { text: 'Commands:.ping.menu' })
  })
}
startBot()
