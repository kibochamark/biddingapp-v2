import React from 'react'
import {loadStripe} from "@stripe/stripe-js"
import {Elements} from "@stripe/react-stripe-js"


if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined){
    throw new Error("STRIPE PUBLIC KEY HAS NOT BEEN DEFINED")
}

const stripePromise= loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

const StripeUI = () => {
  return (
    <div>
        <Elements
        stripe={stripePromise}
        options={{
            mode:"payment",
            amount:49.99,
            currency:"usd"
        }}


        >
                49.99            
        </Elements>
        
    </div>
  )
}

export default StripeUI