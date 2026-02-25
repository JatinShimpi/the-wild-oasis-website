import Link from "next/link";
import Image from "next/image";


function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 sm:gap-4 z-10">
      <Image src="/logo.png" height="60" width="60" alt="The Wild Oasis logo" className="h-10 w-10 sm:h-[60px] sm:w-[60px]" />
      <span className="text-base sm:text-xl font-semibold text-primary-100">
        The Wild Oasis
      </span>
    </Link>
  );
}

export default Logo;
