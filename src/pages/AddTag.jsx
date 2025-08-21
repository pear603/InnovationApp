import "../tailwind.css";
import NameTag from "../components/NameTag";
import Panel from "../components/Panel";
import CreateButton from "../components/CreateButton";

function AddTag() {
  return (
    <>
      <Panel Height="h-[240px]">
        <div className=" pl-[43px] pr-[29px] pt-[12px] gap-[16px]">
          <NameTag>
            <CreateButton />
          </NameTag>
        </div>
      </Panel>
    </>
  );
}

export default AddTag;
