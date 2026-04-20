const Stripe = require('stripe');

const PRODUCTS = {
  'Anti-Aging Night Cream': 4999,
  'Anti-Aging Day Cream': 4999,
  'Facial Cleanser': 3999,
  'Active Charcoal Cleanser': 4499,
  'Brightening Moisturizer': 4999,
  'Shea Hydration Cream': 4499,
  'Raspberry Seed Oil': 5999,
  'Vitamin C Serum': 5499,
  'Hyaluronic Acid Serum': 5499,
  'Retinol Serum': 5999,
  'Charcoal Body Scrub': 4999,
  'Honey Body Scrub': 4499,
  'Luxury Bubble Bath': 3499,
  'Hair Repair Mask': 4999,
  'Lip Trio': 3999,
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const { items } = JSON.parse(event.body);

    const line_items = items
      .filter(item => PRODUCTS[item.name])
      .map(item => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: PRODUCTS[item.name],
        },
        quantity: 1,
      }));

    if (line_items.length === 0) {
      return { statusCode: 400, body: 'No valid items' };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${event.headers.origin}/success.html`,
      cancel_url: `${event.headers.origin}/`,
      shipping_address_collection: { allowed_countries: ['US'] },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
