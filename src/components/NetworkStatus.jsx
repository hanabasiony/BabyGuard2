// NetworkStatus.js
import { useEffect } from "react";
import toast from "react-hot-toast";

function NetworkStatus() {
  useEffect(() => {
    // 1. Check once when the component mounts
    if (!navigator.onLine) {
      // alert("You are currently offline. Please check your connection.");
      toast.error('You are currently offline. Please check your connection.')
    }

    // 2. Define handlers for online/offline events
    const handleOnline = () => {
      // alert("You are back online!");
      toast.success("You are back online!")
    };

    const handleOffline = () => {
      // alert("You are offline. Please check your internet connection.");
      toast.error("You are offline. Please check your internet connection.")
    };

    // 3. Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 4. Clean up the event listeners when component unmounts
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return null; // This component only handles logic, so no UI is needed
}

export default NetworkStatus;
