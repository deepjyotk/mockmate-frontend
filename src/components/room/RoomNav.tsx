interface RoomNavProps {
  navbarRoleText: string;
  handleSwapRole: () => void;
}

const RoomNav = ({ navbarRoleText, handleSwapRole }: RoomNavProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 flex justify-between items-center z-50 shadow-lg border-b border-blue-600">
      <span className="font-bold text-lg tracking-wide">
        {navbarRoleText}
      </span>
      <button
        className="px-4 py-2 bg-white text-blue-600 font-medium rounded-lg shadow hover:bg-blue-50 transition duration-300 ease-in-out"
        onClick={handleSwapRole}
      >
        Swap Role
      </button>
    </nav>
  );
};

export default RoomNav;