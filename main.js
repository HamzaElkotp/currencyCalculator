//################################################## Variables setup

// currency choose
let currency1 = document.getElementById("currency1");
let currency2 = document.getElementById("currency2");
let currency3 = document.getElementById("currency3");
let currency4 = document.getElementById("currency4");
let currency5 = document.getElementById("currency5");

let bestCurrency1 = document.getElementById("bestCurrency1");
let bestCurrency2 = document.getElementById("bestCurrency2");
bestCurrency1.addEventListener('change',()=>{
    bestCurrecies.first = bestCurrency1.value;
    window.localStorage.besturrencies = JSON.stringify(bestCurrecies);
})
bestCurrency2.addEventListener('change',()=>{
    bestCurrecies.second = bestCurrency2.value;
    window.localStorage.besturrencies = JSON.stringify(bestCurrecies);
})

let curnciesChoose = {
    "currency1": currency1,
    "currency2": currency2,
    "currency3": currency3,
    "currency4": currency4,
    "currency5": currency5,
    "bestCurrency1": bestCurrency1,
    "bestCurrency2": bestCurrency2
}

let menutn = document.getElementById("menutn");
menutn.addEventListener('click',()=>{
    menutn.classList.toggle('active')
});

// number of currency
let curry1Input = document.getElementById("curry1");
let curry2Input = document.getElementById("curry2");
let exchangesBox = document.querySelector(".exchanges");

// Dates
let startDate = document.getElementById("startDate");
let endDate = document.getElementById("endDate");
let ndstartDate = document.getElementById("ndstartDate");
let ndendDate = document.getElementById("ndendDate");

// Fetch 
let fetchPriceB = document.getElementById("cFetch");
let fetchDateB = document.getElementById("dFetch");
let fetchGraph = document.getElementById("gFetch");

// Notifications
let notiBox = document.querySelector(".notification");

let currencyEqualMsg = ["Hey hey heeey! what are you trying to do",
"Oh, kidding? what are you doing😤", "You wanna us go bankrupt? making useless requests👨‍💻",
"You think you're funny? change currencies!", "Are you proud of yourself now?!😑", "Oh boy, play in other place👋",
"I'll forgive you this time, don't do it again!👊", "ummmm, you forget to choose 2 different currencies right?",
"I'll call police👮, must 2 different currencies!"]

let failMsg = ["Noooooo an Error!!!", "Sorry for this error, maybe our programmer is stupid😑", 
"Don't worry, an error will be fixed😴", "I think you're the reason of this error🤬", "Super Cat😼"]

let wrongDate = [`You're a sane man/woman, I think u know wat wrong thing u did.<br>Don't repeat it again😼`,
"You are a sane man/woman, I think you know that this is wrong.<br>This is last the time!💀",
"Ummm, mussed something🤔", "Wake up my brother", "you entered something wrong"]

//################################################## Main Used functions
// Fail function notification massage
function sendNotification(msg,type){
    if(!notiBox.classList.contains(`${type}`)){
        notiBox.textContent = msg;
        notiBox.classList.add("active",`${type}`);
        setTimeout(() => {
            notiBox.classList.remove("active",`${type}`);
            notiBox.textContent = ""
        }, 9500);
    }
}

function randomMsg(arr){
    let index = Math.round(Math.random()*arr.length - 1);
    return arr[index]
}

// API Fetcher function
function apiFetcher(APIurl,fun){
    async function fetchAPI(apiURL){
        const response = await fetch(apiURL);
        if(!response.ok || response.status == 401){
            sendNotification(`Oh no, ${{...await response.json()}.message}`, "fail")
        }
        return await response.json()
    }
    fetchAPI(APIurl) 
    .then((response)=>{
        if(response != undefined){
            // do recived response function 
            fun(response.data)
        }
    })
}

