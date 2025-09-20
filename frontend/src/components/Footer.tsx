import React, { useEffect, useState } from "react";

//Function to get the date of today
function getCurrentDate() {
  const today = new Date();
  return today.getFullYear();
}

function Footer() {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottom = document.body.offsetHeight - 2; // margem de erro
      if (scrollPosition >= bottom) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      className={`w-full p-5 bg-blue-500 text-white text-center h-5 fixed bottom-0 flex flex-col justify-center
        ${showFooter ? "footer-fade-in opacity-100" : "footer-fade-out opacity-0 pointer-events-none"}
      `}
    >
      <p className="text-md">
        &copy; {getCurrentDate()} Weather App. All rights reserved to
        <span className="font-bold"> Miguel Gonçalves</span>.
      </p>
    </footer>
  );
}

export default Footer;
