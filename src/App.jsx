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

const SunIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

// --- Particle Canvas Component --- //
const ParticleCanvas = ({ theme }) => {
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
                const color = theme === 'dark' ? '#00FFC6' : '#000000';
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
                        ctx.strokeStyle = `rgba(${theme === 'dark' ? '0, 255, 198' : '0, 0, 0'}, ${opacityValue})`;
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
    }, [theme]);

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
const Header = ({ theme, toggleTheme }) => {
    const [activeLink, setActiveLink] = useState('hero');
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const navLinks = ['About', 'Services', 'Work', 'Inquiry', 'Contact'];

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
            : theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'
        }`;

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? (theme === 'dark' ? 'bg-[#111111]/80 backdrop-blur-lg border-b border-gray-800' : 'bg-white/80 backdrop-blur-lg border-b border-gray-300') : 'bg-transparent'}`}>
            <nav className="container mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
                <div
                    className={`text-2xl font-bold tracking-wider cursor-pointer ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                    onClick={handleScrollToTop}
                >
                    TECH<span className="text-[#00FFC6]" style={{textShadow: '0 0 8px #00FFC6'}}>F</span>AIM
                </div>
                <div className="hidden md:flex items-center space-x-8">
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
                    <LampToggle theme={theme} toggleTheme={toggleTheme} />
                </div>
                <div className="md:hidden flex items-center space-x-4">
                    <LampToggle theme={theme} toggleTheme={toggleTheme} />
                    <button onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <XIcon className={`h-6 w-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}/> : <MenuIcon className={`h-6 w-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />}
                    </button>
                </div>
            </nav>

            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} ${theme === 'dark' ? 'bg-[#111111]/95' : 'bg-white/95'} backdrop-blur-lg`}>
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

