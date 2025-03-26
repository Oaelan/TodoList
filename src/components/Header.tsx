import Link from "next/link";
import Image from "next/image";
//헤더 컴포넌트
function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-[7%] lg:px-[21%] py-4">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Image
            src="/img/Size=Large@3x.png"
            alt="logo"
            width={100}
            height={100}
            className="hidden md:block"
          />
          <Image
            src="/img/Size=Small.png"
            alt="logo"
            width={50}
            height={50}
            className="block md:hidden"
          />
        </Link>
      </div>
    </header>
  );
}

export default Header;
