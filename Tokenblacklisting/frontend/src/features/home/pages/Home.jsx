import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../auth/style/Home.css";

gsap.registerPlugin(ScrollTrigger);

// function Home() {
//   const heroRef = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline();

//       tl.from(".hero-badge", {
//         y: 30,
//         opacity: 0,
//         duration: 0.7,
//       })
//         .from(".hero-title", {
//           y: 80,
//           opacity: 0,
//           duration: 1,
//           ease: "power4.out",
//         }, "-=0.4")
//         .from(".hero-description", {
//           y: 30,
//           opacity: 0,
//           duration: 0.7,
//         }, "-=0.5")
//         .from(".hero-buttons", {
//           y: 30,
//           opacity: 0,
//           duration: 0.7,
//         }, "-=0.4")
//         .from(".hero-stack span", {
//           y: 20,
//           opacity: 0,
//           stagger: 0.08,
//           duration: 0.4,
//         }, "-=0.3");

//       gsap.from(".section-title", {
//         scrollTrigger: {
//           trigger: ".about-section",
//           start: "top 80%",
//         },
//         y: 60,
//         opacity: 0,
//         duration: 0.8,
//       });

//       gsap.from(".skill-card", {
//         scrollTrigger: {
//           trigger: ".skills-section",
//           start: "top 75%",
//         },
//         y: 70,
//         opacity: 0,
//         stagger: 0.08,
//         duration: 0.7,
//         ease: "power3.out",
//       });

//       gsap.from(".project-card", {
//         scrollTrigger: {
//           trigger: ".projects-section",
//           start: "top 75%",
//         },
//         y: 80,
//         opacity: 0,
//         stagger: 0.12,
//         duration: 0.8,
//         ease: "power3.out",
//       });

//       gsap.from(".journey-item", {
//         scrollTrigger: {
//           trigger: ".journey-section",
//           start: "top 75%",
//         },
//         x: -60,
//         opacity: 0,
//         stagger: 0.15,
//         duration: 0.7,
//       });

//     }, heroRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <main className="portfolio" ref={heroRef}>

//       {/* NAVBAR */}
//       <nav className="navbar">
//         <div className="nav-logo">
//           LD<span>.</span>
//         </div>

//         <div className="nav-links">
//           <a href="#about">About</a>
//           <a href="#skills">Skills</a>
//           <a href="#projects">Projects</a>
//           <a href="#journey">Journey</a>
//         </div>

//         <a href="#contact" className="nav-contact">
//           Contact
//         </a>
//       </nav>

//       {/* HERO */}
//       <section className="hero">

//         <div className="hero-content">

//           <div className="hero-badge">
//             <span></span>
//             Available for opportunities
//           </div>

//           <h1 className="hero-title">
//             Hi, I'm a
//             <strong> Full Stack </strong>
//             Developer.
//           </h1>

//           <p className="hero-description">
//             I build modern, responsive and scalable web
//             applications using React, Node.js, MongoDB
//             and JavaScript.
//           </p>

//           <div className="hero-buttons">
//             <a href="#projects" className="btn primary">
//               View Projects
//               <span>↗</span>
//             </a>

//             <a href="#contact" className="btn secondary">
//               Contact Me
//             </a>
//           </div>

//           <div className="hero-stack">
//             <span>React</span>
//             <span>Node.js</span>
//             <span>MongoDB</span>
//             <span>Redis</span>
//           </div>

//         </div>

//         <div className="hero-visual">

//           <div className="code-card">
//             <div className="code-top">
//               <span></span>
//               <span></span>
//               <span></span>
//             </div>

//             <pre>
// {`const developer = {
//   name: "Learning Dev",
//   role: "Full Stack Developer",

//   frontend: [
//     "React",
//     "JavaScript",
//     "SCSS"
//   ],

//   backend: [
//     "Node.js",
//     "Express",
//     "MongoDB",
//     "Redis"
//   ],

