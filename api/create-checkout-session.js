import Stripe from 'stripe';


// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export default async function handler(req, res) {
if (req.method !== 'POST') {
return res.status(405).json({ error: 'Method not allowed' });
}


try {
const { items } = req.body;


if (!items || items.length === 0) {
return res.status(400).json({ error: 'Cart is empty' });
}


const lineItems = items.map(item => ({
price_data: {
currency: 'usd',
product_data: {
name: item.name,
},
unit_amount: Math.round(item.price * 100),
},
quantity: 1,
}));


const session = await stripe.checkout.sessions.create({
payment_method_types: ['card'],
mode: 'payment',
line_items: lineItems,
success_url: `${req.headers.origin}/success.html`,
cancel_url: `${req.headers.origin}/cancel.html`,
});


res.status(200).json({ url: session.url });
} catch (error) {
console.error(error);
res.status(500).json({ error: 'Checkout session failed' });
}
}
