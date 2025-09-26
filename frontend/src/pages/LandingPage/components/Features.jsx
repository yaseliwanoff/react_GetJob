import { jobSeekerFeatures } from "../../../utils/data";

const Features = () => {
  return (
    <section className="container mx-auto px-4">
      <div className="">
        <div className="">
          <h2 className="text-5xl mb-4 flex flex-col items-center text-center font-bold tracking-tight">
            <span>Everything <span className="font-medium italic">You Need</span></span>
            <span>
              to{" "}
              <span className="bg-green-400 inline-block text-green-900 rounded-[20px] px-3 py-1 w-fit">
                Success
              </span>
            </span>
          </h2>
          <p className="text-white/70 max-w-[400px] text-center flex mx-auto mb-5">
            Whether you're looking for your next opportunity or the perfect
            candidate, we have the tools and features to make it happen.
          </p>
        </div>

        <div className="">
          <div>
            <div className="">
              <h3 className="text-3xl font-semibold tracking-tight mb-4">For Job Seekers</h3>
              <div className=""></div>
            </div>
            <div className="grid items-stretch grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {jobSeekerFeatures.map((feature, index) => (
                <div key={index} className="bg-white/5 cursor-default md:hover:shadow-white/30 shadow-2xl md:hover:bg-white/90 md:hover:text-black transition-all duration-300 border border-white/10 rounded-[10px] px-5 py-5">
                  <div className="mb-3">
                    <feature.icon className="" />
                  </div>
                  <div>
                    <h4 className="text-[18px] font-medium mb-1">
                      {feature.title}
                    </h4>
                  </div>
                  <div className="opacity-70">
                    <p className="text-[14px] font-normal">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features;
