export default function validationLogIn(element,msgId)
{
let text=element.value
let reqMsg=document.getElementById(msgId)
if(text.trim()=='')
    {
      reqMsg.classList.replace('d-none',"d-block");
return false
    }
    else
    {
        reqMsg.classList.replace("d-block",'d-none');
        return true
    }
}