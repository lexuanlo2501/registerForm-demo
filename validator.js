function validator(options){

    var selectorRules = {};

    function validate(inputElement, rule){
        // used before many rule in one element input
        // var errorMessage = rule.test(inputElement.value)

        var errorMessage
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)

        // lấy ra các rules của selector
        var rules = selectorRules[rule.selector];

        // lặp qua từng rule và kiểm tra
        // nếu có lỗi thì dừng việc kiểm tra
        for(var i = 0; i<rules.length; i++){
            errorMessage = rules[i](inputElement.value)
            if(errorMessage) break;
        }

        if(errorMessage){
            errorElement.innerText = errorMessage
            inputElement.parentElement.classList.add('invalid')
        }
        else {
            errorElement.innerText = ""
            inputElement.parentElement.classList.remove('invalid')
        }
    }

    function typing(inputElement){
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
        errorElement.innerText = ""
        inputElement.parentElement.classList.remove('invalid')
    }
    
    // var formElement = document.getElementById(options.form)
    var formElement = document.querySelector(options.form)

    if(formElement){
        options.rules.forEach(function(rule){
            // selectorRules[rule.selector] = rule.test 

            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }
            else {
                selectorRules[rule.selector] = [rule.test]
            }

            var inputElement = document.querySelector(rule.selector)
            // console.log(inputElement) //in thử
            if(inputElement){
                inputElement.onblur = function(){
                    validate(inputElement, rule)
                }
                inputElement.oninput = function(){
                    typing(inputElement)
                }           
             }
        })
        console.log(selectorRules)
    }
}


// rules
validator.isRequired = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            return value.trim() ? undefined: message || 'vui lòng nhập trường hợp này'
        }
    }
}

validator.isEmail = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : message || 'cú pháp email sai'
        }
    }
}

var password1;
validator.minLengh = function(selector, min, message){
    return {
        selector: selector,
        test: function(value){
            password1 = value
            return value.length >= min ? undefined : message || `password phải trên ${min} kí tự` 
        }
    }
}

validator.passwordNotSame = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            return value === password1 ? undefined : message || `error` 
        }
    }
}
