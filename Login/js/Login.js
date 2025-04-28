const loginError=document.getElementById('loginError')
export default function logIn(userEmail,userPassword)
{
    let user=JSON.parse(localStorage.getItem('user'))
    if(userEmail.value ==='admin' &&userPassword.value==='admin')
    {
        console.log('welcome Admin');
        
    }

else if(user)
{
    if(user.email===userEmail.value && user.password=== userPassword.value)
    {
        loginError.classList.add('d-none')
        console.log(`welcome ${user.name}`);
        
    }
    else
    {
        loginError.classList.remove('d-none')
    }
}
}