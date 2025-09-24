import "../../tailwind.css";
import { Link } from "react-router-dom";
import { supabase } from "../../assets/supabaseClient";
import { useEffect, useState } from "react";
function SelectTag() {
  const [fetchError, setFetchError] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase
        .from("Tag") 
        .select("Tag_id, Name");
      if (error) {
        setFetchError("Error fetching tags:");
        setTags(null);
        console.log(error);
      } else if (data) {
        const tagsWithId = data.map((tag) => ({
            id: tag.Tag_id,
            name: tag.Name
      }));
        setTags(tagsWithId);
        setFetchError(null);
      }
    };

    fetchTags();
  }, []);

  return (
    <>
      <div class="relative group">
        <h1 class="flex flex-col text-[15px] font-[400]">
          Select Tag
          {/* <button class="flex flex-row text-[14px] drop-shadow-lg justify-left bg-white-500 w-full h-8 rounded-[8px] text-black rounded border border-black/15 hover:bg-blue-400 focus:outline-none mt-[4px] pl-3 pt-[4px] text-opacity-[0]">
                Tags
                <span class="pt-1 pl-35 text-[10px]"> V</span>
            </button>
            <div class=" absolute z-50 hidden group-hover:block bg-white shadow-lg rounded-[8px] border border-black/25 mt-15 w-40">
                <a href="#" class="block px-4 py-2 pl-3 text-gray-800 rounded-[4px] hover:bg-blue-400 hover:text-white">Tag 1</a>
                <a href="#" class="block px-4 py-2 pl-3 text-gray-800 rounded-[4px] hover:bg-blue-400 hover:text-white">Tag 2</a>
                <a href="#" class="block px-4 py-2 pl-3 text-gray-800 rounded-[4px] hover:bg-blue-400 hover:text-white">Tag 3</a>
            </div> */}

          {/* <select class="flex flex-row text-[14px] drop-shadow-lg justify-left bg-white-500 w-full h-8 rounded-[8px] text-black rounded border border-black/15 hover:bg-blue-400 focus:outline-none mt-[4px] pl-3 pt-[4px] text-opacity-[0]">
            <option value="">Tag1</option>
          </select> */}


    <select class="flex flex-row text-[14px] drop-shadow-lg justify-left bg-white-500 w-full h-8 rounded-[8px] text-black border border-black/15 hover:bg-[#E7EBEE] focus:outline-none mt-[4px] pl-3 pt-[4px] text-opacity-[0]"
        id="tags"
        value={selectedTag}
        onChange={(e) => setSelectedTag(e.target.value)}
      >
        <option value="" disabled hidden>Tag</option>
        {tags.map((tag) => (
          <option key={tag.Tag_id} value={tag.Name}>
            {tag.name}
          </option>
        ))}
      </select>
        </h1>
      </div>
    </>
  );
}

export default SelectTag;
