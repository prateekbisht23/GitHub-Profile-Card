const label = document.querySelector('label')
const input = document.querySelector('input')


if(input.value === ""){
    console.log(input.value);
}else{
    label.style.display = 'none';
}