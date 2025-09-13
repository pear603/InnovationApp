// ShowDailyGoal.jsx
// Controlled checkbox for daily goal display
function ShowDailyGoal({ checked, onChange }) {
  return (
    <label className="flex items-center space-x-2 mt-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 border-gray-300 rounded checked:bg-green-600"
      />
      <span className="text-[16px] text-black">Show Daily Goal</span>
    </label>
  );
}

export default ShowDailyGoal;
