const convertToMilliseconds = (time: string | undefined): number => {
    if (!time) return 0;
    
    const [hours, minutes, seconds] = time.split(':').map(Number);
  
    // Ensure hours, minutes, and seconds are defined and are numbers
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      throw new Error("Invalid time format");
    }
  
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  };
  
  export {convertToMilliseconds}