import "../tailwind.css";

function WalletIcon({ image, onChange }) {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      onChange(localUrl, file); // ส่ง preview + File object
    }
  };

  return (
    <label className="w-[173px] h-[173px] bg-[#C3C0C0] shadow-[0_4px_6px_rgba(0,0,0,0.2)] rounded-lg flex justify-center items-center cursor-pointer overflow-hidden">
      {image && <img src={image} alt="Wallet Icon" className="object-cover w-full h-full" />}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </label>
  );
}

export default WalletIcon;