//   currentlyLearning:
//     "System Design"
// };`}
//             </pre>
//           </div>

//           <div className="floating-card card-one">
//             <span>⚡</span>
//             React
//           </div>

//           <div className="floating-card card-two">
//             <span>◆</span>
//             Node.js
//           </div>

//         </div>

//       </section>

//       {/* ABOUT */}
//       <section className="section about-section" id="about">

//         <div className="section-label">
//           01 — ABOUT
//         </div>

//         <div className="about-content">

//           <div>
//             <h2 className="section-title">
//               Building things,
//               <br />
//               learning every day.
//             </h2>
//           </div>

//           <div className="about-text">
//             <p>
//               I'm a developer focused on building full-stack
//               web applications and understanding how modern
//               web systems work from frontend to backend.
//             </p>

//             <p>
//               I've been working with React, JavaScript,
//               Node.js, Express, MongoDB, JWT authentication,
//               Redis and modern animation libraries.
//             </p>

//             <p>
//               My goal is to keep improving my development
//               skills by building real-world projects.
//             </p>
//           </div>

//         </div>

//       </section>

//       {/* SKILLS */}
//       <section className="section skills-section" id="skills">

//         <div className="section-label">
//           02 — SKILLS
//         </div>

//         <h2 className="section-title">
//           Technologies I work with.
//         </h2>

//         <div className="skills-grid">

//           <div className="skill-card">
//             <span className="skill-number">01</span>
//             <h3>Frontend</h3>
//             <p>
//               HTML, CSS, SCSS, JavaScript, React,
//               React Router, Redux Toolkit
//             </p>
//           </div>

//           <div className="skill-card">
//             <span className="skill-number">02</span>
//             <h3>Backend</h3>
//             <p>
//               Node.js, Express, REST APIs,
//               middleware and authentication
//             </p>
//           </div>

//           <div className="skill-card">
//             <span className="skill-number">03</span>
//             <h3>Database</h3>
//             <p>
//               MongoDB, Mongoose and database
//               operations
//             </p>
//           </div>

//           <div className="skill-card">
//             <span className="skill-number">04</span>
//             <h3>Authentication</h3>
//             <p>
//               JWT, Access Tokens, Refresh Tokens,
//               HTTP-only Cookies
//             </p>
//           </div>

//           <div className="skill-card">
//             <span className="skill-number">05</span>
//             <h3>Redis</h3>
//             <p>
//               Token revocation, blacklisting
//               and temporary data
//             </p>
//           </div>

//           <div className="skill-card">
//             <span className="skill-number">06</span>
//             <h3>Animation</h3>
//             <p>
//               GSAP, ScrollTrigger, SplitText,
//               Lenis and interactive UI
//             </p>
//           </div>

//         </div>

//       </section>

//       {/* PROJECTS */}
//       <section className="section projects-section" id="projects">

//         <div className="section-label">
//           03 — PROJECTS
//         </div>

//         <h2 className="section-title">
//           Things I've built.
//         </h2>

//         <div className="projects-grid">

//           <article className="project-card featured">
//             <div className="project-top">
//               <span>01</span>
//               <span>FULL STACK</span>
//             </div>

//             <h3>Instagram Clone</h3>

//             <p>
//               A full-stack social media application with
//               authentication, posts, likes, follows and
//               protected APIs.
//             </p>

//             <div className="project-tech">
//               React · Node.js · Express · MongoDB
//             </div>

//             <span className="project-arrow">↗</span>
//           </article>

         
//             <div className="project-top">
//               <span>02</span>
//               <span>FULL STACK</span>
//             </div>

//             <h3>Movie Platform</h3>

//             <p>
//               Movie discovery platform using React,
//               Redux Toolkit, TMDB API and backend
//               authentication.
//             </p> 
// <article className="project-card">

//   <div className="project-image">
//     <img
//       src="/projects/instagram.png"
//       alt="Instagram Clone"
//     />

