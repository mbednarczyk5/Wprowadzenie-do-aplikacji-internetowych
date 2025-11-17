
function validInput(){
    const textDiv=document.getElementById("pomoc");
    const emailDiv=document.getElementById("email")
    const telDiv=document.getElementById("tel")
    const errorDiv=document.getElementById("errorMessage")
    errorDiv.textContent = "";
    emailValue=emailDiv.value
    telValue=telDiv.value
    const isTelNumber = /^\d{9}$/.test(telValue);
    const isEmailValid = emailValue.includes("@") && emailValue.includes(".");
    if (!isTelNumber && !isEmailValid){
        errorDiv.textContent="Niepoprawny numer i email";
        errorDiv.classList.add("show");
        setTimeout(() => {
            errorDiv.classList.remove("show")
         },2000)
        return;
    }

    else if (!isTelNumber){
        errorDiv.textContent="Niepoprawny numer";
        errorDiv.classList.add("show");
        setTimeout(() => {
            errorDiv.classList.remove("show")
         },2000)
        return;

    }
    else if (!isEmailValid){
         errorDiv.textContent="Niepoprawny email";
         errorDiv.classList.add("show");
         setTimeout(() => {
            errorDiv.classList.remove("show")
         },2000)
         return;
    }
    else{
        telDiv.value="";
        textDiv.value="";
        emailDiv.value="";
        errorDiv.textContent="Poprawnie wysłano wiadomość";
        errorDiv.classList.add("show");
        setTimeout(() => {
            errorDiv.classList.remove("show")
        },2000)
        return;
    }
    
}