const Hero = ({ theme }) => {
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
            <ParticleCanvas theme={theme} />
            <div className="relative z-10 p-6 flex flex-col items-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                    TECHFAIM
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className={`mt-4 text-lg md:text-xl tracking-widest ${theme === 'dark' ? 'text-[#00FFC6]' : 'text-black'}`}
                >
                    Where Technology Meets Synergy.
                </motion.p>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className={`mt-6 max-w-2xl text-base md:text-lg ${theme === 'dark' ? 'text-white/80' : 'text-black/80'}`}
                >
                    We design and develop intelligent web systems that empower your business.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                >
                    <button onClick={() => handleScrollTo('contact')} className={`glow-button px-8 py-3 rounded-md font-semibold transition-all duration-300 cursor-pointer ${theme === 'dark' ? 'bg-[#00FFC6] text-[#111111] hover:bg-white' : 'bg-black text-white hover:bg-gray-800'}`}>
                        Get a Quote
                    </button>
                    <button onClick={() => handleScrollTo('work')} className={`glow-button-secondary px-8 py-3 rounded-md font-semibold transition-all duration-300 cursor-pointer ${theme === 'dark' ? 'bg-transparent border-2 border-[#007FFF] text-white hover:bg-[#007FFF]' : 'bg-black text-white hover:bg-gray-800 border-2 border-black'}`}>
                        View Our Work
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

const About = ({ theme }) => {
    return (
        <AnimatedSection id="about">
            <div className="container mx-auto">
                <h2 className="section-title dark:text-white text-black">WHO WE ARE</h2>
                <div className="mt-12 grid md:grid-cols-2 gap-12 items-center">
                    <div className={`leading-relaxed text-lg text-center md:text-left ${theme === 'dark' ? 'text-white/80' : 'text-black/80'}`}>
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
                            <CodeIcon className={`w-full h-full ${theme === 'dark' ? 'text-white/80' : 'text-black/80'}`} />
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

const Services = ({ theme }) => {
    return (
        <AnimatedSection id="services">
            <div className="container mx-auto text-center">
                <h2 className="section-title dark:text-white text-black">WHAT WE BUILD</h2>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {services.map((service, index) => (
                        <div key={index} className={`service-card p-8 rounded-lg border ${theme === 'dark' ? 'border-gray-800/50 bg-[#111111]/30' : 'border-gray-300/50 bg-white/30'} transition-all duration-300 hover:border-[#00FFC6]/50 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(0,255,198,0.15)]`}>
                           <div className="flex justify-center items-center h-16 w-16 bg-[#00FFC6]/10 rounded-full mx-auto">
                             <service.icon className="h-8 w-8 text-[#00FFC6]" />
                           </div>
                            <h3 className={`mt-6 text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Poppins', sans-serif" }}>{service.title}</h3>
                            <p className={`mt-2 ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>{service.description}</p>
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

const Work = ({ theme }) => {
    return (
        <AnimatedSection id="work">
            <div className="container mx-auto text-center">
                <h2 className="section-title dark:text-white text-black">RECENT PROJECTS</h2>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-lg cursor-pointer">
                            <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/60 group-hover:bg-black/80' : 'bg-white/60 group-hover:bg-white/80'} transition-opacity duration-300`}></div>
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <p className="text-sm text-[#00FFC6] uppercase tracking-widest">{project.category}</p>
                                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} mt-1`} style={{ fontFamily: "'Poppins', sans-serif" }}>{project.title}</h3>
                            </div>
                            <div className="absolute inset-0 border-2 border-transparent transition-all duration-300 group-hover:border-[#00FFC6] rounded-lg" style={{ boxShadow: '0 0 0 0 rgba(0, 255, 198, 0)' }}></div>
                        </div>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
};


const Inquiry = ({ theme }) => {
    const inquiryItems = [
        {
            title: "Website Design Inquiry",
            category: "Inquiry Form",
            image: "https://placehold.co/600x400/111111/00FFC6?text=Inquiry",
            link: "https://forms.gle/bz6D8aS4Pybs9kqM6"
        },
        {
            title: "Data Insights & Dashboard Request Form",
            category: "Inquiry Form",
            image: "https://placehold.co/600x400/111111/007FFF?text=Data+Insights",
            link: "https://forms.gle/CgDbhYH4mEZQ3tBNA"
        },
        {
            title: "Custom Order",
            category: "Inquiry Form",
            image: "https://placehold.co/600x400/111111/00FFC6?text=Custom+Order",
            link: "https://forms.gle/DWbuohC4Czs3nYYv5"
        }
    ];

    return (
        <AnimatedSection id="inquiry">
            <div className="container mx-auto text-center">
                <h2 className="section-title dark:text-white text-black">INQUIRY</h2>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {inquiryItems.map((item, index) => (
                        <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-lg cursor-pointer block">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/60 group-hover:bg-black/80' : 'bg-white/60 group-hover:bg-white/80'} transition-opacity duration-300`}></div>
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <p className="text-sm text-[#00FFC6] uppercase tracking-widest">{item.category}</p>
                                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} mt-1`} style={{ fontFamily: "'Poppins', sans-serif" }}>{item.title}</h3>
                                <span className={`mt-2 text-[#00FFC6] ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'} transition-colors duration-300`}>Link</span>
                            </div>
                            <div className="absolute inset-0 border-2 border-transparent transition-all duration-300 group-hover:border-[#00FFC6] rounded-lg" style={{ boxShadow: '0 0 0 0 rgba(0, 255, 198, 0)' }}></div>
                        </a>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
};

const Contact = ({ theme }) => {

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
                <h2 className="section-title dark:text-white text-black">LET’S BUILD SOMETHING GREAT TOGETHER</h2>
                <p className={`mt-4 text-lg leading-relaxed ${theme === 'dark' ? 'text-white/70' : 'text-black/70'}`}>
                    Ready to elevate your digital presence? We're passionate about collaborating on innovative projects. Tell us about your vision, and let's craft a high-performance solution that drives results.
                </p>
                <form className="mt-12 text-left" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input name="name" type="text" placeholder="Your Name" className={`contact-input ${theme === 'dark' ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' : 'bg-white/50 border-gray-300 text-black placeholder-gray-500'} rounded-md py-3 px-4 focus:outline-none focus:border-[#00FFC6] focus:ring-1 focus:ring-[#00FFC6] transition-all duration-300`} />
                        <input name="email" type="email" placeholder="Your Email" className={`contact-input ${theme === 'dark' ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' : 'bg-white/50 border-gray-300 text-black placeholder-gray-500'} rounded-md py-3 px-4 focus:outline-none focus:border-[#00FFC6] focus:ring-1 focus:ring-[#00FFC6] transition-all duration-300`} />
                    </div>
                    <div className="mt-6">
                        <textarea name="message" placeholder="Your Message" rows="5" className={`contact-input w-full ${theme === 'dark' ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' : 'bg-white/50 border-gray-300 text-black placeholder-gray-500'} rounded-md py-3 px-4 focus:outline-none focus:border-[#00FFC6] focus:ring-1 focus:ring-[#00FFC6] transition-all duration-300`}></textarea>
                    </div>
                    <div className="mt-8 text-center">
                        <button type="submit" className={`glow-button px-12 py-4 rounded-md font-semibold transition-all duration-300 text-lg ${theme === 'dark' ? 'bg-[#00FFC6] text-[#111111] hover:bg-white' : 'bg-black text-white hover:bg-gray-800'}`}>
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
        </AnimatedSection>
    );
};

const Footer = ({ theme }) => {
    return (
        <footer className={`py-8 border-t ${theme === 'dark' ? 'border-gray-800/50' : 'border-gray-300/50'}`}>
            <div className={`container mx-auto text-center text-sm ${theme === 'dark' ? 'text-white/50' : 'text-black/50'}`}>
                <p>© 2025 Techfaim | Built by Techfaim Founders.</p>
            </div>
        </footer>
    );
};

// --- Lamp Toggle Component --- //
const LampToggle = ({ theme, toggleTheme }) => {
    const [isPulling, setIsPulling] = useState(false);

    const handleClick = () => {
        setIsPulling(true);
        toggleTheme();
        setTimeout(() => setIsPulling(false), 300); // Reset pull animation after 300ms
    };

    return (
        <div className="relative cursor-pointer" onClick={handleClick}>
            {/* Fancy Light Bulb */}
            <div className={`w-8 h-16 relative shadow-xl transition-all duration-300 ${isPulling ? 'transform translate-y-1' : ''}`}>
                {/* Bulb Glass */}
                <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-12 ${theme === 'dark' ? 'bg-gradient-to-b from-blue-100/30 via-transparent to-blue-50/20' : 'bg-gradient-to-b from-blue-200/40 via-transparent to-blue-100/30'} rounded-full border ${theme === 'dark' ? 'border-gray-400/50' : 'border-gray-300/50'} shadow-inner`}></div>
                {/* Filament */}
                <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 ${theme === 'dark' ? 'bg-yellow-400' : 'bg-yellow-300'} rounded-full opacity-80 animate-pulse`}></div>
                {/* Inner Filament */}
                <div className={`absolute top-5 left-1/2 transform -translate-x-1/2 w-2 h-2 ${theme === 'dark' ? 'bg-white' : 'bg-gray-100'} rounded-full animate-pulse`}></div>
                {/* Bulb Base */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 ${theme === 'dark' ? 'bg-gradient-to-b from-gray-600 to-gray-800' : 'bg-gradient-to-b from-gray-400 to-gray-600'} rounded-full shadow-md border ${theme === 'dark' ? 'border-gray-500' : 'border-gray-300'}`}></div>
                {/* Glow */}
                {theme === 'dark' && (
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-yellow-400 rounded-full opacity-30 animate-pulse blur-lg"></div>
                )}
            </div>
            {/* Fancy Curved Rope */}
            <svg className={`absolute top-full left-1/2 transform -translate-x-1/2 w-4 h-20 transition-all duration-300 ${isPulling ? 'transform translate-y-1' : ''}`} viewBox="0 0 16 80">
                <path d="M8 0 Q6 20 8 40 Q10 60 8 80" stroke={theme === 'dark' ? '#C0C0C0' : '#333333'} strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
        </div>
    );
};

// --- Main App Component --- //
export default function App() {
    const [theme, setTheme] = React.useState('dark');
    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className={`${theme === 'dark' ? 'bg-gradient-to-b from-bgstart to-bgend text-white' : 'bg-white text-black'} font-sans`} style={{fontFamily: "'Inter', sans-serif"}}>
            <Helmet>
              <title>Techfaim | Web Development & Data Solutions</title>
              <meta name="description" content="We build intelligent web systems and data-driven experiences that empower businesses to scale with modern technology." />
            </Helmet>
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main>
                <Hero theme={theme} />
                <About theme={theme} />
                <Services theme={theme} />
                <Work theme={theme} />
                <Inquiry theme={theme} />
                <Contact theme={theme} />
            </main>
            <Footer theme={theme} />
        </div>
    );
}