//     <div className="project-overlay">
//       <a href="#" target="_blank">
//         Live Demo ↗
//       </a>

//       <a href="#" target="_blank">
//         GitHub ↗
//       </a>
//     </div>
//   </div>

//   <div className="project-content">

//     <div className="project-meta">
//       <span>01</span>
//       <span>FULL STACK</span>
//     </div>

//     <h3>Instagram Clone</h3>

//     <p>
//       A full-stack social media application with
//       authentication, posts, likes, follows and
//       protected APIs.
//     </p>

//     <div className="project-tech">
//       <span>React</span>
//       <span>Node.js</span>
//       <span>MongoDB</span>
//       <span>JWT</span>
//     </div>

//   </div>

// </article>
//         </div>

//       </section>

//       {/* AUTH */}
//       <section className="auth-section">

//         <div className="auth-box">

//           <div>
//             <span className="section-label">
//               CURRENTLY BUILDING
//             </span>

//             <h2>
//               Secure authentication
//               <br />
//               architecture.
//             </h2>
//           </div>

//           <div className="auth-flow">

//             <span>LOGIN</span>
//             <i>→</i>
//             <span>JWT</span>
//             <i>→</i>
//             <span>REDIS</span>
//             <i>→</i>
//             <span>HTTP COOKIE</span>

//           </div>

//         </div>

//       </section>

//       {/* JOURNEY */}
//       <section className="section journey-section" id="journey">

//         <div className="section-label">
//           04 — JOURNEY
//         </div>

//         <h2 className="section-title">
//           From basics to full stack.
//         </h2>

//         <div className="journey">

//           <div className="journey-item">
//             <span>01</span>
//             <div>
//               <h3>Web Fundamentals</h3>
//               <p>HTML · CSS · JavaScript · DOM</p>
//             </div>
//           </div>

//           <div className="journey-item">
//             <span>02</span>
//             <div>
//               <h3>Frontend Development</h3>
//               <p>React · Vite · SCSS · Redux</p>
//             </div>
//           </div>

//           <div className="journey-item">
//             <span>03</span>
//             <div>
//               <h3>Backend Development</h3>
//               <p>Node.js · Express · REST API</p>
//             </div>
//           </div>

//           <div className="journey-item">
//             <span>04</span>
//             <div>
//               <h3>Database & Authentication</h3>
//               <p>MongoDB · JWT · Redis · Cookies</p>
//             </div>
//           </div>

//           <div className="journey-item">
//             <span>05</span>
//             <div>
//               <h3>Advanced Development</h3>
//               <p>GSAP · System Design · Full Stack Projects</p>
//             </div>
//           </div>

//         </div>

//       </section>

//       {/* CONTACT */}
//       <section className="contact-section" id="contact">

//         <span className="section-label">
//           05 — CONTACT
//         </span>

//         <h2>
//           Let's build something
//           <br />
//           <span>great together.</span>
//         </h2>

//         <a
//           href="mailto:hello@example.com"
//           className="contact-btn"
//         >
//           Get in touch ↗
//         </a>

//       </section>

//       {/* FOOTER */}
//       <footer>
//         <p>
//           © 2026 Learning Dev
//         </p>

//         <p>
//           Built with React + GSAP
//         </p>
//       </footer>

//     </main>
//   );
// // }
// import { useEffect, useRef, useState } from "react";
// import "./Home.css";

// ---------------------------------------------------------------
// Data — edit these arrays to update content without touching JSX
// ---------------------------------------------------------------
const skills = [
  {
    number: "01",
    title: "Frontend",
    desc: "HTML, CSS, SCSS, JavaScript, React.js, Next.js, React Router, Redux Toolkit",
  },
  {
    number: "02",
    title: "Backend",
    desc: "Node.js, Express, REST APIs, middleware and authentication",
  },
  {
    number: "03",
    title: "Database",
    desc: "MongoDB, Mongoose and database operations",
  },
  {
    number: "04",
    title: "Authentication",
    desc: "JWT, Access Tokens, Refresh Tokens, HTTP-only Cookies",
  },
  {
    number: "05",
    title: "Redis",
    desc: "Token revocation, blacklisting and temporary data",
  },
  {
    number: "06",
    title: "Animation",
    desc: "GSAP, 3D animations, ScrollTrigger, SplitText, Lenis and interactive UI",
  },
];

