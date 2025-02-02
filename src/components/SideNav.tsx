// components/SideNav.tsx
const SideNav: React.FC = () => {
    return (
      <div className="w-64 h-full bg-gray-900 text-white p-4 fixed left-0 top-0">
        <h2 className="text-xl font-bold">Polycoin</h2>
        <ul className="mt-4 space-y-2">
          <li><a href="#" className="block px-2 py-1">Home</a></li>
          <li><a href="#" className="block px-2 py-1">Predict</a></li>
          <li><a href="#" className="block px-2 py-1">Question</a></li>
        </ul>
      </div>
    );
  };
  
  export default SideNav;