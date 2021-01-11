import Vue from "vue";

export const baseApi = process.env.VUE_APP_BASE_API;

export const userKey = "registered_user";


// ERROR GLOBAL
export function showError(e) {
  if (e && e.response && e.response.data && e.response.data.message) {
    Vue.toasted.global.defaultError({ msg: e.response.data.message });
  } else if (typeof e === "string") {
    Vue.toasted.global.defaultError({ msg: e });
  } else {
    Vue.toasted.global.defaultError();
  }
}





// ERROR FIELD
export function appendError(key, msgError){
  var divError = document.createElement("div");
  divError.classList.add("invalid-msg");
  if(document.getElementById(key)){
    document.getElementById(key).classList.add("invalid-element");
    var pai = document.getElementById(key).parentElement;
    if(pai.getElementsByClassName("invalid-msg").length == 0){
      divError.innerHTML = (pai.querySelector('label.label-text:first-of-type')) ? pai.querySelector('label.label-text:first-of-type').textContent + ' ' + msgError : msgError;
      pai.appendChild(divError);
    }
  }
}

export function showAllError(errors){
  cleanErrors();
  var keys = Object.keys(errors);
  for(var i = 0; i < keys.length; i++){
    appendError(keys[i], errors[keys[i]]);
  }

}

export function cleanErrors(){
  var invalid_msg_list = document.getElementsByClassName("invalid-msg");
  var invalid_element_list = document.getElementsByClassName("invalid-element");
  var invalid_msg_length = invalid_msg_list.length;
  var invalid_element_length = invalid_element_list.length;
  for(var msg_index = 0; msg_index < invalid_msg_length; msg_index++){
    invalid_msg_list[0].remove();
  }
  for(var element_index = 0; element_index < invalid_element_length; element_index++){
    invalid_element_list[0].classList.remove("invalid-element");
  }
}



// ERROR SCOPE

export function appendErrorScope(key, msgError, scope){
  var divError = document.createElement("div");
  divError.classList.add("invalid-msg");
  if(document.querySelector(scope + " #" + key)){
    document.querySelector(scope + " #" + key).classList.add("invalid-element");
    var pai = document.querySelector(scope + " #" + key).parentElement;
    if(pai.getElementsByClassName("invalid-msg").length == 0){
      divError.innerHTML = (pai.querySelector('label.label-text:first-of-type')) ? pai.querySelector('label.label-text:first-of-type').textContent + ' ' + msgError : msgError;
      pai.appendChild(divError);
    }
  }
}

export function showAllErrorScope(errors, scope){
  cleanErrorsScope(scope);
  var keys = Object.keys(errors);
  for(var i = 0; i < keys.length; i++){
    appendErrorScope(keys[i], errors[keys[i]], scope);
  }

}

export function cleanErrorsScope(scope){
  var invalid_msg_list = document.querySelectorAll(scope + " .invalid-msg");
  var invalid_element_list = document.querySelectorAll(scope + " .invalid-element");

  if(invalid_msg_list){
    var invalid_msg_length = invalid_msg_list.length;
    for(var msg_index = 0; msg_index < invalid_msg_length; msg_index++){
      invalid_msg_list[msg_index].remove();
    }
  }

  if(invalid_element_list){
    var invalid_element_length = invalid_element_list.length;
    for(var element_index = 0; element_index < invalid_element_length; element_index++){
      invalid_element_list[element_index].classList.remove("invalid-element");
    }
  }

}

export function getDateCalculated(dateStr, calc){
  var vDate = new Date(dateStr);
  var dateTimeConvertedTimeZone = new Date( vDate.getTime() + ( vDate.getTimezoneOffset() * 60000 ) );

  var dateCalculated = new Date();
  dateCalculated.setDate(dateTimeConvertedTimeZone.getDate() + calc);
  return dateCalculated;
}

export default { userKey, baseApi, showError };
