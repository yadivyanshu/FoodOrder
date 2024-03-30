import { useRef, useState } from 'react';

import classes from './Checkout.module.css';

const isEmpty = (value) => value.trim() === '';
const isSixChars = (value) => value.trim().length === 6;
const isEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isTen = (value) => !isNaN(value) && value.trim().length === 10;

const Checkout = (props) => {
  const [formInputsValidity, setFormInputsValidity] = useState({
    name: true,
    street: true,
    city: true,
    postalCode: true,
    phoneNumber: true,
    Email: true
  });

  const nameInputRef = useRef();
  const streetInputRef = useRef();
  const postalCodeInputRef = useRef();
  const cityInputRef = useRef();
  const phoneInputRef = useRef();
  const mailInputRef = useRef();

  const confirmHandler = (event) => {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredStreet = streetInputRef.current.value;
    const enteredPostalCode = postalCodeInputRef.current.value;
    const enteredCity = cityInputRef.current.value;
    const enteredPhoneNumber = phoneInputRef.current.value;
    const enteredEmail = mailInputRef.current.value;

    const enteredNameIsValid = !isEmpty(enteredName);
    const enteredStreetIsValid = !isEmpty(enteredStreet);
    const enteredCityIsValid = !isEmpty(enteredCity);
    const enteredPostalCodeIsValid = isSixChars(enteredPostalCode);
    const enteredPhoneNumberIsValid = isTen(enteredPhoneNumber);
    const enteredEmailIsValid = isEmailPattern.test(enteredEmail);

    setFormInputsValidity({
      name: enteredNameIsValid,
      street: enteredStreetIsValid,
      city: enteredCityIsValid,
      postalCode: enteredPostalCodeIsValid,
      phoneNumber: enteredPhoneNumberIsValid,
      Email: enteredEmailIsValid
    });

    const formIsValid =
      enteredNameIsValid &&
      enteredStreetIsValid &&
      enteredCityIsValid &&
      enteredPostalCodeIsValid&&
      enteredPhoneNumberIsValid&&
      enteredEmailIsValid;

    if (!formIsValid) {
      return;
    }

    props.onConfirm({
      name: enteredName,
      street: enteredStreet,
      city: enteredCity,
      postalCode: enteredPostalCode,
      phoneNumber: enteredPhoneNumber,
      Email: enteredEmail
    });
  };

  const nameControlClasses = `${classes.control} ${
    formInputsValidity.name ? '' : classes.invalid
  }`;
  const streetControlClasses = `${classes.control} ${
    formInputsValidity.street ? '' : classes.invalid
  }`;
  const postalCodeControlClasses = `${classes.control} ${
    formInputsValidity.postalCode ? '' : classes.invalid
  }`;
  const cityControlClasses = `${classes.control} ${
    formInputsValidity.city ? '' : classes.invalid
  }`;
  const phoneControlClass = `${classes.control} ${
    formInputsValidity.phoneNumber ? '' : classes.invalid
  }`;
  const mailControlClass = `${classes.control} ${
    formInputsValidity.Email ? '' : classes.invalid
  }`;

  return (
    <form className={classes.form} onSubmit={confirmHandler}>
      <div className={nameControlClasses}>
        <label htmlFor='name'>Your Name</label>
        <input type='text' id='name' ref={nameInputRef} />
        {!formInputsValidity.name && <p>Please enter a valid name!</p>}
      </div>
      <div className={streetControlClasses}>
        <label htmlFor='street'>Street</label>
        <input type='text' id='street' ref={streetInputRef} />
        {!formInputsValidity.street && <p>Please enter a valid street!</p>}
      </div>
      <div className={postalCodeControlClasses}>
        <label htmlFor='postal'>Postal Code</label>
        <input type='text' id='postal' ref={postalCodeInputRef} />
        {!formInputsValidity.postalCode && (
          <p>Please enter a valid postal code (6 characters long)!</p>
        )}
      </div>
      <div className={cityControlClasses}>
        <label htmlFor='city'>City</label>
        <input type='text' id='city' ref={cityInputRef} />
        {!formInputsValidity.city && <p>Please enter a valid city!</p>}
      </div>
      <div className={phoneControlClass}>
        <label htmlFor='phone'>Phone no:</label>
        <input type='tel' id='phone' ref={phoneInputRef} />
        {!formInputsValidity.phoneNumber && <p>Please enter a valid phone number!</p>}
      </div>
      <div className={mailControlClass}>
        <label htmlFor='email'>Email</label>
        <input type='email' id='email' ref={mailInputRef} />
        {!formInputsValidity.Email && <p>Please enter a valid email!</p>}
      </div>
      <div className={classes.actions}>
        <button type='button' onClick={props.onCancel}>
          Cancel
        </button>
        <button className={classes.submit}>Confirm</button>
      </div>
    </form>
  );
};

export default Checkout;
