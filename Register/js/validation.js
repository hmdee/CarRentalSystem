export default function inputsValidation(element, msgId,reqMsgID) {
    let msg = document.getElementById(msgId);
    let reqMsg = document.getElementById(reqMsgID);
    let text = element.value;
    if (element.id === 'terms') {
        let termsChecked = element.checked;
        if (!termsChecked) {
          msg.classList.replace('d-none', 'd-block'); 
          return false;
        } else {
          msg.classList.replace('d-block', 'd-none'); 
          return true;
        }
      }
  let regex = {
    name: /^[a-zA-Z\s]{2,30}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
  };
  if(text.trim()=='')
  {
    reqMsg.classList.replace('d-none',"d-block");
    msg.classList.replace('d-block',"d-none");
  }
  else
  {
    reqMsg.classList.replace('d-block',"d-none");
    if (regex[element.id].test(text) === true) {
        element.classList.add("is-valid");
        element.classList.remove("is-invalid");
        msg.classList.replace('d-block',"d-none");
        return true
      } else {
        element.classList.add("is-invalid");
        element.classList.remove("is-valid");
        msg.classList.replace("d-none",'d-block');
        return false
      }
  }
  
}
