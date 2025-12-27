import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { PRICING_PLANS } from '@/lib/pricing';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { plan } = await req.json();

    const planConfig = PRICING_PLANS[plan as keyof typeof PRICING_PLANS];
    if (!planConfig || !planConfig.stripePriceId) {
       return new NextResponse('Invalid plan', { status: 400 });
    }

    // Get user from DB to check for stripeCustomerId
    const user = await db.query.users.findFirst({
      where: eq(users.id, Number(session.userId)),
    });

    if (!user) {
        return new NextResponse('User not found', { status: 404 });
    }

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id.toString(),
        },
      });
      stripeCustomerId = customer.id;
      
      await db.update(users)
        .set({ stripeCustomerId })
        .where(eq(users.id, user.id));
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const sessionParams = {
      line_items: [
        {
          price: planConfig.stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription' as const,
      success_url: `${origin}?success=true`,
      cancel_url: `${origin}?canceled=true`,
      metadata: {
        userId: user.id.toString(),
        plan: plan,
      },
    };

    let checkoutSession;

    try {
      checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        ...sessionParams,
      });
    } catch (error: unknown) {
      // Handle currency mismatch error by creating a new customer
      const errorMessage = error instanceof Error ? error.message : (error as { message?: string })?.message;

      if (errorMessage?.includes('You cannot combine currencies on a single customer')) {
        console.log('[STRIPE_CHECKOUT] Currency mismatch detected. Creating new customer...');
        
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id.toString(),
          },
        });
        stripeCustomerId = customer.id;
        
        await db.update(users)
          .set({ stripeCustomerId })
          .where(eq(users.id, user.id));

        checkoutSession = await stripe.checkout.sessions.create({
          customer: stripeCustomerId,
          ...sessionParams,
        });
      } else {
        throw error;
      }
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('[STRIPE_CHECKOUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
