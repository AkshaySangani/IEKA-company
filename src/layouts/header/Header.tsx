import AdminMenu from "./AdminMenu";

interface HeaderProps {
  setIsOpen?: (open: boolean) => void;
  isOpen?: boolean;
}

const Header = ({ setIsOpen, isOpen }: HeaderProps) => {
  return (
    <header
      id="header"
      className={`
        sticky top-0 right-0 z-[999]
        flex h-[60px]
        items-center justify-between
        border-b border-[#ccc]
        bg-white
        px-[20px]
        transition-all duration-300

        lg:px-[20px]
        max-[991px]:left-0
        max-[991px]:w-full
        max-[991px]:px-[15px]

        ${isOpen ? "left-[250px] w-[calc(100%-250px)]" : "left-0 w-full"}
      `}
    >
      <div className="flex min-w-0 items-center">
        <div
          id="sidebarToggle"
          onClick={() => setIsOpen?.(!isOpen)}
          className="cursor-pointer p-[5px] text-[1.2rem] text-[#333]"
        >
          <i className="fas fa-bars" />
        </div>

        {/* Mobile Page Title */}

        <div className="ml-3 min-w-0 max-[991px]:block lg:hidden">
          <h1 className="truncate text-lg font-semibold text-black">Here title</h1>
        </div>
      </div>

      <div className="flex items-center">
        <AdminMenu />
      </div>
    </header>
  );
};

export default Header;
