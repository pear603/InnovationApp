import "../tailwind.css";
import React, { useState } from "react";

function NameTag({ value, onChange, children }) {
  return (
    <>
      {/* <div className="pl-[43px] pt-[31px] pr-[29px]"> */}
      <div className="w-[549px] bg-transparent">
        <p className="p-[10px] text-[16px] text-black">Name Tag</p>
        <div
          className="flex items-center h-[40px] 
                          w-[549px] bg-[#E7EBEE] shadow-[0_4px_6px_rgba(0,0,0,0.2)] rounded-lg"
        >
          <input
            type="text"
            value={value}
            placeholder="Type Tag Name"
            onChange={(e) => onChange(e.target.value)}
            className="ml-[15px] w-full bg-transparent outline-none text-[16px] text-[#707376]"
          />

        </div>
        <div className="pt-[16px] items-end justify-end flex">{children}</div>
      </div>
      {/* </div> */}
    </>
  );
}

export default NameTag;
