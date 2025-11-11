
import express from 'express';
import type { Request, Response } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2025-10-29.clover" });
const app = express();
const PORT = process.env.PORT || 4242;

app.use(cors());
app.use(express.json());

// Retorna publishable key (útil para o cliente)
app.get('/stripe-publishable-key', (req: Request, res: Response) => {
  const key = process.env.STRIPE_PUBLISHABLE_KEY || null;
  if (!key) return res.status(500).json({ error: 'Publishable key not configured.' });
  res.json({ publishableKey: key });
});

/**
 * Cria um PaymentIntent e retorna clientSecret.
 * Body: { amountBRL: number, metadata?: Record<string,string> }
 */
app.post('/create-payment-intent', async (req: Request, res: Response) => {
  try {
    const { amountBRL, metadata } = req.body;
    if (!amountBRL || isNaN(Number(amountBRL))) {
      return res.status(400).json({ error: 'amountBRL is required (number).' });
    }

    const amount = Math.round(Number(amountBRL) * 100); // centavos

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'brl',
      payment_method_types: ['card'],
      metadata: metadata || {},
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error('create-payment-intent error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Webhook endpoint (opcional, mas recomendado).
 * Use stripe-cli `stripe listen --forward-to localhost:4242/webhook` em dev para obter STRIPE_WEBHOOK_SECRET.
 */
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req: any, res: Response) => {
  const sig = req.headers['stripe-signature'] as string | undefined;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (endpointSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      event = req.body; // warning: only for dev without verification
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err?.message);
    return res.status(400).send(`Webhook Error: ${err?.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent succeeded:', pi.id, pi.amount, pi.metadata);
      // TODO: atualizar DB: marcar pagamento/solicitação como pago usando pi.metadata
      break;
    }
    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.warn('Payment failed:', pi.last_payment_error?.message);
      break;
    }
    default:
      console.log('Unhandled event type', event.type);
  }

  res.json({ received: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
