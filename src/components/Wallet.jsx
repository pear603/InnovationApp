import "../tailwind.css";

function Wallet({ name, imageUrl }) {
  return (
    <div className="flex flex-col gap-[12px] items-center">
      <div className="w-[189px] h-[189px] bg-[#FFFFFF] rounded-lg flex justify-center items-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-[173px] h-[173px] rounded-lg"
          />
        ) : (
          <div className="w-[173px] h-[173px] bg-[#C3C0C0] rounded-lg flex items-center justify-center">
            No Image
          </div>
        )}
      </div>
      <div className="text-lg font-medium">{name}</div>
    </div>
  );
}

export default Wallet;
