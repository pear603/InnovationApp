import { supabase } from "../assets/supabaseClient"; 

export const TagService = {
  // Validate tag length (< 20 chars)
  validateTagName: (tagName) => {
    const trimmed = tagName.trim();
    if (!trimmed) return { valid: false, error: "Tag name cannot be empty" };
    if (trimmed.length > 20) return { valid: false, error: "Tag name must be less than 20 characters" };
    return { valid: true };
  },

  // Fetch tags for a user
  getTagName: async (userId) => {
    const { data, error } = await supabase
      .from("Tag")
      .select("User_id, Name")
      .eq("User_id", userId);
    if (error) throw new Error(error.message);
    return data.map(tag => ({
    id: tag.Tag_id,
    name: tag.Name
  }));
  },

  // Check uniqueness
checkUnique: (tagName, tagList,globalTags) => {
    const normalizedInput = tagName.trim().toLowerCase();
  const existsInUserTags  = tagList.some(
    (tag) => (tag.Name || tag.name).toLowerCase() === normalizedInput
  );
  const existsInGlobalTags = globalTags.some(
    (tag) => (tag.Name || tag.name).toLowerCase() === normalizedInput
  );

  return !(existsInUserTags || existsInGlobalTags);
},

  // Create a tag
  createTag: async (tagName, userId) => {
    const trimmed = tagName.trim();
    const newTagId = crypto.randomUUID();
    const { data, error } = await supabase
      .from("Tag")
      .insert([{ Tag_id: newTagId ,Name: trimmed, User_id: userId }])
      .select("User_id, Name"); // return inserted row
    if (error) throw new Error(error.message);
    return {
    id: data[0].Tag_id,
    name: data[0].Name
    };
  },
};
