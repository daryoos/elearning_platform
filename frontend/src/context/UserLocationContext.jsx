import React, { createContext, useContext, useEffect, useState } from "react";

const UserLocationContext = createContext();

export const useUserLocation = () => useContext(UserLocationContext);

export const UserLocationProvider = ({ children }) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("userCountry");
    if (stored) {
      setCountry(stored);
      return;
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
            );
            const data = await res.json();
            const userCountry = data.address?.country || "Necunoscut";

            setCountry(userCountry);
            localStorage.setItem("userCountry", userCountry);
            document.cookie = `userCountry=${userCountry}; max-age=86400; path=/`;
          } catch (err) {
            console.error("Eroare la obținerea țării:", err);
          }
        },
        (err) => console.warn("Geolocalizare refuzată:", err.message)
      );
    }
  }, []);

  return (
    <UserLocationContext.Provider value={{ country }}>
      {children}
    </UserLocationContext.Provider>
  );
};
