exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);

    // Mercado Pago envia notificação de pagamento
    if (body.type === 'payment') {
      const paymentId = body.data?.id;

      // Consulta o pagamento na API do MP
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      });

      const payment = await response.json();

      console.log(`Pagamento ${paymentId} - Status: ${payment.status}`);

      // Aqui você pode salvar em banco de dados, enviar email, etc.
      // Por enquanto só registramos o log
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
