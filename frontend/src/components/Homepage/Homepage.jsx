import React from "react";
import Register from "../../Users/Register";
import PublicPosts from "../Posts/PublicPosts";

const Homepage = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 via-white to-white min-h-screen">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-white py-20 xl:pt-24 xl:pb-32"
        style={{
          backgroundImage: 'url("flex-ui-assets/elements/pattern-white.svg")',
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-16 lg:gap-24">
            {/* Left Content */}
            <div className="lg:w-1/2">
              <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold text-white bg-green-500 uppercase rounded-full tracking-widest shadow-lg">
                Header
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-coolGray-900 tracking-tight leading-tight mb-6">
                A small business is only as good as its tools.
              </h1>
              <p className="text-lg md:text-xl text-coolGray-600 font-medium mb-10 max-w-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sequi perferendis molestiae non nemo doloribus. Doloremque, nihil! At ea atque quidem!
              </p>
              <ul className="space-y-5 max-w-md">
                {[
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                  "Suspendisse mollis tincidunt.",
                  "Praesent varius justo vel justo pulvinar.",
                ].map((text, idx) => (
                  <li key={idx} className="flex items-center gap-4">
                    <img
                      className="w-7 h-7 flex-shrink-0"
                      src="flex-ui-assets/elements/checkbox-green.svg"
                      alt="Checkmark"
                    />
                    <p className="text-lg text-coolGray-600 font-medium">{text}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Register Form */}
            <div className="w-full lg:w-5/12 max-w-lg">
              <Register />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <PublicPosts />

      {/* Optional Footer or Additional Sections */}
    </div>
  );
};

export default Homepage;
