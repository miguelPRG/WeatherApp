//Function to get the date of today
function getCurrentDate() {
  const today = new Date();
  return today.getFullYear();
}

function Footer() {
  return (
    <footer className="w-full p-5 bg-blue-500 text-white text-center h-5 fixed bottom-0 flex flex-col justify-center">
      <p className="text-md">
        &copy; {getCurrentDate()} Weather App. All rights reserved to{" "}
        <span className="font-bold">Miguel Gonçalves</span>.
      </p>
    </footer>
  );
}

export default Footer;
