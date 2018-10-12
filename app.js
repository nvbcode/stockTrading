$(document).ready(function () {

    const stocksList = ['AMD', 'MSFT', 'MDT', 'GOOG'];
    const validationList = [];

    const getStockInfo = function () {

        $('#companyInfo').empty();

        $('#relatedArticles').empty();

        const stock = $(this).attr('data-name');
        console.log(stock);
        const getURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news,logo,chart&range=1m&last=10`;

        $.ajax({
            url: getURL,
            method: 'GET'
        }).then(function (response) {
            console.log(response);

            const logo = response.logo.url;
            const coName = response.quote.companyName;
            const stockPrice = response.quote.latestPrice;
            const getNews = response.news;
            console.log(getNews);
            $('#companyInfo').append(`<img src=${logo}><br>`);
            $('#companyInfo').append(`<h3>${coName}</h3><br>`);
            $('#companyInfo').append(`<em>Current Stock Price:<em> ${stockPrice}<br>`);

            for (let i = 0; i < getNews.length; i++) {
                let newsHeadline = getNews[i].headline;
                console.log(newsHeadline);
                let newsURL = getNews[i].url;
                console.log(newsURL);
                $('#relatedArticles').append(`<a href = '${newsURL}' target= "_blank" > ${newsHeadline}</a><br>`);

            };
        });
    };

    const getAllStock = function () {
        const getURL = 'https://api.iextrading.com/1.0/ref-data/symbols';
        $.ajax({
            url: getURL,
            method: 'GET'
        }).then(function (response) {
            // console.log(response);

            for (let i =0; i<response.length; i++) {
                
                let stockSym = response[i].symbol;
                validationList.push(stockSym);
            };
        });

        console.log(validationList);
    };

    // function to render the stocks once they are added to the array
    const render = function () {
        $(".buttonArea").empty();

        for (i = 0; i < stocksList.length; i++) {
            let newButton = $('<button>');
            newButton.addClass('stock');
            newButton.attr('data-name', stocksList[i]);
            newButton.text(stocksList[i]);
            $(".buttonArea").append(newButton);

            // could also use the code below:
            // $('.buttonArea').append(`<button class = "${stocksList[i]}"> ${stocksList[i]} </button>`);

        };

    };

    const addNewButton = function (e) {
        e.preventDefault();
        let newStock = $('#userInput').val().trim().toUpperCase();

        let stockExists = false;

        // try using '.includes'
        for(let i = 0; i < validationList.length; i++) {

            if (newStock === validationList[i] ){
                stockExists = true;
                stocksList.push(newStock);
                render();
                $('#userInput').val('');
                return;
            }        

        };

        if (!stockExists) {
            alert("Enter valid stock symbol.");
        }
    

    };


    render();
    getAllStock();
    $('#addButton').on('click', addNewButton);
    $('.buttonArea').on('click', '.stock', getStockInfo);

});



