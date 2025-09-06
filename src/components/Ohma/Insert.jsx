import "../../tailwind.css";

function Insert() {
  return (
    <div className="relative group w-full h-full">
      <button type="button" className="w-full h-full flex flex-col justify-center text-[20px] focus:outline-none text-black bg-[#9AD24B] hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-[10px] text-sm dark:hover:bg-green-700 dark:focus:ring-green-800">Insert</button>
    </div>
  );
}

export default Insert;