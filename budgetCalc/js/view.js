var viewController = (function() {

    var DOMstrings = {
        inputType: "#input__type",
        inputDescrption: "#input__description",
        inputValue: "#input__value",
        form: '#budget-form',
        incomeContainer: '#income__list',
        expenseContainer: '#expenses__list',
        budgetLabel: "#budget-value",
        incomeLabel: "#income-label",
        expensesLabel: "#expense-label",
        expensesPercentLabel: "#expense-percent-label",
        budgetTable: '#budget-table',
        monthLabel: "#month",
        yearLabel: "#year"
    }

    function getInput(){
        return {
            type: document.querySelector(DOMstrings.inputType).value,
            description: document.querySelector(DOMstrings.inputDescrption).value,
            value: document.querySelector(DOMstrings.inputValue).value,
        }
    }

    function formatNumber(num, type){

        var numSplit, int, dec, newInt, resultNumber;

        /* 
        + или - перед числом в зависимости от типа
        два знака после точки, десятые и сотые
        */

        // Убираем знак "-" у отрицательных чисел
        num = Math.abs(num); // Math.abs(-10) = 10
        // Приводим к 2-м цифрам после точки
        num = num.toFixed(2);

        /* 
        123000 => 123,000.00
        123456789 => 123,456,789.00
        */

        numSplit = num.split("."); // 45.78 => [45, 78]
        // Целая часть 
        int = numSplit[0];
        // Десятые от исходной строки
        dec = numSplit[1];

        // Расставляем запятые 
        // Исходя из длины числа делим его на части по 3 цифры
        // Начиная с правой стороны проставляем запятые после каждого третьего числа
        //Если длина номера больше чем 3 цифры, значит надо ставить запятые 
        if (int.length > 3) {
            newInt = "";

            for (var i = 0; i < int.length / 3; i++) {
            
                // Формируем новую строку с номером
                newInt =
                // Добавляем запятую каждые 3 числа
                "," + 
                // Вырезанный куспк из исходной строки
                int.substring(int.length - 3 * (i +1), int.length - 3*i) + 
                // Конец строкиб правая часть
                newInt;            
            }
            
            // Убираем запятую в начале
            if (newInt[0] === ",") {
                newInt = newInt.substring(1);
            }
        
        // Если новое число равно нулю, то в новую строку записываем ноль
        } else if (int === "0") {
            newInt = "0";
        // Если исходное число имеет 3 и менее символов
        } else {
            newInt = int;
        }

        resultNumber = newInt + "." + dec;

        if (type === "exp") {
            resultNumber = "- " + resultNumber;
        } else if (type === "inc") {
            resultNumber = "+ " + resultNumber;
        }

        return resultNumber;

    }

    function renderListItem (obj, type){
        var containerElement, html;

        if (type === "inc") {
            containerElement = DOMstrings.incomeContainer;
            html = `<li id="inc-%id%" class="budget-list__item item item--income">
                        <div class="item__title">%description%</div>
                        <div class="item__right">
                            <div class="item__amount">%value%</div>
                            <button class="item__remove">
                                <img
                                    src="./img/circle-green.svg"
                                    alt="delete"
                                />
                            </button>
                        </div>
                    </li>`
        } else {
            containerElement = DOMstrings.expenseContainer;
            html = `<li id="exp-%id%" class="budget-list__item item item--expense">
                        <div class="item__title">%description%</div>
                        <div class="item__right">
                            <div class="item__amount">
                                %value%
                                <div class="item__badge">
                                    <div class="item__percent badge badge--dark">
                                        15%
                                    </div>
                                </div>
                            </div>
                            <button class="item__remove">
                                <img src="./img/circle-red.svg" alt="delete" />
                            </button>
                        </div>
                    </li>`
        }

        newHtml = html.replace("%id%", obj.id);
        newHtml = newHtml.replace("%description%", obj.description);
        newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

        document.querySelector(containerElement).insertAdjacentHTML("beforeend", newHtml);

    }

    function clearFields (){
        var inputDesc, inputVal;

        inputDesc = document.querySelector(DOMstrings.inputDescrption);
        inputVal = document.querySelector(DOMstrings.inputValue);

        inputDesc.value = "";
        inputDesc.focus();
        inputVal.value = "";
    }

    function updateBudget (obj){
        var type;
        /*
        {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage
        } 
        budgetLabel: "#budget-value",
        incomeLabel: "#income-label",
        expenseLabel: "#expense-label",
        expensesPercentLabel: "#expense-percent-label"
        */

        if (obj.budget > 0) {
            type = "inc";
        } else if (obj.budget === 0) {
        } else {
            type = "exp";
        }

        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, "inc");
        document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, "exp");
      
        if (obj.percentage > 0) {
            document.querySelector(DOMstrings.expensesPercentLabel).textContent = obj.percentage;    
        } else {
            document.querySelector(DOMstrings.expensesPercentLabel).textContent = "--";
        }
    }

    function deleteListItem (itemID){
        document.getElementById(itemID).remove();
    }

    function updateItemsPercentages (items){
        items.forEach(function(item){
            
            // Находим блок с % внутри текущей записи
            var el = document.getElementById(`exp-${item[0]}`).querySelector(".item__percent");
            
            if (item[1] >= 0) {
                // Если есть - то показываем блок с %
                el.parentElement.style.display = "block";
                // Меняем контент внутри бейджа с %
                el.textContent = item[1] + "%";
            } else {
                // Если нет - то скррываем бейдж с %
                el.parentElement.style.display = "none";
            }
        });
    }

    function displayMonth (){
        now = new Date();
        year = now.getFullYear();
        month = now.getMonth(); // Получаем индекс месяца Апрель => 3

        monthArr = [
            'Январь', 'Февраль', 'Март',
            'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь',
            'Октябрь', 'Ноябрь', 'Декабрь'
        ];

        month = monthArr[month];

        document.querySelector(DOMstrings.monthLabel).innerText = month;
        document.querySelector(DOMstrings.yearLabel).innerText = year;

    }

    return {
        getInput: getInput,
        renderListItem: renderListItem,
        clearFields: clearFields,
        updateBudget: updateBudget,
        deleteListItem: deleteListItem,
        updateItemsPercentages: updateItemsPercentages,
        displayMonth: displayMonth,
        getDomStrings: function(){
            return DOMstrings
        }
    }

})();