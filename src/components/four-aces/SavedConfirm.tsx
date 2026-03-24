import Btn from "./shared/Btn";

interface SavedConfirmProps {
  onNew: () => void;
  onHistory: () => void;
}

export default function SavedConfirm({ onNew, onHistory }: SavedConfirmProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8 text-center">
      <div className="text-[56px] mb-4">✅</div>
      <h3 className="font-4a-serif text-[26px] font-semibold mb-2">Decision saved</h3>
      <p className="text-4a-text-sec text-[15px] mb-8">Nice work. You can review it anytime.</p>
      <div className="flex flex-col gap-3">
        <Btn onClick={onNew}>Make another decision</Btn>
        <Btn variant="secondary" onClick={onHistory}>View past decisions</Btn>
      </div>
    </div>
  );
}
