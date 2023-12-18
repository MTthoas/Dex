import React from "react";

export default function Landpage() {
  return (
    <div>
      <section className="bg-blue gradiant">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12 mt-24">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl ">
            Every penny <span className="text-green">counted</span>, every
            action <span className="text-green">visible. </span>
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 ">
            Enlightening the path of generosity with clarity and trust.
          </p>
          <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <p className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg bg-green text-white">
              {/* <img src={Love} className="w-5 h-5 mr-3 mt-1"/> */}
              Support projects
            </p>
            <p className="inline-flex justify-center items-center py-3 px-5 text-dark border rounded-lg">
              Learn more
            </p>
          </div>
          @
        </div>
      </section>

      <section className="mb-24">
        <div className="max-w-screen-xl px-5 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-5"></div>
        </div>
      </section>
    </div>
  );
}
