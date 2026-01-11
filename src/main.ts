import './style.css'

interface Project {
  title: string;
  subtitle: string;
  problem: string;
  solution: string;
  features: string[];
  technologies: string[];
  result: string;
  link?: string;
}

interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

class Portfolio {
  private app: HTMLElement;

  constructor() {
    this.app = document.getElementById('app')!;
    this.render();
    this.addEventListeners();
  }

  private render(): void {
    this.app.innerHTML = `
      ${this.renderNavigation()}
      ${this.renderHero()}
      ${this.renderAbout()}
      ${this.renderProjects()}
      ${this.renderContact()}
    `;
  }

  private renderNavigation(): string {
    return `
      <nav class="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
        <div class="container-custom py-4">
          <div class="flex justify-between items-center">
            <a href="#" class="text-xl font-semibold">STEWICLEZ</a>
            <ul class="flex gap-8">
              <li><a href="#about" class="link-hover text-sm font-medium">About</a></li>
              <li><a href="#projects" class="link-hover text-sm font-medium">Projects</a></li>
              <li><a href="#about" data-scroll-to-experience class="link-hover text-sm font-medium">Experience</a></li>
              <li><a href="#contact" class="link-hover text-sm font-medium">Contact</a></li>
            </ul>
          </div>
        </div>
      </nav>
    `;
  }

  private renderHero(): string {
    return ``;
  }

