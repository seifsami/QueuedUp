// utils/browserHelpers.js
export const isInAppBrowser = () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;

  // Common in-app browsers (Facebook, Instagram, Messenger, Twitter, etc.)
  return (
    ua.includes("FBAN") || ua.includes("FBAV") ||   // Facebook
    ua.includes("Instagram") ||                    // Instagram
    ua.includes("Messenger") ||                    // Messenger
    ua.includes("Line") ||                         // Line app
    ua.includes("Twitter") ||                      // Twitter app
    ua.includes("LinkedInApp")                     // LinkedIn
  );
};
