import React, { useState } from 'react'

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name || !form.email || !form.message) return

    setSubmitted(true)
  }

  const contacts = [
    {
      icon: '📍',
      label: 'Location',
      value: 'FC Road, Pune',
      sub: 'Open for dine-in',
    },
    {
      icon: '📞',
      label: 'Phone',
      value: '+91 98765 43210',
      sub: '10 AM - 11 PM',
    },
    {
      icon: '✉️',
      label: 'Email',
      value: 'hello@flavorrush.in',
      sub: 'Reply within 2 hrs',
    },
  ]

  const subjects = [
    'General',
    'Order Issue',
    'Feedback',
    'Partnership',
    'Bulk Order',
  ]

  return (
    <div className="min-h-screen bg-[#fff8f3] overflow-x-hidden">

      <style>{`
        .input-field {
          width: 100%;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 13px 16px;
          font-size: 14px;
          color: #111827;
          outline: none;
          transition: all 0.25s ease;
        }

        .input-field:focus {
          border-color: #ff6b35;
          box-shadow: 0 0 0 4px rgba(255,107,53,0.10);
        }

        .input-field::placeholder {
          color: #9ca3af;
        }

        .glass {
          backdrop-filter: blur(10px);
          background: rgba(255,255,255,0.08);
        }

        .card-hover {
          transition: all 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 35px rgba(0,0,0,0.08);
        }

        @keyframes float {
          0%,100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121826] via-[#1d2940] to-[#0f172a] pt-20 pb-28 px-6">

        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative z-10">

          <div className="inline-flex items-center gap-2 glass border border-white/10 text-orange-300 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            ✨ CONTACT US
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
            Let’s Start a
            <br />
            <span className="text-orange-300">
              Conversation
            </span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-8">
            Questions, feedback, business enquiries or order issues —
            our team is always ready to help you.
          </p>

          <div className="mt-10 flex justify-center gap-5 text-4xl">
            {['🍕', '🍔', '🍟', '🌮', '🥤'].map((item, i) => (
              <span
                key={i}
                className="float"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="max-w-6xl mx-auto px-6 -mt-10 relative z-20 mb-16">
        <div className="grid sm:grid-cols-3 gap-5">

          {contacts.map((c, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 shadow-lg border border-orange-50 card-hover"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-2xl mb-4">
                {c.icon}
              </div>

              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                {c.label}
              </p>

              <h3 className="text-lg font-semibold text-gray-800">
                {c.value}
              </h3>

              <p className="text-sm text-[#ff6b35] mt-1">
                {c.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN SECTION */}
      <section className="max-w-6xl mx-auto px-6 pb-20 grid lg:grid-cols-5 gap-8">

        {/* FORM */}
        <div className="lg:col-span-3">

          <div className="bg-white rounded-[30px] p-7 sm:p-9 shadow-xl border border-orange-50">

            {!submitted ? (
              <>

                <div className="mb-7">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Send Message
                  </h2>

                  <p className="text-gray-400 text-sm">
                    Fill out the form and our support team will contact you soon.
                  </p>
                </div>

                <div className="space-y-5">

                  <div className="grid sm:grid-cols-2 gap-4">

                    <div>
                      <label className="text-sm font-medium text-gray-600 block mb-2">
                        Full Name *
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Rahul Sharma"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600 block mb-2">
                        Phone Number
                      </label>

                      <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Email Address *
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="rahul@email.com"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-3">
                      Select Subject
                    </label>

                    <div className="flex flex-wrap gap-2">

                      {subjects.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setForm({ ...form, subject: s })}
                          className={`px-4 py-2 rounded-full text-sm transition-all border ${
                            form.subject === s
                              ? 'bg-[#ff6b35] text-white border-[#ff6b35]'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-[#ff6b35]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Message *
                    </label>

                    <textarea
                      rows={5}
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      className="input-field resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-[#ff6b35] to-[#f59e0b] text-white py-4 rounded-2xl font-semibold text-sm hover:shadow-xl hover:shadow-orange-200 transition-all duration-300"
                  >
                    Send Message 🚀
                  </button>
                </div>
              </>
            ) : (
              <div className="py-12 text-center">

                <div className="text-6xl mb-5">
                  ✅
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Message Sent!
                </h2>

                <p className="text-gray-500 text-sm max-w-sm mx-auto leading-7 mb-8">
                  Thanks <span className="text-[#ff6b35] font-semibold">{form.name}</span>.
                  Our support team will reply shortly at
                  <strong> {form.email}</strong>
                </p>

                <button
                  onClick={() => {
                    setSubmitted(false)
                    setForm({
                      name: '',
                      email: '',
                      phone: '',
                      subject: '',
                      message: '',
                    })
                  }}
                  className="bg-orange-50 text-[#ff6b35] px-7 py-3 rounded-full text-sm font-medium hover:bg-orange-100 transition-all"
                >
                  Send Another
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* MAP */}
          <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-[30px] h-56 flex flex-col items-center justify-center border border-orange-200 card-hover">

            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shadow-md mb-4">
              📍
            </div>

            <h3 className="text-lg font-semibold text-gray-800">
              FC Road, Pune
            </h3>

            <p className="text-sm text-[#ff6b35] mt-1">
              Open in Google Maps →
            </p>
          </div>

          {/* WORKING HOURS */}
          <div className="bg-[#111827] rounded-[30px] p-7 text-white">

            <h3 className="text-xl font-semibold mb-5 flex items-center gap-2">
              🕐 Working Hours
            </h3>

            <div className="space-y-4">

              {[
                { day: 'Monday - Friday', time: '10 AM - 11 PM' },
                { day: 'Saturday', time: '9 AM - 11:30 PM' },
                { day: 'Sunday', time: '9 AM - 10 PM' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b border-gray-700 pb-3 last:border-none"
                >
                  <span className="text-sm text-gray-400">
                    {item.day}
                  </span>

                  <span className="text-sm text-orange-300 font-medium">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SOCIAL */}
          <div className="bg-white rounded-[30px] p-7 shadow-lg border border-orange-50">

            <h3 className="text-xl font-semibold text-gray-900 mb-5">
              Follow Us 🎉
            </h3>

            <div className="grid grid-cols-2 gap-3">

              {[
                {
                  platform: 'Instagram',
                  handle: '@flavorrush',
                  emoji: '📸',
                  color: 'bg-pink-50 text-pink-500',
                },
                {
                  platform: 'WhatsApp',
                  handle: 'Chat Support',
                  emoji: '💬',
                  color: 'bg-green-50 text-green-600',
                },
                {
                  platform: 'Twitter/X',
                  handle: '@flavorrush',
                  emoji: '🐦',
                  color: 'bg-gray-50 text-gray-700',
                },
                {
                  platform: 'Facebook',
                  handle: 'FlavorRush',
                  emoji: '👍',
                  color: 'bg-blue-50 text-blue-600',
                },
              ].map((s, i) => (
                <button
                  key={i}
                  className={`${s.color} rounded-2xl p-4 text-left transition-all hover:scale-[1.03]`}
                >
                  <div className="text-2xl mb-2">
                    {s.emoji}
                  </div>

                  <div className="text-sm font-semibold">
                    {s.platform}
                  </div>

                  <div className="text-xs opacity-70 mt-1">
                    {s.handle}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#111827] py-16 px-6">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">
              Frequently Asked Questions
            </h2>

            <p className="text-gray-400 text-sm">
              Quick answers to common questions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {[
              {
                q: 'How can I track my order?',
                a: 'You’ll receive a live tracking link via SMS after confirmation.',
              },
              {
                q: 'Can I edit my order later?',
                a: 'Yes, within 5 minutes after placing the order.',
              },
              {
                q: 'Do you accept bulk orders?',
                a: 'Yes! We provide catering for parties, offices and events.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-orange-400/40 transition-all"
              >
                <h3 className="text-white font-semibold mb-3">
                  {faq.q}
                </h3>

                <p className="text-gray-400 text-sm leading-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact