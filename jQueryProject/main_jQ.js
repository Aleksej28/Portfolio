$(document).ready(function(){
    // Получаем значение атрибута src у картинки
    let srcValue = $('#imgHolder img').attr('src');
    let $carImg = $('#imgHolder img');
    
    // Меняем значение атрибута src у картинки

    let carColor = $('data-img-path');
    
    // Клик по картинке
    const colors = [
        "img/black.png",
        "img/blue.png",
        "img/brown.png",
        "img/darkgray.png",
        "img/lightgray.png",
        "img/red.png",
        "img/silver.png",
        "img/white.png"
    ];

    $('#imgHolder img').on('click', function() {
        let index = colors.indexOf(srcValue);
        srcValue = colors[index+1];
        $carImg.fadeOut(200, function(){
            $carImg.attr('src', srcValue).fadeIn(200);
        });
        if (index + 1 === colors.length) {
            srcValue = colors[0];
        }
    });

    // Отдельное действие для каждого цвета
    // $('#blue').on('click', function() {
    // $('#imgHolder img').attr('src', 'img/blue.png');
    // });
    
    // $('#brown').on('click', function() {
    // $('#imgHolder img').attr('src', 'img/brown.png');
    // });

    // Единое действие для всех цветов
    $('#colorSelector .colorItem').on('click', function() {
    let imgPath;
    imgPath = $(this).attr('data-img-path');
    $('#imgHolder img').attr('src', imgPath);
    srcValue = imgPath;
    });

    // Единое действие для всех цветов с эффектом fade
    // $('#colorSelector .colorItem').on('click', function() {
    //     let imgPath;
    //     imgPath = $(this).attr('data-img-path');
    //     $carImg.fadeOut(200, function() {
    //         $carImg.attr('src', imgPath).fadeIn(200);
    //     });
    // });

    let modelSpecs,
        modelPrice,
        modelSpecsHolder,
        modelPriceHolder;

    modelSpecsHolder = $('#modelSpecs');
    modelPriceHolder = $('#modelPrice')

    modelPrice = 0;
    modelSpecs = '';

    // При старте страницы
    calculatePrice();
    compileSpecs();

    $('#autoForm input').on('change', function() {
        calculatePrice();
        compileSpecs();    
        calculateUSD();
    });

    function calculatePrice(){
        let modelPriceEngine = $('input[name=engine]:checked', '#autoForm').val();
        let modelPriceTransmission = $('input[name=transmission]:checked', '#autoForm').val();
        let modelPricePackage = $('input[name=package]:checked', '#autoForm').val();        

        modelPriceEngine = parseInt(modelPriceEngine);
        modelPriceTransmission = parseInt(modelPriceTransmission);
        modelPricePackage = parseInt(modelPricePackage);
        
        modelPrice = modelPriceEngine + modelPriceTransmission + modelPricePackage;
        modelPriceHolder.text( addSpace(modelPrice) + ' рублей');
    };

    function compileSpecs() {
        modelSpecs = $('input[name=engine]:checked + label', '#autoForm').text();
        modelSpecs = modelSpecs + ', ' + $('input[name=transmission]:checked + label', '#autoForm').text();
        modelSpecs = modelSpecs + ', ' + $('input[name=package]:checked + label', '#autoForm').text();
        modelSpecsHolder.text(modelSpecs);
    }  

    function addSpace(nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.lenght > 1 ? '.' + x[1] : '';
        let rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ' ' + '$2');
        }
        return x1 + x2;
    }

    // function calculateUSD(){
    // let modelPriceUSD = modelPrice / rurUsdRatel;
    // modelPriceUSDHolder.text( '$' + addSpace(modelPriceUSD.toFixed(0) ));
    // }

    // Получаем курс валют
    // let currencyUrl = 'https://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+"USDRUB,EURRUB"&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
    // let rurUsdRate = 0; 
 
});