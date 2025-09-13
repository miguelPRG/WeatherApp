function Header() {
  return (
    <>
      <header className="header text-center p-3 bg-blue-500 text-white">
        <h1 className="header-title">Weather App</h1>
        <div className="flex justify-center mt-4">
          <input
            className="bg-white text-black rounded p-2 w-100 mr-2"
            type="text"
            placeholder="Search for a city..."
          />
          <button
            className="cursor-pointer search-button"
            onClick={() => alert("Search functionality not implemented yet")}
          >
            Search
          </button>
        </div>
      </header>
    </>
  );
}

export default Header;
