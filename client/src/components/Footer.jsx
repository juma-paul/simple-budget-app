export default function Footer() {
  return (
    <footer className="px-4 text-[0.50rem] tablet:text-xs bg-white-bg h-12 tablet:h-14 laptop:h-16 flex items-center justify-between">
      {/* Left side: Copyright */}
      <div className="flex items-center space-x-1.5">
        <span>&copy; {new Date().getFullYear()}</span>
        <span className="w-px h-2.5 bg-black opacity-50"></span>
        <span>Alquatra LLC.</span>
        <span className="w-px h-2.5 bg-black opacity-50"></span>
        <span>All rights reserved.</span>
      </div>

      {/* Right side: Links */}
      <div className="flex flex-col">
        <a href="/terms" className="hover:underline hover:text-orange-txt">
          Terms of service
        </a>
        <a href="/privacy" className="hover:underline hover:text-orange-txt">
          Privacy policy
        </a>
      </div>
    </footer>
  );
}
