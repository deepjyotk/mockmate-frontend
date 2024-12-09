/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">MockMate</h1>
        <ul className="flex space-x-4">
          {/* <Link href="/" className="text-foreground hover:text-primary">Courses</Link>
          <Link href="/" className="text-foreground hover:text-primary">Questions</Link>
          <Link href="/" className="text-foreground hover:text-primary">Peer Mocks</Link> */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
