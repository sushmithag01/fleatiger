const GetCurrentDate = () =>{
const date  =  new Date().getDate();
const month =  new Date().getMonth() + 1;
const year  =  new Date().getFullYear();

const currentDate =  year  + '-' + month + '-' + date;
return currentDate;
}

export default GetCurrentDate;