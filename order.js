document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orderForm');
    const orderMessage = document.getElementById('orderMessage');

    const armType = document.getElementById('armType');
    const quantity = document.getElementById('quantity');
    const finish = document.getElementById('finish');
    const shipping = document.getElementById('shipping');

    const pricingByArm = {
        full: 3000,
        follower: 2000,
        leader: 2000
    };

    const finishPricing = {
        standard: 0,
        premium: 250
    };

    const shippingPricing = {
        delhivery: 150
    };

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
            total,
            armTypeLabel: armType.options[armType.selectedIndex].text
        };
    };

    const buildTwitterMessage = () => {
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const armTypeLabel = armType.options[armType.selectedIndex].text;
        const qty = quantity.value;
        const finishLabel = finish.options[finish.selectedIndex].text;
        const notes = document.getElementById('notes').value.trim();
        const totals = getTotal();

        const message = `Hi Pratham! 👋\n\nI'd like to order SO-101 prints:\n\n📋 **Order Details:**\n• Print Type: ${armTypeLabel}\n• Quantity: ${qty}\n• Finish: ${finishLabel}\n• Color: Orange\n• Shipping: Delhivery Standard (+₹150)\n• Total Amount: ${formatINR(totals.total)}\n\n👤 **Customer Info:**\n• Name: ${fullName}\n• Email: ${email}\n• Phone: ${phone}\n• Address: ${address}\n\n${notes ? `📝 Notes: ${notes}` : ''}\n\nPlease confirm this order and send payment details. Thanks!`;

        return message;
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();

        if (!fullName || !email || !phone || !address) {
            orderMessage.textContent = 'Please fill all required fields before submitting.';
            orderMessage.classList.add('error');
            return;
        }

        const message = buildTwitterMessage();
        const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(message)}`;
        
        window.open(twitterUrl, '_blank', 'width=550,height=420');

        orderMessage.textContent = 'Order details ready! You can also DM directly: https://x.com/messages/compose?recipient_id=PrathamJainAI';
        orderMessage.classList.remove('error');

        form.reset();
    });
});
