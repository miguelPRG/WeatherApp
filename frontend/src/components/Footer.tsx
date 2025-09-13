//Function to get the date of today
function getCurrentDate() {
  const today = new Date();
  return today.getFullYear();
}

function Footer() {
  return (
    <footer className="w-full p-5 bg-gray-800 text-white text-center h-16 fixed bottom-0">
      <p className="text-md">
        &copy; {getCurrentDate()} Weather App. All rights reserved to{" "}
        <span className="font-bold">Miguel Gonçalves</span>.
      </p>
    </footer>
  );
}

export default Footer;
