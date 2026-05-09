import { Link } from 'react-router-dom'

const steps = [
  {
    num: 1,
    title: 'Education',
    text: 'Learn how to visit responsibly — including Leave No Trace and digital Leave No Trace practices.',
  },
  {
    num: 2,
    title: 'Stewardship',
    text: 'Take simple, meaningful actions that protect springs and keep them healthy for future visitors.',
  },
  {
    num: 3,
    title: 'Community',
    text: 'Join a growing network of visitors who care for these places and hold each other accountable.',
  },
  {
    num: 4,
    title: 'Action',
    text: 'Complete a Stewardship Check‑In, report issues, and earn recognition for your care.',
  },
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-badge">Community Conservation</div>
        <h1>Stewards of the Springs</h1>
        <p>Preserving Natural Hot Springs Through Community Stewardship</p>
        <div className="hero-buttons">
          <Link to="/stewardship" className="btn btn-primary">Stewardship Check‑In</Link>
          <Link to="/stewardship#report" className="btn btn-outline">Report an Issue / Maintenance Need</Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Process</h2>
            <p>Four steps that turn every visitor into an active caretaker of the springs.</p>
          </div>
          <div className="process-grid">
            {steps.map(s => (
              <div key={s.num} className="process-card">
                <div className="step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="mission-inner">
          <h2>Our Mission</h2>
          <p>
            Stewards of the Springs protects long‑term public access to natural hot springs by
            promoting responsible recreation, digital Leave No Trace, and visitor‑powered
            stewardship. We believe that the people who love these places are best positioned
            to protect them.
          </p>
          <Link to="/stewardship" className="btn btn-teal">Explore Stewardship</Link>
        </div>
      </section>

      <div className="cta-band">
        <h2>Ready to Make a Difference?</h2>
        <p>Every visit is an opportunity to leave the springs better than you found them.</p>
        <div className="cta-buttons">
          <Link to="/stewardship" className="btn btn-primary">Stewardship Check‑In</Link>
          <Link to="/about" className="btn btn-outline">Learn More</Link>
        </div>
      </div>
    </>
  )
}
