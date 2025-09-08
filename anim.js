for(const link of document.getElementsByClassName("link")) {
  link.onmousemove = e => {
    const decimal = e.clientX / link.offsetWidth;
    
    const basePercent = 80,
          percentRange = 20,
          adjustablePercent = percentRange * decimal;
    
    const lightRedPercent = basePercent + adjustablePercent;
    
    link.style.setProperty("--light-red-percent",`${lightRedPercent}%`);
  }
}
