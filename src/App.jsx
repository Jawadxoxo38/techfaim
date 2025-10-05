import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Helmet } from 'react-helmet';

// --- SVG Icon Components --- //
const CodeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const DatabaseIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);

const GithubIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedinIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
    </svg>
);

const MailIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

const MenuIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- Particle Canvas Component --- //
const ParticleCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const mouse = {
            x: null,
            y: null,
            radius: 150
        };

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        const init = () => {
            particles = [];
            const numberOfParticles = Math.floor((canvas.height * canvas.width) / 9000);
            for (let i = 0; i < numberOfParticles; i++) {
                const size = Math.random() * 1.5 + 1;
                const x = Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2;
                const y = Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2;
                const directionX = (Math.random() * 0.4) - 0.2;
                const directionY = (Math.random() * 0.4) - 0.2;
                const color = '#00FFC6';
                particles.push(new Particle(x, y, directionX, directionY, size, color));
            }
        };

        const connect = () => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = dx * dx + dy * dy;
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        const opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(0, 255, 198, ${opacityValue})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            connect();
        };

        init();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />;
};

// --- Section Animation Wrapper --- //
const AnimatedSection = ({ children, id }) => {
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    return (
        <motion.section
            id={id}
            ref={ref}
            animate={controls}
            initial="hidden"
            variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 50 }
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="py-20 md:py-32 px-6 md:px-12 lg:px-24"
        >
            {children}
        </motion.section>
    );
};

// --- Header Component --- //
const Header = () => {
    const [activeLink, setActiveLink] = useState('hero');
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const navLinks = ['About', 'Services', 'Work', 'Contact'];

    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const headerOffset = 70; // Height of the sticky header
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        if (isOpen) setIsOpen(false);
    };

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);

            const sections = ['hero', ...navLinks.map(l => l.toLowerCase())];
            let currentSection = '';

            for (const sectionId of sections) {
                const section = document.getElementById(sectionId);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    // Check if section is in the viewport (with an offset)
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        currentSection = sectionId;
                        break;
                    }
                }
            }

            if (currentSection && currentSection !== activeLink) {
                setActiveLink(currentSection);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeLink, navLinks]);


    const navItemClasses = (link) => 
        `cursor-pointer uppercase tracking-widest text-sm transition-colors duration-300 ${
            activeLink === link.toLowerCase() 
            ? 'text-[#00FFC6]' 
            : 'text-white/70 hover:text-white'
        }`;

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#111111]/80 backdrop-blur-lg border-b border-gray-800' : 'bg-transparent'}`}>
            <nav className="container mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
                <div 
                    className="text-2xl font-bold tracking-wider text-white cursor-pointer"
                    onClick={handleScrollToTop}
                >
                    TECH<span className="text-[#00FFC6]" style={{textShadow: '0 0 8px #00FFC6'}}>F</span>AIM
                </div>
                <div className="hidden md:flex space-x-8">
                    {navLinks.map(link => (
                        <a
                            key={link}
                            href={`#${link.toLowerCase()}`}
                            onClick={(e) => handleNavClick(e, link.toLowerCase())}
                            className={navItemClasses(link)}
                        >
                            {link}
                        </a>
                    ))}
                </div>
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <XIcon className="h-6 w-6 text-white"/> : <MenuIcon className="h-6 w-6 text-white" />}
                    </button>
                </div>
            </nav>
            {/* Mobile Menu */}...

            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-[#111111]/95 backdrop-blur-lg`}>
                <div className="flex flex-col items-center space-y-6 py-8">
                    {navLinks.map(link => (
                         <a
                            key={link}
                            href={`#${link.toLowerCase()}`}
                            onClick={(e) => handleNavClick(e, link.toLowerCase())}
                            className={navItemClasses(link)}
                        >
                            {link}
                        </a>
                    ))}
                </div>
            </div>
        </header>
    );
};


// --- Section Components --- //

