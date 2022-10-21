const axios = require('axios');
const fs = require('fs')

let orders = [];
let lastOrderId = '';

async function getOrders() {

    const cookie = {
        "_session_tid": process.env.SESSION_TID
    }
    let requestCookie = "";
    for (let i in cookie) {
        requestCookie += `${i}=${cookie[i]}; `;
    }

    const headers = {
        "cookie": requestCookie,
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
    }
    while (1) {
        const url = `https://www.swiggy.com/dapi/order/all?order_id=${lastOrderId}`;
        const response = await axios.get(url, { headers })
        if (response.data.data) {
            console.log(`Got ${response.data.data.orders.length} orders with ${lastOrderId}`);
        }
        else {
            console.log(`Got 0 orders`, response.data);
        }
        if (response.data.data && response.data.data.orders.length > 0) {
            orders = orders.concat(response.data.data.orders);
            lastOrderId = response.data.data.orders[response.data.data.orders.length - 1].order_id;
        } else {
            return;
        }
    }
}

async function main() {
    await getOrders().catch(console.error);
    let totalAmount = orders.reduce((acc, curr) => acc + (curr.order_total_with_tip || curr.order_total), 0);
    console.log(`Total spent on Swiggy : ${totalAmount} for ${orders.length} orders with avg of ${totalAmount / orders.length}`);
}

main()