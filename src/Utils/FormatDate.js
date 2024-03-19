export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
  
    
    const formattedDate = `${day}.${month}.${year}`;
    return formattedDate;
  }

  export const splitDateTime = (dateTimeString) => {
  const dateTime = new Date(dateTimeString);
  const year = dateTime.getFullYear();
  const month = String(dateTime.getMonth() + 1).padStart(2, '0'); // Ay sıfırla başlayabilir, örneğin "01" şeklinde olmalı
  const day = String(dateTime.getDate()).padStart(2, '0'); // Gün sıfırla başlayabilir, örneğin "01" şeklinde olmalı
  const hours = String(dateTime.getHours()).padStart(2, '0'); // Saat sıfırla başlayabilir, örneğin "01" şeklinde olmalı
  
  const date = `${year}-${month}-${day}`;
  const time = `${hours}`;
  return { date, time };
};