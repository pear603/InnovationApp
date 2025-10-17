import "../tailwind.css";
import NameTag from "../components/NameTag";
import Panel from "../components/Panel";
import CreateButton from "../components/CreateButton";
import { TagService } from "../components/TagService";
import {useState, useEffect} from "react";
import { supabase } from "../assets/supabaseClient";
import { useNavigate } from "react-router-dom";

function AddTag() {
  const [tagName, setTagName] = useState("");
  const [tags, setTags] = useState([]);
  const [globalTags, setGlobalTags] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndTags = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const userTags = await TagService.getTagName(user.id);
        setTags(userTags);

        const globalTags = await TagService.getTagName('a8813d89-f7d1-4fc8-8bc9-f5de207d737d');
        setGlobalTags(globalTags);
      }

      
    };
    fetchUserAndTags();
  }, []);

  const handleCreateTag = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user) return;

    // Validate
    const validation = TagService.validateTagName(tagName);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    // Check uniqueness
    const isUnique = TagService.checkUnique(tagName, tags, globalTags);
    if (!isUnique) {
      setError("This tag already exists");
      return;
    }

    // Create tag
    try {
      const newTag = await TagService.createTag(tagName, user.id);
      setTags([...tags, newTag]);
      setTagName("");
      setError("");
      alert("Tag created successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClose = () => {
    navigate("/walletlist");
  };
      
  return (
    <>
      <Panel Height="h-[240px]" onClose={handleClose}>
        <div className="pl-[43px] pr-[29px] pt-[12px] gap-[16px]">
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <NameTag value={tagName} onChange={setTagName}>
            <CreateButton onClick={handleCreateTag} />
          </NameTag>
        </div>
      </Panel>
    </>
  );
}

export default AddTag;