const projects = [
  {
    id: "01",
    tag: "FULL STACK",
    title: "Instagram Clone",
    desc: "A full-stack social media application with authentication, posts, likes, follows and protected APIs.",
    tech: ["React", "Node.js", "MongoDB", "JWT"],
    image: "https://picsum.photos/seed/instagram-clone/800/600",
    demoUrl: "#",
    githubUrl: "#",
  },
  {
    id: "02",
    tag: "FULL STACK",
    title: "Movie Platform",
    desc: "Movie discovery platform using React, Redux Toolkit, TMDB API and backend authentication.",
    tech: ["React", "Redux Toolkit", "TMDB API", "Node.js"],
    image: "https://picsum.photos/seed/movie-platform/800/600",
    demoUrl: "#",
    githubUrl: "#",
  },
];

const journey = [
  { number: "01", title: "Web Fundamentals", desc: "HTML · CSS · JavaScript · DOM" },
  { number: "02", title: "Frontend Development", desc: "React · Vite · SCSS · Redux" },
  { number: "03", title: "Backend Development", desc: "Node.js · Express · REST API" },
  { number: "04", title: "Database & Authentication", desc: "MongoDB · JWT · Redis · Cookies" },
  { number: "05", title: "Advanced Development", desc: "GSAP · System Design · Full Stack Projects" },
];

const authStages = ["LOGIN", "JWT", "REDIS", "HTTP COOKIE"];