  private renderAbout(): string {
    const experiences: Experience[] = [
      {
        role: 'Full Stack Developer Intern',
        company: 'Tech Startup Vietnam',
        period: 'Jun 2025 - Present',
        description: 'Developing microservices architecture for SaaS platform. Implemented caching layer reducing API response time by 60%. Working with React, Node.js, and AWS services.'
      },
      {
        role: 'Frontend Developer',
        company: 'Freelance Projects',
        period: 'Jan 2024 - May 2025',
        description: 'Built responsive web applications for 5+ clients. Specialized in React and TypeScript with focus on performance optimization and accessibility.'
      },
      {
        role: 'Teaching Assistant',
        company: 'University CS Department',
        period: 'Sep 2023 - Dec 2023',
        description: 'Assisted in Web Development course for 100+ students. Created tutorial materials and conducted lab sessions on HTML, CSS, JavaScript, and React fundamentals.'
      }
    ];

    return `
      <section id="about" class="section about-section-bg relative overflow-hidden">
        <!-- Background Image with Blur -->
        <div class="absolute inset-0 -z-10">
          <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('/img/profile-background.jpg'); filter: blur(8px); transform: scale(1.1);"></div>
          <div class="absolute inset-0 bg-white/80"></div>
        </div>
        
        <div class="container-custom relative z-10">
          <div class="grid md:grid-cols-[340px_1fr] lg:grid-cols-[400px_1fr] gap-10 md:gap-16 lg:gap-24 items-start">
            <!-- Left Column: Avatar and About Me -->
            <div class="section-reveal bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg">
              <!-- Avatar -->
              <div class="w-64 h-64 rounded-full border-4 border-gray-900 overflow-hidden mb-6 mx-auto bg-gray-200">
                <img src="/img/my-avatar.jpg" alt="Profile Avatar" class="w-full h-full object-cover">
              </div>
              
              <!-- Name and Title -->
              <div class="text-center mb-6">
                <h1 class="text-3xl font-bold mb-1">Hoàng Minh Dương</h1>
                <p class="text-lg text-gray-600">Full Stack Developer</p>
              </div>
              
              <!-- About Me Title -->
              <h2 class="text-2xl font-bold mb-4">About Me</h2>
              
              <!-- Description -->
              <p class="text-gray-700 leading-relaxed mb-4">
                I'm a developer with a passion for creating elegant solutions to complex problems. I specialize in building modern web applications with a focus on user experience and clean, maintainable code.
              </p>
              <p class="text-gray-700 leading-relaxed mb-6">
                With experience in both frontend and backend development, I enjoy working on full-stack projects that challenge me to grow and learn new technologies.
              </p>
              
              <!-- Contact -->
              <h2 class="text-2xl font-bold mb-4">Contact</h2>
              <div class="mb-6">
                <span class="text-gray-600 text-sm mr-2">Email:</span>
                <a href="mailto:hoanglong.workdl@gmail.com" class="text-clean-accent hover:text-green-700 font-medium">hoanglong.workdl@gmail.com</a>
                <span class="text-gray-600 text-sm mr-2">Phone:</span>
                <a href="tel:+84 911818016" class="text-clean-accent hover:text-green-700 font-medium">+84 911 818 016</a>
              </div>
              
            </div>

            <!-- Right Column: Experience and Tech Stack -->
            <div class="section-reveal">
              <!-- Experience Section -->
              <div id="experience-section" class="mb-6 p-6 -mx-6 rounded-lg transition-all duration-500">
                <h2 class="text-2xl font-bold mb-6 flex items-center">
                  <span class="w-2 h-2 bg-clean-accent rounded-full mr-3"></span>
                  Experience
                </h2>
                <div class="space-y-6">
                  ${experiences.map((exp, index) => `
                    <div class="border-l-4 border-clean-accent pl-6 pb-6">
                      <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-2">
                        <h3 class="text-xl font-bold">${exp.role}</h3>
                        <span class="text-xs font-mono text-gray-500 mt-1 lg:mt-0 lg:ml-4 whitespace-nowrap">${exp.period}</span>
                      </div>
                      <p class="text-base text-gray-600 font-medium mb-2">${exp.company}</p>
                      <p class="text-sm text-gray-700 leading-relaxed text-justify">${exp.description}</p>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Tech Stack Section -->
              <div>
                <h2 class="text-2xl font-bold mb-6 flex items-center">
                  <span class="w-2 h-2 bg-clean-accent rounded-full mr-3"></span>
                  Tech Stack
                </h2>
                <div class="flex flex-wrap gap-2">
                  ${['TypeScript', 'React', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Tailwind CSS', 'Git', 'Docker', 'Redis']
                    .map(skill => `<span class="tech-tag hover:border-clean-accent hover:text-clean-accent transition-colors cursor-default">${skill}</span>`)
                    .join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  private renderProjects(): string {
    const projects: Project[] = [
      {
        title: 'Real-Time E-Commerce Platform',
        subtitle: 'Full-stack shopping experience with live inventory',
        problem: 'Traditional e-commerce platforms faced inventory inconsistencies leading to overselling and poor customer experience',
        solution: 'Built a real-time system using WebSocket for live inventory updates and Redis for caching to ensure data consistency',
        features: [
          'JWT-based authentication with role-based access control',
          'Real-time inventory sync across multiple warehouses',
          'Stripe payment integration with webhook handling',
          'Admin dashboard with sales analytics'
        ],
        technologies: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'Socket.io'],
        result: 'Reduced overselling by 95% and improved page load time to under 1.5s. Achieved A+ grade in capstone project',
        link: '#'
      },
      {
        title: 'Collaborative Task Manager',
        subtitle: 'Team productivity tool with real-time updates',
        problem: 'Teams struggled with task coordination across different time zones and keeping everyone updated on project progress',
        solution: 'Developed a real-time collaboration platform with Firebase for instant synchronization and Zustand for efficient state management',
        features: [
          'Real-time task updates with optimistic UI',
          'Drag-and-drop Kanban board with persistence',
          'Team notifications and @mentions',
          'Time tracking and productivity reports'
        ],
        technologies: ['TypeScript', 'React', 'Firebase', 'Zustand', 'Tailwind CSS'],
        result: 'Successfully deployed to 50+ users. Learned advanced state management and real-time database optimization',
        link: '#'
      },
      {
        title: 'Developer Portfolio Generator CLI',
        subtitle: 'Command-line tool for instant portfolio creation',
        problem: 'Developers spend too much time building portfolio websites instead of showcasing their work',
        solution: 'Created a CLI tool with customizable templates and automatic deployment to generate production-ready portfolios in minutes',
        features: [
          'Interactive CLI with rich prompts',
          'Multiple pre-built themes (Minimal, Creative, Tech)',
          'Automatic GitHub Pages deployment',
          'SEO optimization and meta tag generation'
        ],
        technologies: ['TypeScript', 'Node.js', 'Commander.js', 'Vite', 'GitHub API'],
        result: 'Published to npm with 100+ downloads. Learned CLI development and automation best practices',
        link: '#'
      }
    ];

    return `
      <section id="projects" class="section">
        <div class="container-custom">
          <h2 class="text-4xl font-bold mb-4 section-reveal">Featured Projects</h2>
          <p class="text-gray-600 mb-12 section-reveal">Building solutions that matter</p>
          <div class="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
            ${projects.map((project, index) => `
              <div class="project-card section-reveal group" style="animation-delay: ${index * 0.1}s;">
                <div class="flex items-start justify-between mb-4">
                  <h3 class="text-2xl font-bold group-hover:text-clean-accent transition-colors">${project.title}</h3>
                  ${project.link ? `
                    <a href="${project.link}" class="text-clean-accent hover:text-deep-accent transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                    </a>
                  ` : ''}
                </div>
                <p class="text-gray-600 italic mb-4">${project.subtitle}</p>
                
                <div class="mb-4">
                  <h4 class="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-2">Problem</h4>
                  <p class="text-gray-700">${project.problem}</p>
                </div>
                
                <div class="mb-4">
                  <h4 class="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-2">Solution</h4>
                  <p class="text-gray-700">${project.solution}</p>
                </div>
                
                <div class="mb-4">
                  <h4 class="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-2">Key Features</h4>
                  <ul class="space-y-1">
                    ${project.features.map(feature => `
                      <li class="text-gray-700 text-sm flex items-start">
                        <span class="text-clean-accent mr-2 mt-1">✓</span>
                        <span>${feature}</span>
                      </li>
                    `).join('')}
                  </ul>
                </div>
                
                <div class="mb-4">
                  <h4 class="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-2">Tech Stack</h4>
                  <div class="flex flex-wrap gap-2">
                    ${project.technologies.map(tech => 
                      `<span class="tech-tag">${tech}</span>`
                    ).join('')}
                  </div>
                </div>
                
                <div class="pt-4 border-t border-gray-200">
                  <h4 class="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-2">Impact</h4>
                  <p class="text-gray-700 font-medium">${project.result}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }



  private renderContact(): string {
    return `
      <section id="contact" class="section">
        <div class="container-custom text-center">
          <h2 class="text-4xl font-bold mb-6 section-reveal">Let's Work Together</h2>
          <p class="text-gray-600 mb-12 max-w-2xl mx-auto text-lg section-reveal">
            I'm always open to new opportunities, interesting projects, and meaningful collaborations.
            Feel free to reach out!
          </p>
          
          <!-- Social Icons -->
          <div class="flex gap-4 justify-center mb-8 section-reveal">
            <a href="https://facebook.com" target="_blank" class="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all group">
              <svg class="w-6 h-6 text-gray-600 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://github.com" target="_blank" class="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-gray-900 hover:bg-gray-100 flex items-center justify-center transition-all group">
              <svg class="w-6 h-6 text-gray-600 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://zalo.me" target="_blank" class="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center transition-all group">
              <svg class="w-6 h-6 text-gray-600 group-hover:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm.5 14.969l-3.062-3.259-5.978 3.259L9.938 8.25l3.14 3.259L19 8.25l-6.5 6.719z"/>
              </svg>
            </a>
            <a href="tel:+84123456789" class="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-green-600 hover:bg-green-50 flex items-center justify-center transition-all group">
              <svg class="w-6 h-6 text-gray-600 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </a>
          </div>
          
          <div class="section-reveal">
            <a href="mailto:hoanglong.workdl@gmail.com" class="inline-block px-10 py-4 bg-clean-text text-white rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105 text-lg font-medium">
              Send me an email
            </a>
          </div>
        </div>
      </section>
    `;
  }

  private addEventListeners(): void {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        
        // Check if this is the Experience link
        if (anchor.hasAttribute('data-scroll-to-experience')) {
          const aboutSection = document.querySelector('#about');
          const experienceSection = document.querySelector('#experience-section');
          
          aboutSection?.scrollIntoView({ behavior: 'smooth' });
          
          // Highlight experience section with animation
          setTimeout(() => {
            if (experienceSection) {
              experienceSection.classList.add('experience-highlight');
              setTimeout(() => {
                experienceSection.classList.remove('experience-highlight');
              }, 2000);
            }
          }, 500);
        } else if (href && href !== '#') {
          const target = document.querySelector(href);
          target?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Add scroll-based animations
    this.addScrollAnimations();
  }

  private addScrollAnimations(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.add('opacity-100');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections and elements with section-reveal class
    document.querySelectorAll('.section-reveal').forEach(element => {
      element.classList.add('opacity-0');
      observer.observe(element);
    });
  }
}

// Initialize the portfolio
new Portfolio();
