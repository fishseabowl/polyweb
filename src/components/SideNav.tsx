// components/SideNav.tsx
const SideNav: React.FC<{ onSelect: (page: string) => void }> = ({
  onSelect,
}) => {
  return (
    <div className="w-32 h-full bg-gray-900 text-white p-4 fixed left-0 top-0">
      <h2 className="text-xl font-bold">PolyIChain</h2>
      <ul className="mt-4 space-y-2">
        <li>
          <button
            onClick={() => onSelect("home")}
            className="block px-2 py-1 w-full text-left"
          >
            Home
          </button>
        </li>
        <li>
          <button
            onClick={() => onSelect("prediction")}
            className="block px-2 py-1 w-full text-left"
          >
            Prediction
          </button>
        </li>
        <li>
          <button
            onClick={() => onSelect("question")}
            className="block px-2 py-1 w-full text-left"
          >
            Question
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SideNav;
