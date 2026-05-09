export default function About() {
  return (
    <>
      <section className="page-hero">
        <h1>About Us</h1>
        <p>A community-driven effort to protect natural hot springs for generations to come.</p>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Who We Are</h2>
              <p>
                Stewards of the Springs is a volunteer-led organization dedicated to preserving
                public access to natural hot springs through responsible recreation and
                visitor-powered stewardship.
              </p>
              <p>
                We work directly with land managers, conservation groups, and the public to
                create a culture of care around these fragile and irreplaceable natural resources.
              </p>
              <p>
                Our Stewardship Check‑In system lets every visitor document their visit,
                log stewardship actions, and report issues — building a real-time picture
                of spring health across the region.
              </p>
            </div>
            <div className="about-image">♨️</div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Our Values</h2>
          </div>
          <div className="card-grid">
            <div className="card">
              <div className="card-icon">🌊</div>
              <h3>Leave No Trace</h3>
              <p>We promote responsible recreation principles including digital Leave No Trace to reduce overcrowding caused by social media.</p>
            </div>
            <div className="card">
              <div className="card-icon">🤝</div>
              <h3>Community First</h3>
              <p>We believe the people who love these places are best positioned to protect them.</p>
            </div>
            <div className="card">
              <div className="card-icon">📊</div>
              <h3>Data-Driven Care</h3>
              <p>We collect real stewardship data to demonstrate impact and advocate for resources with land managers.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
