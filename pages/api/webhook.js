import { mongooseConnect } from '@/lib/mongoose';
import { Order } from '@/models/Order';
const stripe = new Stripe(process.env.STRIPE_SK);
import { buffer } from 'micro';

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  'whsec_70e71871df61b67e1fac0a775ebd8da360e03c7bbb3750a51992f8de580e5552';

export default async function handler(req, res) {
  await mongooseConnect();
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      await buffer(req),
      sig,
      endpointSecret
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const data = event.data.object;
      const orderId = data.metadata.orderId;
      const paid = data.payment_status === 'paid';
      if (orderId && paid) {
        await Order.findByIdAndUpdate(orderId, {
          paid: true,
        });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).send('ok');
}

export const config = {
  api: { bodyParser: false },
};



