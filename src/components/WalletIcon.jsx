import { useState } from "react";
import "../tailwind.css";

function WalletIcon() {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); 
    }
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <label className="w-[173px] h-[173px] bg-[#C3C0C0] rounded-lg flex justify-center items-center cursor-pointer overflow-hidden">
          {image ? (
            <img
              src={image}
              alt="Wallet Icon"
              className="object-cover w-full h-full"
            />
          ) : null}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>
    </>
  );
}

export default WalletIcon;
