export const extractHourFromDateIso = (dateIso:string)=>{
    const date = new Date(dateIso);
    return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
}