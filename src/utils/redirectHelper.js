export const isInAppBrowser = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
  
    return (
      ua.includes("FBAN") || ua.includes("FBAV") ||  // Facebook
      ua.includes("Instagram") ||                   // Instagram
      ua.includes("Messenger")                      // Messenger
    );
  };
  
  export const redirectToBrowser = () => {
    if (isInAppBrowser()) {
      const url = window.location.href;
  
      // Force open in default browser (Chrome on iOS/Android)
      window.location.href = `googlechrome://${url.replace(/^https?:\/\//, '')}`;
  
      // Fallback if redirect fails
      setTimeout(() => {
        window.location.href = url;
      }, 500);
    }
  };
  