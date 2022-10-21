const axios = require('axios');

const getOrders = async () => {
    let orders = [];
    let totalPages = Number.MAX_SAFE_INTEGER;
    const cookie = {
        "PHPSESSID": process.env.PHPSESSID,
        "cid": process.env.CID,
        "zat": process.env.ZAT,
    }
    let requestCookie = "";
    for (let i in cookie) {
        requestCookie += `${i}=${cookie[i]}; `;
    }

    const headers = {
        "accept": "*/*",
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
        "cookie": requestCookie
    }

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        const url = `https://www.zomato.com/webroutes/user/orders?page=${pageNumber}`
        const response = await axios.get(url, { headers, cookie });
        const data = response.data;
        if (pageNumber === 1) {
            totalPages = data.sections.SECTION_USER_ORDER_HISTORY.totalPages;
        }
        let currentOrders = Object.values(data.entities.ORDER);
        orders = [...orders, ...currentOrders];
    }
    return orders;
}

getOrders().then((orders) => {
    let totalAmount = orders.reduce((acc, order) => acc + parseFloat(order.totalCost.substring(1)), 0);
    console.log(`Total amount spent: ${totalAmount} on zomato ${orders.length} orders with average ${totalAmount / orders.length}`);
})
