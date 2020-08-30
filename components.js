//Toggle Btn Settings
document.getElementById('settingBtn').addEventListener('click', function(){
    document.querySelector('.student__table').classList.toggle('settings');
});

//Validation 
var Validation = function(){
    this.checkEmpty = function(selector, name, selectorError='.error-text'){
        var value = document.querySelector(selector).value;
        var selectorErr = document.querySelector(selector).parentElement.querySelector(selectorError);
        if(Number.isNaN(value)){
            if(value.trim() === ''){
                selectorErr.style.display='block';
                selectorErr.innerHTML = name + ' không để trống';
                return false;
            }else{
                selectorErr.style.display='none';
                selectorErr.innerHTML = '';
                return true;
            }
        }else{
            if(value === ''){
                selectorErr.style.display='block';
                selectorErr.innerHTML = name + ' không để trống';
                return false;
            }else{
                selectorErr.style.display='none';
                selectorErr.innerHTML = '';
                return true;
            }
        }
    }

    this.checkAllNumbers = function(selector, name, selectorError='.error-text'){
        var value = document.querySelector(selector).value;
        var selectorErr = document.querySelector(selector).parentElement.querySelector(selectorError);
        var regex = /^[0-9]+$/;
        if(regex.test(value)){
            selectorErr.style.display='none';
            selectorErr.innerHTML = '';
            return true;
        }else{
            selectorErr.style.display='block';
            selectorErr.innerHTML = name + ' không hợp lệ';
            return false;
        }
    }

    this.checkAllLetters = function(selector, name, selectorError='.error-text'){
        var value = document.querySelector(selector).value;
        var selectorErr = document.querySelector(selector).parentElement.querySelector(selectorError);
        var regex = /^[A-Za-z]+$/;
        if(regex.test(value)){
            selectorErr.style.display='none';
            selectorErr.innerHTML = '';
            return true;
        }else{
            selectorErr.style.display='block';
            selectorErr.innerHTML = name + ' không hợp lệ';
            return false;
        }
    }

    this.checkEmail = function(selector, name, selectorError='.error-text'){
        var value = document.querySelector(selector).value;
        var selectorErr = document.querySelector(selector).parentElement.querySelector(selectorError);
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(regex.test(value.toLowerCase())){
            selectorErr.style.display='none';
            selectorErr.innerHTML = '';
            return true;
        }else{
            selectorErr.style.display='block';
            selectorErr.innerHTML = name + ' không hợp lệ';
            return false;
        }
    }

    this.checkMinMaxNumber = function(selector, name, min, max, selectorError='.error-text'){
        var value = parseFloat(document.querySelector(selector).value);
        var selectorErr = document.querySelector(selector).parentElement.querySelector(selectorError);
        if(value >= min && value <= max){
            selectorErr.style.display='none';
            selectorErr.innerHTML = '';
            return true;
        }else{
            selectorErr.style.display='block';
            selectorErr.innerHTML = name + ' có giá trị từ '+min+' đến '+max;
            return false;
        }
    }
}

var Student = function(code, name, cmnd, phone, email, math, physics, chemistry){
    this.code = code;
    this.name = name;
    this.cmnd = cmnd;
    this.phone = phone;
    this.email = email;
    this.scoreMath = math;
    this.scorePhysics = physics;
    this.scoreChemistry = chemistry;

    this.calcAvg = function(arr = [this.scoreMath, this.scorePhysics, this.scoreChemistry]){
          return (arr.reduce((acc, cur) => acc+=cur, 0)/arr.length).toFixed(2);
    }

    this.rankStudent = function(score = this.calcAvg()){
        if(score < 5){
            return 'Yếu';
        }else if(score >=5 && score <6){
            return 'Trung bình';
        }else if(score >=6 && score <7){
            return 'TB Khá';
        }else if(score >=7 && score <8){
            return 'Khá';
        }else if(score >=8 && score <=10){
            return 'Giỏi';
        }
        return 'Không xếp loại';
    }
}