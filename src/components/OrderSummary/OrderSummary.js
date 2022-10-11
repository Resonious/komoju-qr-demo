import React, { useState } from 'react';
import { Link, navigate } from 'gatsby';

import Button from '../Button';
import FormInputField from '../FormInputField/FormInputField';
import CurrencyFormatter from '../CurrencyFormatter';

import * as styles from './OrderSummary.module.css';

const OrderSummary = ({ sampleProduct }) => {
  const [coupon, setCoupon] = useState('');
  const [giftCard, setGiftCard] = useState('');

  const [qrCode, setQrCode] = useState('/empty-qr.svg');
  const [sessionUUID, setSessionUUID] = useState(null);

  React.useEffect(() => {
    // Make QR code to instant-buy this product.
    fetch('/.netlify/functions/create-session', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        line_items: [{
          amount: sampleProduct.price * 100,
          description: `${sampleProduct.name} (${sampleProduct.size})`,
          quantity: qty >= 1 ? qtr : 1,
          image: `${SITE_URL}${sampleProduct.image}`,
        }]
      })
    })
      .then(r => r.json())
      .then(resp => {
        if (!resp.session_url) {
          console.error(resp)
          return
        }
        setQrCode(`${resp.session_url}/qr.svg`)
        setSessionUUID(resp.id);
      })
  }, [sampleProduct]);

  React.useEffect(() => {
    // Poll for updates
    if (!sessionUUID) return;

    const interval = setInterval(() => {
      fetch(`/.netlify/functions/check-session?session=${sessionUUID}`)
        .then(r => r.json())
        .then(resp => {
          if (!resp.status) {
            console.error(resp);
            return;
          }
          if (resp.status !== 'completed') {
            return;
          }
          location.href = '/orderConfirm';
        });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [sessionUUID]);

  return (
    <div className={styles.root}>
      <div className={styles.orderSummary}>
        <span className={styles.title}>order summary</span>
        <div className={styles.calculationContainer}>
          <div className={styles.labelContainer}>
            <span>Subtotal</span>
            <span>
              <CurrencyFormatter amount={220} appendZero />
            </span>
          </div>
          <div className={styles.labelContainer}>
            <span>Shipping</span>
            <span>---</span>
          </div>
          <div className={styles.labelContainer}>
            <span>Tax</span>
            <span>
              <CurrencyFormatter amount={0} appendZero />
            </span>
          </div>
        </div>
        <div className={styles.couponContainer}>
          <span>Coupon Code</span>
          <FormInputField
            value={coupon}
            handleChange={(_, coupon) => setCoupon(coupon)}
            id={'couponInput'}
            icon={'arrow'}
          />
          <span>Gift Card</span>
          <FormInputField
            value={giftCard}
            handleChange={(_, giftCard) => setGiftCard(giftCard)}
            id={'couponInput'}
            icon={'arrow'}
          />
        </div>
        <div className={styles.totalContainer}>
          <span>Total: </span>
          <span>
            <CurrencyFormatter amount={220} appendZero />
          </span>
        </div>
        <div>
          <img src={qrCode} />
        </div>
      </div>
      <div className={styles.actionContainer}>
        <Button
          onClick={() => navigate('/orderConfirm')}
          fullWidth
          level={'primary'}
        >
          checkout
        </Button>
        <div className={styles.linkContainer}>
          <Link to={'/shop'}>CONTINUE SHOPPING</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
