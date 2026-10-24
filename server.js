require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "angola_ai_sales_2026_secure_token";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || "1405396812655340";
const PORT = process.env.PORT || 10000;

app.get('/webhook/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log("WEBHOOK VERIFICADO!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook/whatsapp', async (req, res) => {
  try {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (message) {
      const from = message.from;
      const text = message.text?.body || "";
      let resposta = `Olá! 👋 Bem-vindo à Angola AI 🇦🇴\n\nRecebi: "${text}"\n\nSou teu assistente 24h. Como posso ajudar?\n1️⃣ Ver produtos\n2️⃣ Preços\n3️⃣ Suporte`;
      if (text.toLowerCase().includes("preço") || text.toLowerCase().includes("preco")) {
        resposta = `Planos a partir de 5.000 Kz/mês 💰 Qual teu negócio?`;
      }
      const url = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;
      await axios.post(url, {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: { body: resposta }
      }, {
        headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' }
      });
    }
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

app.get('/', (req, res) => res.send("Angola AI Sales Agent ONLINE 🚀"));
app.listen(PORT, () => console.log(`Rodando na ${PORT}`));
