export function formatInterval(minutes: number) {
	if (minutes < 60) {
	  const lastDigit = minutes % 10;
	  const lastTwoDigits = minutes % 100;
	  
	  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
	    return `${minutes} минут`;
	  } else if (lastDigit === 1) {
	    return `${minutes} минута`;
	  } else if (lastDigit >= 2 && lastDigit <= 4) {
	    return `${minutes} минуты`;
	  } else {
	    return `${minutes} минут`;
	  }
	} else if (minutes === 60) {
	  return '1 час'
	} else if (minutes < 1440) {
	  const hours = Math.floor(minutes / 60);
	  const lastDigit = hours % 10;
	  const lastTwoDigits = hours % 100;
	  
	  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
	    return `${hours} часов`;
	  } else if (lastDigit === 1) {
	    return `${hours} час`;
	  } else if (lastDigit >= 2 && lastDigit <= 4) {
	    return `${hours} часа`;
	  } else {
	    return `${hours} часов`;
	  }
	} else {
	  const days = Math.floor(minutes / 1440);
	  const lastDigit = days % 10;
	  const lastTwoDigits = days % 100;
	  
	  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
	    return `${days} дней`;
	  } else if (lastDigit === 1) {
	    return `${days} день`;
	  } else if (lastDigit >= 2 && lastDigit <= 4) {
	    return `${days} дня`;
	  } else {
	    return `${days} дней`;
	  }
	}
}
