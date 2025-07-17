import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="bg-dark-blue min-h-[44vh] tablet:min-h-[35vh] laptop:min-h-[30vh]"></section>

      {/* Divider with line + center content */}
      <div className="flex items-center h-0 z-50">
        {/* Left: line */}
        <div className="flex-1 h-0.5 bg-white-bg"></div>

        {/* Middle: content with split background */}
        <span
          className="px-4 text-white-txt uppercase font-roboto-flex text-3xl tablet:text-4xl"
          style={{
            background: "linear-gradient(to bottom,#04254b 50%, #00488c 50%)",
          }}
        >
          The <span className="text-orange-txt font-belanosima text-3xl tablet:text-[2.45rem]">Simple</span>
          <p>Budget App</p>
        </span>

        {/* Right: line */}
        <div className="flex-1 h-0.5 bg-white-bg"></div>
      </div>

      <section className="bg-light-blue min-h-[50vh] tablet:min-h-[55vh] laptop:min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
        <p className="text-white-txt text-[0.75rem] tablet:text-[1rem]">
          Never Overspend Again
        </p>
        <Link
          to="/login"
          className="text-white-txt text-[0.5rem] tablet:text-[0.75rem] bg-orange-bg px-2 py-1 hover:text-white-bg"
        >
          Start Budgeting
        </Link>
      </section>
    </>
  );
}