const Hero = () => {
    const handleScrollTo = (targetId) => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const headerOffset = 70; // Height of the sticky header
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section id="hero" className="relative h-screen flex items-center justify-center text-center">
            <ParticleCanvas />
            <div className="relative z-10 p-6 flex flex-col items-center">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white" 
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                    TECHFAIM
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-4 text-lg md:text-xl text-[#00FFC6] tracking-widest"
                >
                    Where Technology Meets Synergy.
                </motion.p>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-6 max-w-2xl text-base md:text-lg text-white/80"
                >
                    We design and develop intelligent web systems that empower your business.
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                >
                    <button onClick={() => handleScrollTo('contact')} className="glow-button bg-[#00FFC6] text-[#111111] px-8 py-3 rounded-md font-semibold transition-all duration-300 hover:bg-white cursor-pointer">
                        Get a Quote
                    </button>
                    <button onClick={() => handleScrollTo('work')} className="glow-button-secondary bg-transparent border-2 border-[#007FFF] text-white px-8 py-3 rounded-md font-semibold transition-all duration-300 hover:bg-[#007FFF] cursor-pointer">
                        View Our Work
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

const About = () => {
    return (
        <AnimatedSection id="about">
            <div className="container mx-auto">
                <h2 className="section-title">Who We Are</h2>
                <div className="mt-12 grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-white/80 leading-relaxed text-lg text-center md:text-left">
                        <p>
                            Founded by two developers with a shared passion for design, data, and clean code, Techfaim merges creativity and logic to deliver high-performance digital experiences.
                        </p>
                        <p className="mt-4">
                            Our philosophy is simple: build things that work brilliantly and look great doing it. We thrive on complex challenges and are dedicated to pushing the boundaries of what's possible on the web, creating solutions that are not only powerful but also intuitive and scalable.
                        </p>
                    </div>
                    <div className="flex justify-center">
                       <div className="w-64 h-64 lg:w-80 lg:h-80 relative">
                            <div className="absolute inset-0 bg-[#007FFF] rounded-full blur-2xl opacity-30"></div>
                            <div className="absolute inset-4 bg-[#00FFC6] rounded-full blur-2xl opacity-30 animate-pulse"></div>
                            <CodeIcon className="w-full h-full text-white/80" />
                       </div>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
};

const services = [
    { icon: CodeIcon, title: "Web Development", description: "Crafting high-performance, scalable web applications with modern frameworks and clean code." },
    { icon: DatabaseIcon, title: "Data & Dashboard Solutions", description: "Transforming raw data into actionable insights with custom dashboards and visualizations." },
];

const Services = () => {
    return (
        <AnimatedSection id="services">
            <div className="container mx-auto text-center">
                <h2 className="section-title">What We Build</h2>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {services.map((service, index) => (
                        <div key={index} className="service-card p-8 rounded-lg border border-gray-800/50 bg-[#111111]/30 transition-all duration-300 hover:border-[#00FFC6]/50 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(0,255,198,0.15)]">
                           <div className="flex justify-center items-center h-16 w-16 bg-[#00FFC6]/10 rounded-full mx-auto">
                             <service.icon className="h-8 w-8 text-[#00FFC6]" />
                           </div>
                            <h3 className="mt-6 text-xl font-semibold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>{service.title}</h3>
                            <p className="mt-2 text-white/60">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
};

const projects = [
    { title: "Project Alpha", category: "Data Analytics", image: "https://placehold.co/600x400/111111/00FFC6?text=Alpha" },
    { title: "Project Beta", category: "Web Application", image: "https://placehold.co/600x400/111111/007FFF?text=Beta" },
];

const Work = () => {
    return (
        <AnimatedSection id="work">
            <div className="container mx-auto text-center">
                <h2 className="section-title">Recent Projects</h2>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-lg cursor-pointer">
                            <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/60 transition-opacity duration-300 group-hover:bg-black/80"></div>
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <p className="text-sm text-[#00FFC6] uppercase tracking-widest">{project.category}</p>
                                <h3 className="text-2xl font-bold text-white mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{project.title}</h3>
                            </div>
                            <div className="absolute inset-0 border-2 border-transparent transition-all duration-300 group-hover:border-[#00FFC6] rounded-lg" style={{ boxShadow: '0 0 0 0 rgba(0, 255, 198, 0)' }}></div>
                        </div>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
};


const Contact = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const name = encodeURIComponent(form.name.value || '[Your Name]');
        const email = encodeURIComponent(form.email.value || '');
        const message = encodeURIComponent(form.message.value || '[Message]');
        const subject = encodeURIComponent('Inquiry from Techfaim Website');
        const body = encodeURIComponent(`Hi Techfaim Team,%0A%0AMy name is ${decodeURIComponent(name)}.%0A%0A${decodeURIComponent(message)}%0A%0AContact Email: ${decodeURIComponent(email)}`);
        // mailto target
        window.location.href = `mailto:aalmaruf143@gmail.com?subject=${subject}&body=${body}`;
    };

    return (
        <AnimatedSection id="contact">
            <div className="container mx-auto text-center max-w-4xl">
                <h2 className="section-title">Let’s Build Something Great Together</h2>
                <p className="mt-4 text-lg text-white/70 leading-relaxed">
                    Ready to elevate your digital presence? We're passionate about collaborating on innovative projects. Tell us about your vision, and let's craft a high-performance solution that drives results.
                </p>
                <form className="mt-12 text-left" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input name="name" type="text" placeholder="Your Name" className="contact-input bg-gray-900/50 border border-gray-700 rounded-md py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00FFC6] focus:ring-1 focus:ring-[#00FFC6] transition-all duration-300" />
                        <input name="email" type="email" placeholder="Your Email" className="contact-input bg-gray-900/50 border border-gray-700 rounded-md py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00FFC6] focus:ring-1 focus:ring-[#00FFC6] transition-all duration-300" />
                    </div>
                    <div className="mt-6">
                        <textarea name="message" placeholder="Your Message" rows="5" className="contact-input w-full bg-gray-900/50 border border-gray-700 rounded-md py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00FFC6] focus:ring-1 focus:ring-[#00FFC6] transition-all duration-300"></textarea>
                    </div>
                    <div className="mt-8 text-center">
                        <button type="submit" className="glow-button bg-[#00FFC6] text-[#111111] px-12 py-4 rounded-md font-semibold transition-all duration-300 hover:bg-white text-lg">
                            Send Message
                        </button>
                    </div>
                </form>
                <div className="mt-16 flex justify-center space-x-8">
                    <a href="#" className="social-link" aria-label="LinkedIn"><LinkedinIcon className="h-7 w-7" /></a>
                    <a href="#" className="social-link" aria-label="GitHub"><GithubIcon className="h-7 w-7" /></a>
                    <a href="#" className="social-link" aria-label="Mail"><MailIcon className="h-7 w-7" /></a>
                </div>
            </div>
        </AnimatedSection>
    );
};

const Footer = () => {
    return (
        <footer className="py-8 border-t border-gray-800/50">
            <div className="container mx-auto text-center text-white/50 text-sm">
                <p>© 2025 Techfaim | Built by Techfaim Founders.</p>
                <p className="text-white/30 mt-2 text-xs">
                  <span className="text-[#00FFC6]">[</span> Developed with React + Tailwind + Framer Motion <span className="text-[#00FFC6]">]</span>
                </p>
            </div>
        </footer>
    );
};

// --- Main App Component --- //
export default function App() {
    return (
        <div className="bg-gradient-to-b from-bgstart to-bgend text-white font-sans" style={{fontFamily: "'Inter', sans-serif"}}>
            <Helmet>
              <title>Techfaim | Web Development & Data Solutions</title>
              <meta name="description" content="We build intelligent web systems and data-driven experiences that empower businesses to scale with modern technology." />
            </Helmet>
            <Header />
            <main>
                <Hero />
                <About />
                <Services />
                <Work />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}
