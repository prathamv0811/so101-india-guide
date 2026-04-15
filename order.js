document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orderForm');
    const payNowBtn = document.getElementById('payNowBtn');
    const payViaUpiBtn = document.getElementById('payViaUpiBtn');
    const orderMessage = document.getElementById('orderMessage');

    const armType = document.getElementById('armType');
    const quantity = document.getElementById('quantity');
    const finish = document.getElementById('finish');
    const shipping = document.getElementById('shipping');
    const paymentRefEl = document.getElementById('paymentRef');
    const paymentMethodEl = document.getElementById('paymentMethod');

    const basePriceEl = document.getElementById('basePrice');
    const finishPriceEl = document.getElementById('finishPrice');
    const shippingPriceEl = document.getElementById('shippingPrice');
    const summaryQtyEl = document.getElementById('summaryQty');
    const totalPriceEl = document.getElementById('totalPrice');

    const pricingByArm = {
        full: 3000,
        follower: 2200,
        leader: 2000
    };

    const finishPricing = {
        standard: 0,
        premium: 250
    };

    const shippingPricing = {
        delhivery: 150
    };

    // Replace this key with your own Razorpay Key ID before production use.
    const RAZORPAY_KEY_ID = window.RAZORPAY_KEY_ID || 'rzp_test_Sdfm6KYyhry4v1';
    const UPI_ID = 'prathamjainai@oksbi';
    let hasSuccessfulPayment = false;

    const formatINR = (amount) => {
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const getTotal = () => {
        const selectedArmPrice = pricingByArm[armType.value] || pricingByArm.full;
        const selectedFinishPrice = finishPricing[finish.value] || 0;
        const selectedShippingPrice = shippingPricing[shipping.value] || 0;
        const selectedQty = Math.max(1, Number(quantity.value) || 1);

        const base = selectedArmPrice * selectedQty;
        const finishCost = selectedFinishPrice * selectedQty;
        const shippingCost = selectedShippingPrice;
        const total = base + finishCost + shippingCost;

        return {
            base,
            finishCost,
            shippingCost,
            selectedQty,
            total
        };
    };

    const updateSummary = () => {
        const totals = getTotal();
        basePriceEl.textContent = formatINR(totals.base);
        finishPriceEl.textContent = formatINR(totals.finishCost);
        shippingPriceEl.textContent = formatINR(totals.shippingCost);
        summaryQtyEl.textContent = String(totals.selectedQty);
        totalPriceEl.textContent = formatINR(totals.total);
    };

    const buildUPILink = (amount, customerName) => {
        const payeeName = 'Pratham Jain';
        const transactionNote = `SO-101 print order for ${customerName || 'customer'}`;

        return `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(payeeName)}&am=${encodeURIComponent(
            amount
        )}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
    };

    const setError = (message) => {
        orderMessage.textContent = message;
        orderMessage.classList.add('error');
    };

    const setSuccess = (message) => {
        orderMessage.textContent = message;
        orderMessage.classList.remove('error');
    };

    const getCustomer = () => {
        return {
            name: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            contact: document.getElementById('phone').value.trim()
        };
    };

    const launchRazorpay = () => {
        if (typeof window.Razorpay !== 'function') {
            setError('Razorpay SDK failed to load. Please refresh and try again.');
            return;
        }

        if (RAZORPAY_KEY_ID === 'rzp_test_REPLACE_ME') {
            setError('Set your Razorpay Key ID in order.js before taking live payments.');
            return;
        }

        const customer = getCustomer();
        if (!customer.name || !customer.email || !customer.contact) {
            setError('Please fill name, email, and phone before payment.');
            return;
        }

        const totals = getTotal();
        const options = {
            key: RAZORPAY_KEY_ID,
            amount: totals.total * 100,
            currency: 'INR',
            name: 'SO-101 Print Service',
            description: `${armType.options[armType.selectedIndex].text} x${totals.selectedQty}`,
            prefill: customer,
            notes: {
                armType: armType.value,
                quantity: String(totals.selectedQty),
                finish: finish.value,
                shipping: shipping.value,
                color: 'orange'
            },
            theme: {
                color: '#c96442'
            },
            handler: function (response) {
                hasSuccessfulPayment = true;
                paymentRefEl.value = response.razorpay_payment_id || '';
                paymentMethodEl.value = 'razorpay';
                setSuccess('Payment successful. Your payment reference has been captured. Submit your order now.');
            },
            modal: {
                ondismiss: function () {
                    if (!hasSuccessfulPayment) {
                        setError('Payment was cancelled. Complete payment to submit your order.');
                    }
                }
            }
        };

        const checkout = new window.Razorpay(options);
        checkout.open();
    };

    [armType, quantity, finish, shipping].forEach((field) => {
        field.addEventListener('change', updateSummary);
        field.addEventListener('input', updateSummary);
    });

    payNowBtn.addEventListener('click', () => {
        launchRazorpay();
    });

    payViaUpiBtn.addEventListener('click', () => {
        const totals = getTotal();
        const customerName = document.getElementById('fullName').value.trim();
        const upiLink = buildUPILink(totals.total, customerName);

        hasSuccessfulPayment = false;
        paymentRefEl.value = '';
        paymentMethodEl.value = 'upi-manual';
        window.location.href = upiLink;

        setSuccess('UPI payment request opened. Enter your transaction ID below after payment, then submit order.');
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const paymentRef = paymentRefEl.value.trim();
        if (!paymentRef) {
            setError('Please complete payment first and ensure payment reference is available.');
            return;
        }

        if (paymentMethodEl.value === 'razorpay' && !hasSuccessfulPayment) {
            setError('Razorpay payment is not confirmed yet. Please pay again and submit after success.');
            return;
        }

        const totals = getTotal();
        const orderId = `SO101-${Date.now().toString().slice(-6)}`;

        setSuccess(`Payment received for ${formatINR(
            totals.total
        )}. Your order ${orderId} has been submitted successfully.`);

        form.reset();
        quantity.value = '1';
        hasSuccessfulPayment = false;
        paymentRefEl.value = '';
        paymentMethodEl.value = '';
        updateSummary();
    });

    updateSummary();
});
