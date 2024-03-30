import React, { useContext, useState } from 'react';

import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import Checkout from './Checkout';
import emailjs from '@emailjs/browser';

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const cartCtx = useContext(CartContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem(item);
  };

  const orderHandler = () => {
    setIsCheckout(true);
  };

  const submitOrderHandler = async (userData) => {
    debugger; 
    setIsSubmitting(true);
  
    try {
      const response = await fetch('https://fooddelivery-b4a1b-default-rtdb.firebaseio.com/orders.json', {
        method: 'POST',
        body: JSON.stringify({
          user: userData,
          orderedItems: cartCtx.items,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch orders.');
      }
  
      const orderId = await response.json();
  
      const orderDetails = await getOrderDetails(orderId); 
  
      let totalPrice = orderDetails.orderedItems.reduce((acc, item) => {
        return acc + (item.price * item.amount);
      }, 0); 
  
      const formattedOrderItems = orderDetails.orderedItems.map(item => {
        return `- ${item.name} (${item.amount}) x $${item.price.toFixed(2)}\n`;
      });
  
      const orderItemsString = formattedOrderItems.join('');
      const templateParams = {
        to_email: orderDetails.user.Email,
        to_name: orderDetails.user.name,
        orders: orderDetails.orderedItems,
        subject: 'Order Confirmation',
        message: `Dear ${orderDetails.user.name},\n\nCongratulation! Your order has been successfully placed!\n\nYour order details:\n${orderItemsString}\nTotal amout to be paid: $${totalPrice.toFixed(2)}\n\nIt will be arriving in ${Math.floor(Math.random() * 10) + 20} mins.`,
      };
  
      const serviceId = 'service_m171dfw';
      const templateId = 'template_nlln0vc';
      const userId = 'fuZgQg5wPwD7BRxaJ';
  
      emailjs.send(serviceId, templateId, templateParams, userId)
        .then((response) => {
          console.log('Email sent successfully!', response);
        })
        .catch((error) => {
          console.error('Error in sending email: ', error);
        });
  
    } catch (error) {
      console.error('Error submitting order:', error);
    } 
    finally {
      setIsSubmitting(false);
      setDidSubmit(true);
      cartCtx.clearCart();
    }
  };
  
  async function getOrderDetails(orderId) {
    try {
      const response = await fetch(`https://fooddelivery-b4a1b-default-rtdb.firebaseio.com/orders/${orderId.name}.json`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch order details.');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  }


  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes['button--alt']} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && (
        <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />
      )}
      {!isCheckout && modalActions}
    </React.Fragment>
  );

  const isSubmittingModalContent = <p>Sending order data...</p>;

  const didSubmitModalContent = (
    <React.Fragment>
      <p>Successfully sent the order!</p>
      <div className={classes.actions}>
      <button className={classes.button} onClick={props.onClose}>
        Close
      </button>
    </div>
    </React.Fragment>
  );

  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;
