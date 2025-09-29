import "../../tailwind.css";
import { supabase } from "../../assets/supabaseClient";
import { useEffect, useState } from "react";

function SelectTag({ onTagSelect }) {
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

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
    onTagSelect(e.target.value);
  };

  return (
    <>
      <div className="relative group">
        <h1 className="flex flex-col text-[15px] font-[400]">
          Select Tag
          <select
            className="flex flex-row text-[14px] drop-shadow-lg justify-left bg-white-500 w-full h-8 rounded-[8px] text-black border border-black/15 hover:bg-[#E7EBEE] focus:outline-none mt-[4px] pl-3 pb-1 text-opacity-[0]"
            id="tags"
            value={selectedTag}
            onChange={handleTagChange}
          >
            <option key="default" value="" disabled hidden>Tag</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
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