// Calc yesterday Date
function currentDate(e){
    let date = new Date;
    let currentDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,0)}-${String(date.getDate() - 1).padStart(2,0)}`;
    e.max = currentDate
}


//################################################## Start fetching
// fetch currencies name
async function loadCurrency(){
    apiFetcher("https://api.freecurrencyapi.com/v1/currencies?apikey=BDrJHUXThrkZIkVyUOFxkoU4zmCIO5rYc7T8ybYP", pushCurrencies);
} 

function pushCurrencies(response){
    response.ILS.name = "Palestinian New Sheqel";
    response.ILS.name_plural = "Palestinian New Sheqel";

    for(curncy in response){
        for(i in curnciesChoose){
            let option = document.createElement("option");
            option.value = response[curncy].code;
            option.textContent = `${response[curncy].code} | ${response[curncy].symbol} | ${response[curncy].name}`;
            curnciesChoose[i].append(option)
        }
    };
    bestLocal()
}

const bestCurrecies = window.localStorage.besturrencies ? JSON.parse(window.localStorage.besturrencies) : JSON.parse(window.localStorage.besturrencies = JSON.stringify({
    'first': 'EUR',
    'second': 'USD'
}));

function bestLocal(){
    let allvalues = Array(...currency1.options);
    allvalues.forEach((ele,inx)=>{
        allvalues[inx] = ele.value
    })
    
    curnciesChoose['currency1'].options[allvalues.indexOf(bestCurrecies['first'])].selected = 'selected';
    curnciesChoose['currency2'].options[allvalues.indexOf(bestCurrecies['second'])].selected = 'selected';
    curnciesChoose['currency3'].options[allvalues.indexOf(bestCurrecies['first'])].selected = 'selected';
    curnciesChoose['currency4'].options[allvalues.indexOf(bestCurrecies['first'])].selected = 'selected';
    curnciesChoose['currency5'].options[allvalues.indexOf(bestCurrecies['second'])].selected = 'selected';
    curnciesChoose['bestCurrency1'].options[allvalues.indexOf(bestCurrecies['first'])].selected = 'selected';
    curnciesChoose['bestCurrency2'].options[allvalues.indexOf(bestCurrecies['second'])].selected = 'selected';
}


// Fetching currenies price
let prices;
const priceRates = function(){
    apiFetcher("https://api.freecurrencyapi.com/v1/latest?apikey=BDrJHUXThrkZIkVyUOFxkoU4zmCIO5rYc7T8ybYP",(response)=>{
        prices = response
    })
}
priceRates();

// update prices every 30min
setInterval(()=>{
    priceRates()
},1800000)


// claculating how much every currency equal to other currencies
let dollarFactor;
let equation;
fetchPriceB.onclick = function(){
    try{
        // becuse we can't change currency directly from API, so make this calc
        dollarFactor = 1 / +prices[currency1.value]; // now converted to dollar
        equation = +prices[currency2.value];
    }catch(err){
        sendNotification(randomMsg(failMsg),"fail");
        return
    }

    let res = equation * dollarFactor; // how much the firts currency equal the second currenc
    curry1Input.value = 1;
    curry2Input.value = res.toFixed(2);

    if(currency1.value == currency2.value){
        sendNotification(randomMsg(currencyEqualMsg),"warn");
        return
    }
        
    curry1Input.nextElementSibling.textContent = currency1.value;
    curry2Input.nextElementSibling.textContent = currency2.value;
    
    document.querySelector(".resultBox").style.display = "flex"
}

// calc by sellecting amount of currency
curry1Input.addEventListener('change',()=>{
    curry2Input.value = (+curry1Input.value * dollarFactor * equation).toFixed(2)
})
curry2Input.addEventListener('change',()=>{
    curry1Input.value = (+curry2Input.value / (dollarFactor * equation)).toFixed(2)
})


// fetch exchange rate history
const exchangeRates = function(currN, sDate, EDate, fn, currT){
    let url = `https://api.freecurrencyapi.com/v1/historical?apikey=BDrJHUXThrkZIkVyUOFxkoU4zmCIO5rYc7T8ybYP&currencies=${currT}&base_currency=${currN}&date_from=${sDate}&date_to=${EDate}`;
    apiFetcher(url,fn)
}

fetchDateB.onclick = function(){
    let currencyN = currency3.value;
    let stdate = startDate.value;
    let endate = endDate.value;

    if(stdate > endate){
        sendNotification(randomMsg(wrongDate),"warn");
        return
    }

    exchangeRates(currencyN, stdate, endate, addHistory, "");    
} 

