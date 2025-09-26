import { motion } from 'framer-motion';
import { TrendingUp, Users, Briefcase, Target } from "lucide-react"

const Analytics = () => {
  const stats = [
    {
      icon: Users,
      title: "Active users",
      value: "2.4M+",
      growth: "+15%",
    },
    {
      icon: Briefcase,
      title: "Jobs posted",
      value: "150K+",
      growth: "+5%",
    },
    {
      icon: Target,
      title: "Successful hires",
      value: "89K+",
      growth: "+26%",
    },
    {
      icon: TrendingUp,
      title: "Match rate",
      value: "94K+",
      growth: "+5%",
    },
  ]

  return (
    <section className="container mx-auto px-4">
      <div className='bg-white/0 border border-white/10 rounded-[30px] w-full px-10 py-10'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className=""
        >
          <h2 className="text-5xl mb-4 flex flex-col items-center text-center font-bold tracking-tight">
            Platform
            <span className='bg-orange-300 mt-1 inline-block text-orange-700 rounded-[20px] px-3 py-1 w-fit'>
              Analytics
            </span>
          </h2>
          <p className="text-white/70 max-w-[400px] text-center flex mx-auto mb-5">
            Real-time insights and data-driven results that showcase the power of our platform in connecting talent with opporutions.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-[10px] px-3.5 py-3.5"
            >
              <div className="">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-black/60 shadow-md shadow-black/30 border border-gray-400/30 rounded-[10px] px-2 py-2">
                    <stat.icon width={20} height={20} />
                  </div>
                  <span className="text-[12px] text-green-100 border border-green-500/25 rounded-full px-2 py-0.5 bg-green-300/10">
                    {stat.growth}
                  </span>
                </div>
                <h3 className="text-[20px] font-semibold">{stat.title}</h3>
                <p className="text-md opacity-60">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Analytics;
