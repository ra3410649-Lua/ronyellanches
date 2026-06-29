exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { total, nome, email } = JSON.parse(event.body);

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'X-Idempotency-Key': `ronyel-${Date.now()}`
      },
      body: JSON.stringify({
        transaction_amount: total,
        description: 'Pedido Ronyel Lanches & Café',
        payment_method_id: 'pix',
        payer: {
          email: email || 'cliente@ronyel.com.br',
          first_name: nome
        }
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        id: data.id,
        status: data.status,
        qr_code: data.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: data.point_of_interaction?.transaction_data?.qr_code_base64
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
