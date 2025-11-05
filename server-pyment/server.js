const express = require('express');
const cors = require('cors');
// ¡AQUÍ VA TU CLAVE SECRETA! Cárgala desde variables de entorno en un proyecto real.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // <--- ¡PON TU CLAVE sk_test_... AQUÍ!
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.post('/create-payment', async (req, res) => {
  // Recibimos los mismos datos de siempre
  const { paymentMethodId, amount } = req.body;

  try {
    // --- ¡AQUÍ ESTÁ LA NUEVA LÓGICA! ---
    // 1. Obtenemos los detalles del PaymentMethod usando su ID
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    // 2. Extraemos el nombre del cliente de forma segura desde los billing_details
    const customerName = paymentMethod.billing_details.name;

    // 3. Ahora creamos el PaymentIntent como antes
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'chf',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });
    
    // 4. Mostramos el nombre en la consola para confirmar
    console.log(`¡Pago exitoso de ${customerName || 'Cliente Anónimo'} por ${paymentIntent.amount / 100} ${paymentIntent.currency}!`);

    res.status(200).json({ success: true, paymentIntentId: paymentIntent.id });

  } catch (error) {
    console.error("Error de Stripe:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));