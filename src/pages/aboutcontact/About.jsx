import React from 'react'
import { useNavigate } from 'react-router-dom'
const About = () => {


  const navigate = useNavigate()

  const stats = [
    { number: '12K+', label: 'Happy Customers' },
    { number: '350+', label: 'Menu Items' },
    { number: '98%', label: 'Satisfaction Rate' },
    { number: '30min', label: 'Avg Delivery' },
  ]

  const team = [
    { name: 'Arjun Mehta', role: 'Head Chef', emoji: '👨‍🍳', color: 'bg-orange-100' },
    { name: 'Priya Sharma', role: 'Founder & CEO', emoji: '👩‍💼', color: 'bg-yellow-100' },
    { name: 'Ravi Patel', role: 'Delivery Manager', emoji: '🛵', color: 'bg-red-100' },
  ]

  const values = [
    {
      icon: '🌿',
      title: 'Fresh Ingredients',
      desc: 'We source locally every morning. No frozen, no compromise.',
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      desc: 'Hot food at your door in under 30 minutes, guaranteed.',
    },
    {
      icon: '❤️',
      title: 'Made with Love',
      desc: 'Every dish is crafted with the same care as home cooking.',
    },
    {
      icon: '🔒',
      title: 'Safe & Hygienic',
      desc: 'FSSAI certified kitchen with top-tier hygiene standards.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#FFF8F0] overflow-x-hidden">
      <style>{`
        .clip-diagonal {
          clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
        }

        .card-hover {
          transition: all 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }

        @keyframes float {
          0%,100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section */}
      <section className="clip-diagonal bg-gradient-to-r from-[#FF6B35] to-[#F7A928] pt-16 pb-28 px-6 relative rounded-3xl overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-full mb-5">
            Our Story
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
            Food That Feels
            <br />
            <span className="italic text-yellow-100">
              Like Home
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/90 max-w-xl mx-auto leading-8">
            Started in a tiny Pune kitchen in 2026, we've grown into a family
            of food lovers delivering joy — one plate at a time.
          </p>

          <div className="mt-8 flex justify-center gap-5 text-4xl">
            {['🍕', '🍜', '🌮', '🍱', '🍔'].map((e, i) => (
              <span
                key={i}
                className="float"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {e}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto -mt-10 px-6 mb-16">
        <div className="bg-white rounded-2xl shadow-lg grid grid-cols-2 sm:grid-cols-4 overflow-hidden border border-orange-100">
          {stats.map((s, i) => (
            <div
              key={i}
              className="p-5 text-center border-r border-b sm:border-b-0 border-orange-100 last:border-r-0"
            >
              <div className="text-3xl font-bold text-[#FF6B35]">
                {s.number}
              </div>

              <div className="text-sm text-gray-500 mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-5xl mx-auto px-6 mb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-[#FF6B35] font-semibold text-sm uppercase tracking-wider">
            Who We Are
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-5 leading-snug">
            Passion Plated,
            <br />
            <span className="text-[#FF6B35]">
              Delivered Warm
            </span>
          </h2>

          <p className="text-gray-600 text-base leading-7 mb-4">
            What started as a side hustle by two friends who loved cooking became Pune's most loved food delivery service.
          </p>

          <p className="text-gray-600 text-base leading-7">
            Our kitchen runs with a simple rule:
            <strong className="text-gray-800">
              {' '}cook as if you're feeding your family.
            </strong>
          </p>

          <button onClick={()=>navigate("/menu")} className="mt-7 cursor-pointer bg-[#FF6B35] hover:bg-[#e65b29] text-white px-7 py-3 rounded-full text-sm font-medium transition-all">
            See Our Menu →
          </button>
        </div>

        <div className="relative">
          <div className="bg-gradient-to-br from-orange-400 to-yellow-400 rounded-3xl h-72 flex items-center justify-center text-7xl shadow-xl card-hover">
            🍽️
          </div>

          <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-md px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">⭐</span>

            <div>
              <div className="font-bold text-gray-800 text-lg">
                4.9 / 5
              </div>

              <div className="text-gray-400 text-xs">
                8,200+ Reviews
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-900 rounded-2xl py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#F7A928] text-sm font-semibold uppercase tracking-wider">
              Our Promise
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
              What We Stand For
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-2xl p-5 border border-gray-700 card-hover"
              >
                <div className="text-4xl mb-4">
                  {v.icon}
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {v.title}
                </h3>

                <p className="text-sm text-gray-400 leading-6">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-[#FF6B35] text-sm font-semibold uppercase tracking-wider">
            The People
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
            Meet the Team
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {team.map((m, i) => (
            <div
              key={i}
              className={`${m.color} rounded-2xl p-6 text-center card-hover`}
            >
              <div className="text-5xl mb-4">
                {m.emoji}
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                {m.name}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {m.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-6 mb-10 rounded-3xl bg-gradient-to-r from-[#FF6B35] to-[#F7A928] p-10 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Hungry Yet? 😋
        </h2>

        <p className="text-white/90 text-base mb-7">
          Order now and get your first delivery free.
        </p>

        <button className="bg-white text-[#FF6B35] px-8 py-3 rounded-full text-sm font-semibold hover:bg-orange-50 transition-all">
          Order Now 🚀
        </button>
      </section>
    </div>
  )
}

export default About