export default function Home() {
  const heroRef = useRef(null);
  const [navOpen, setNavOpen] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  // Cycle the highlighted stage in the auth-flow signature strip
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % authStages.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  // Scroll-reveal: fade + rise elements into view as the user scrolls
  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="portfolio" ref={heroRef}>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="wrap navbar-inner">
          <div className="nav-logo">
            LD<span>.</span>
          </div>

          <div className={`nav-links ${navOpen ? "open" : ""}`}>
            <a href="#about" onClick={() => setNavOpen(false)}>About</a>
            <a href="#skills" onClick={() => setNavOpen(false)}>Skills</a>
            <a href="#projects" onClick={() => setNavOpen(false)}>Projects</a>
            <a href="#journey" onClick={() => setNavOpen(false)}>Journey</a>
          </div>

          <a href="#contact" className="nav-contact">
            Contact
          </a>

          <button
            className="nav-toggle"
            aria-label="Toggle menu"
            onClick={() => setNavOpen((open) => !open)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <span></span>
              Available for opportunities
            </div>

            <h1 className="hero-title">
              Hi, I'm a
              <br />
              <strong>Full Stack</strong> Developer.
            </h1>

            <p className="hero-description">
              I build modern, responsive and scalable web applications using
              React, Node.js, MongoDB and JavaScript.
            </p>

            <div className="hero-buttons">
              <a href="#projects" className="btn primary">
                View Projects
                <span>↗</span>
              </a>
              <a href="#contact" className="btn secondary">
                Contact Me
              </a>
            </div>

            <div className="hero-stack">
              <span>React</span>
              <span>Node.js</span>
              <span>MongoDB</span>
              <span>Redis</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="code-card">
              <div className="code-top">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <pre>
                <span className="k">const</span> developer = {"{"}
                {"\n"}  name: <span className="s">"Learning Dev"</span>,
                {"\n"}  role: <span className="s">"Full Stack Developer"</span>,
                {"\n\n"}  frontend: [
                {"\n"}    <span className="s">"React"</span>, <span className="s">"JavaScript"</span>, <span className="s">"SCSS"</span>
                {"\n"}  ],
                {"\n\n"}  backend: [
                {"\n"}    <span className="s">"Node.js"</span>, <span className="s">"Express"</span>,
                {"\n"}    <span className="s">"MongoDB"</span>, <span className="s">"Redis"</span>
                {"\n"}  ],
                {"\n\n"}  currentlyLearning:
                {"\n"}    <span className="s">"System Design"</span>
                {"\n"}{"}"};
              </pre>
            </div>

            <div className="floating-card card-one">
              <span>⚡</span>
              React
            </div>
            <div className="floating-card card-two">
              <span>◆</span>
              Node.js
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section about-section reveal" id="about">
        <div className="wrap">
          <div className="section-label">01 — ABOUT</div>

          <div className="about-content">
            <div>
              <h2 className="section-title">
                Building things,
                <br />
                learning every day.
              </h2>
            </div>

            <div className="about-text">
              <p>
                I'm a developer focused on building full-stack web
                applications and understanding how modern web systems work
                from frontend to backend.
              </p>
              <p>
                I've been working with React, JavaScript, Node.js, Express,
                MongoDB, JWT authentication, Redis and modern animation
                libraries.
              </p>
              <p>
                My goal is to keep improving my development skills by
                building real-world projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="section skills-section" id="skills">
        <div className="wrap">
          <div className="section-label reveal">02 — SKILLS</div>
          <h2 className="section-title reveal">Technologies I work with.</h2>

          <div className="skills-grid reveal-stagger">
            {skills.map((skill) => (
              <div className="skill-card" key={skill.number}>
                <span className="skill-number">{skill.number}</span>
                <h3>{skill.title}</h3>
                <p>{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="section projects-section" id="projects">
        <div className="wrap">
          <div className="section-label reveal">03 — PROJECTS</div>
          <h2 className="section-title reveal">Things I've built.</h2>

          <div className="projects-grid reveal-stagger">
            {projects.map((project) => (
              <article className="project-card" key={project.id}>
                <div className="project-image">
                  <img src={project.image} alt={project.title} loading="lazy" />

                  <div className="project-overlay">
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      Live Demo ↗
                    </a>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      GitHub ↗
                    </a>
                  </div>
                </div>

                <div className="project-content">
                  <div className="project-meta">
                    <span>{project.id}</span>
                    <span>{project.tag}</span>
                  </div>

                  <h3>{project.title}</h3>
                  <p>{project.desc}</p>

                  <div className="project-tech">
                    {project.tech.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AUTH — signature animated flow */}
      <section className="auth-section reveal">
        <div className="wrap">
          <div className="auth-box">
            <div>
              <span className="section-label">CURRENTLY BUILDING</span>
              <h2>
                Secure authentication
                <br />
                architecture.
              </h2>
            </div>

            <div className="auth-flow">
              {authStages.map((stage, i) => (
                <span key={stage} style={{ display: "contents" }}>
                  <span className={i === activeStage ? "active" : ""}>{stage}</span>
                  {i < authStages.length - 1 && <i>→</i>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="section journey-section" id="journey">
        <div className="wrap">
          <div className="section-label reveal">04 — JOURNEY</div>
          <h2 className="section-title reveal">From basics to full stack.</h2>

          <div className="journey reveal-stagger">
            {journey.map((step) => (
              <div className="journey-item" key={step.number}>
                <span>{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section reveal" id="contact">
        <div className="wrap">
          <span className="section-label">05 — CONTACT</span>
          <h2>
            Let's build something
            <br />
            <span>great together.</span>
          </h2>
          <a href="mailto:hello@example.com" className="contact-btn">
            Get in touch ↗
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap footer-inner">
          <p>© 2026 Learning Dev</p>
          <p>Built with React</p>
        </div>
      </footer>
    </main>
  );
}
