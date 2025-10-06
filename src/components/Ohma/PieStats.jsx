import "../../tailwind.css";
import { Link } from "react-router-dom";
function PieStats({children}) {
    return (
    <>
    <div className="flex flex-col items-center justify-center w-full h-[291px]
    box-content  rounded-[9px] bg-gray-100 border border-black/10">
       {children}
    </div>
    </>
    );
}

export default PieStats;