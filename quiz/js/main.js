// 1. Функционал перемещения по карточкам, вперёд и назад
// 2. Проверка на ввод данных
// 3. Получение (сбор) данных с карточек
// 4. Записывать все введённые данные
// 5. Реализовать работу прогресс бара
// 6. Подсветка рамки для радио и чекбоксов

// Обмен с сохранёнными ответами
var answers = {
    2: null,
    3: null,
    4: null,
    5: null
}

// Движение вперёд
var btnNext = document.querySelectorAll('[data-nav="next"]');
btnNext.forEach(function(button){
    button.addEventListener("click", function(){
        var thisCard = this.closest("[data-card]");
        var thisCardNumber = parseInt(thisCard.dataset.card);

        if (thisCard.dataset.validate == "novalidate") {
            navigate("next", thisCard);
            updateProgressBar("next", thisCardNumber);
        } else {

            // При движении вперёд сохраняем данные в объект
            saveAnswer(thisCardNumber, gatherCardData(thisCardNumber));

            // Валидация на заполненность
            if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
                navigate("next", thisCard);
                updateProgressBar("next", thisCardNumber);
            } else {
                alert("Сделайте ответ, прежде чем переходить далее");
            }
        }
    });
});

// Движение назад
var btnPrev = document.querySelectorAll('[data-nav="prev"]');
btnPrev.forEach(function(button){
    button.addEventListener("click", function(){
        var thisCard = this.closest("[data-card]");
        var thisCardNumber = parseInt(thisCard.dataset.card);
        navigate("prev", thisCard);
        updateProgressBar("prev", thisCardNumber);
    });
});

// Функция для навигации вперёд и назад
function navigate(direction, thisCard) {
    var thisCardNumber = parseInt(thisCard.dataset.card);
    var nextCard;

    if (direction == "next") {
        nextCard = thisCardNumber + 1;    
    } else if (direction == "prev") {
        nextCard = thisCardNumber - 1;
    }

    thisCard.classList.add("hidden");
    document.querySelector(`[data-card="${nextCard}"]`).classList.remove("hidden");
}

// Функция сбора заполненных данных с карточки
function gatherCardData(number){

    var question;
    var result = [];

    // Находим карточску по номеру и data-атрибуту
    var currentCard = document.querySelector(`[data-card="${number}"]`);
    
    // Находим главный вопрос карточки
    question = currentCard.querySelector("[data-question]").innerText;
    
    // 1. Находим все заполненные значения из из радио кнопок
    var radioValues = currentCard.querySelectorAll('[type="radio"]');
    radioValues.forEach(function(item) {
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    });

    // 2. Находим все заполненные значения из чекбоксов
    var cheBoxValues = currentCard.querySelectorAll('[type="checkbox"]');
    cheBoxValues.forEach(function(item){
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    });

    // 3. Находим все заполненные значения из чекбоксов
    var inputValues = currentCard.querySelectorAll('[type="text"], [type="email"], [type="number"]');
    inputValues.forEach(function(item){
        itemValue = item.value;
        if (itemValue.trim() != "") {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    });

    var data = {
        question: question,
        answer: result
    }

    return data;
}

// Функция записи ответа в объект с данными
function saveAnswer(number, data){
    answers[number] = data;
}

// Функция проверки на заполненность
function isFilled(number){
    if(answers[number].answer.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Функция проверки email
function validateEmail(email){
    var pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email);
}

// Функция проверки на заполненность required чекбоксов и инпутов с email
function checkOnRequired(number){
    var currentCard = document.querySelector(`[data-card="${number}"]`);
    var requiredFields = currentCard.querySelectorAll("[required]");

    var isValidArray = [];
    
    requiredFields.forEach(function(item){
        
        if (item.type == "checkbox" && item.checked == false) {
            isValidArray.push(false);
        } else if (item.type == "email") {
            if ( validateEmail(item.value) ) {
                isValidArray.push(true);
            } else {
                isValidArray.push(false);
            }
        }
    });

    if (isValidArray.indexOf(false) == -1) {
        return true;
    } else {
        return false;
    }
}

// Подсвечиваем рамку у радиокнопок
document.querySelectorAll(".radio-group").forEach(function(item){
    item.addEventListener("click", function(e){
        // Проверяем где произошёл клик
        var label = e.target.closest("label");
        if (label) {
            // Отменяем активный класс у всех тегов label
            label.closest(".radio-group").querySelectorAll("label").forEach(function(item){
                item.classList.remove("radio-block--active");
            });
            // Добавлям активный класс к label по которому был клик
            label.classList.add("radio-block--active");
        }
    });
});

// Подсвечиваем рамку у чекбоксов
document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(function(item){
    item.addEventListener('change', function(){
        // Если чекбокс проставлен то 
        if (item.checked) {
            // добавляем активный класс к тегу label в котором он лежит
            item.closest("label").classList.add("checkbox-block--active");
        } else {
            // в ином случае убираем активный класс 
            item.closest("label").classList.remove("checkbox-block--active");
        }
    });
});

// Отображение прогресс бара
function updateProgressBar(direction, cardNumber){

    // Расчёт всего кол-ва карточек // 6
    var cardsTotalNumber = document.querySelectorAll("[data-card]").length;

    // Текущая карточка // 
    // Проверка направления перемещения
    if (direction == "next") {
        cardNumber += 1;
    } else if (direction == "prev") {
        cardNumber -= 1;
    }

    // Расчёт % прохождения
    var progress = ((cardNumber * 100) / cardsTotalNumber).toFixed();
    
    // Находим и обновляем прогресс бар
    var progressBar = document.querySelector(`[data-card="${cardNumber}"]`).querySelector(".progress");
    if (progressBar) {
        // Обновить число прогресс бара
        progressBar.querySelector(".progress__label strong").innerText = `${progress}%`;
        // Обновить полоску прогресс бара
        progressBar.querySelector(".progress__line-bar").style = `width: ${progress}%`;
    }
}