// adding exchange rate history to html
function addHistory(data){
    exchangesBox.innerHTML = "";
    for (date in data){
        let exchangeCard = document.createElement("div");
        exchangeCard.classList.add("column", "exchangeCard")

        let title = document.createElement("h3");
        title.textContent = date;

        exchangeCard.append(title);
        for(crnc in data[date]){
            let crrncyP = document.createElement("p");

            let crrncyN = document.createElement("span");
            crrncyN.textContent = crnc;
            crrncyP.append(crrncyN);

            let crrncyprice = document.createElement("span");
            crrncyprice.textContent = (data[date][crnc]).toFixed(2);
            crrncyP.append(crrncyprice);

            exchangeCard.append(crrncyP)
        }
        exchangesBox.append(exchangeCard)
    }
}


fetchGraph.onclick = function(){
    let fCurrency = currency4.value;
    let tCurrency = currency5.value;

    if(fCurrency == tCurrency){
        sendNotification(randomMsg(currencyEqualMsg),"warn");
        return
    }

    let fDate = ndstartDate.value;
    let tDate = ndendDate.value;

    if(fDate > tDate){
        sendNotification(randomMsg(wrongDate),"warn");
        return
    }

    exchangeRates(fCurrency, fDate, tDate, getGraphData, tCurrency);
} 

function getGraphData(data){
    let dates = Object.keys(data);
    let prices = [];
    let max = 0;
    let min = Number.MAX_SAFE_INTEGER;

    for(i of Object.values(data)){
        let currVal = Object.values(i)[0].toFixed(2)
        prices.push(currVal);
        currVal > max ? max = +currVal : "";
        currVal < min ? min = +currVal : "";
    }

    let series = [];
    for (i in dates){
        series.push([dates[i], prices[i]])
    }

    let len = series.length > 20 ? 10 : series.length;
    chartData = {series, min, max, len};

    doAreaGraph();
    doBarGraph();
}


// fetching graph data
let chartData = {};
let areaGraphContainer = document.querySelector("#chart-area");
let barGraphContainer = document.querySelector("#chart-bar");

function doAreaGraph(){
    areaGraphContainer.innerHTML = "" ;

    let options = {
        chart: {
            id: "areaGraphContainer",
            type: "area",
            height: 230,
            foreColor: "#ccc",
            toolbar: {
                autoSelected: "pan",
                show: false
            }
        },
        colors: ["#00f096"],
        stroke: {
            width: 3
        },
        grid: {
            borderColor: "#555",
            clipMarkers: false,
            yaxis: {
                lines: {
                    show: false
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        fill: {
            gradient: {
                enabled: true,
                opacityFrom: 0.55,
                opacityTo: 0
            }
        },
        markers: {
            size: 5,
            colors: ["#239b56 "],
            strokeColor: "#00ffb4",
            strokeWidth: 3
        },
        series: [
            {
                data: chartData["series"]
            }
        ],
        tooltip: {
            theme: "dark"
        },
        xaxis: {
            type: "datetime"
        },
        yaxis: {
            min: chartData["min"],
            max: chartData["max"],
            tickAmount: chartData["len"]
        }
    };

    let chart = new ApexCharts(areaGraphContainer, options);
    chart.render();
}

function doBarGraph(){
    barGraphContainer.innerHTML = "" ;

    var options = {
        chart: {
            id: "chart1",
            height: 130,
            type: "bar",
            foreColor: "#ccc",
            brush: {
                target: "areaGraphContainer",
                enabled: true
            },
            selection: {
                enabled: true,
                fill: {
                    color: "#fff",
                    opacity: 0.4
                },
            }
        },
        colors: ["#00ffb4"],
        series: [
            {
                data: chartData["series"]
            }
        ],
        stroke: {
            width: 2
        },
        grid: {
            borderColor: "#444"
        },
        markers: {
            size: 0
        },
        xaxis: {
            type: "datetime",
            tooltip: {
                enabled: false
            }
        },
        yaxis: {
            tickAmount: 5
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart-bar"), options);

    chart.render();
}