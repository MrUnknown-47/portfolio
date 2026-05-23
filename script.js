// ── Loader ──────────────────────────────────────────
THREE.Cache.enabled = true;
const loader = document.getElementById('loader');
const pct = document.getElementById('loader-pct');
let p = 0;
const counter = setInterval(() => {
    p = Math.min(p + Math.random() * 8, 100);
    pct.textContent = Math.floor(p) + '%';
    if (p >= 100) {
        clearInterval(counter);
        setTimeout(() => {
            loader.style.transition = 'opacity .6s, transform .6s';
            loader.style.opacity = '0';
            loader.style.transform = 'scale(1.05)';
            setTimeout(() => loader.style.display = 'none', 600);
        }, 300);
    }
}, 40);

// ── Cursor ───────────────────────────────────────────
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
    cur.style.left = mx + 'px'; cur.style.top = my + 'px';
    rx += (mx - rx) * .15; ry += (my - ry) * .15;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
}
animCursor();

// ── Theme ────────────────────────────────────────────
let dark = true;
function toggleTheme() {
    dark = !dark;
    document.body.classList.toggle('light', !dark);
    document.getElementById('theme-toggle').textContent = dark ? '☀ Light' : '🌙 Dark';
}

// ── Mobile menu ──────────────────────────────────────
document.getElementById('burgerBtn').onclick = () => document.getElementById('mobileMenu').classList.add('open');
document.getElementById('mobileClose').onclick = () => closeMobile();
function closeMobile() { document.getElementById('mobileMenu').classList.remove('open'); }

// ── Toast ─────────────────────────────────────────────
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Starfield ─────────────────────────────────────────
(function () {
    const canvas = document.getElementById('star-canvas');
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    cam.position.z = 800;

    const count = window.innerWidth < 768 ? 1500 : 3000;
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 3000;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 3000;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 3000;
        const c = Math.random();
        if (c < 0.3) { cols[i * 3] = 0; cols[i * 3 + 1] = 0.96; cols[i * 3 + 2] = 1; }
        else if (c < 0.6) { cols[i * 3] = 0.49; cols[i * 3 + 1] = 0.23; cols[i * 3 + 2] = 0.93; }
        else { cols[i * 3] = 1; cols[i * 3 + 1] = 1; cols[i * 3 + 2] = 1; }
    }
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    const mat = new THREE.PointsMaterial({ size: 1.8, vertexColors: true, transparent: true, opacity: .85, sizeAttenuation: true });
    const stars = new THREE.Points(geom, mat);
    scene.add(stars);

    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', e => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animate() {
        requestAnimationFrame(animate);
        stars.rotation.y += 0.0002;
        stars.rotation.x += 0.00008;
        cam.position.x += (mouseX * 30 - cam.position.x) * 0.03;
        cam.position.y += (-mouseY * 30 - cam.position.y) * 0.03;
        cam.lookAt(scene.position);
        renderer.render(scene, cam);
    }
    animate();

    window.addEventListener('resize', () => {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        cam.aspect = canvas.clientWidth / canvas.clientHeight;
        cam.updateProjectionMatrix();
    });
})();

// ── Typing animation ──────────────────────────────────
const phrases = ['Full Stack Developer', 'DSA Enthusiast', 'Machine Learning Explorer', 'Problem Solver'];
let pi = 0, ci = 0, deleting = false;
const typingEl = document.getElementById('typing-text');
function typeLoop() {
    const phrase = phrases[pi];
    if (!deleting) {
        typingEl.textContent = phrase.slice(0, ++ci);
        if (ci === phrase.length) { deleting = true; setTimeout(typeLoop, 2200); return; }
        setTimeout(typeLoop, 90);
    } else {
        typingEl.textContent = phrase.slice(0, --ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(typeLoop, 400); return; }
        setTimeout(typeLoop, 45);
    }
}
setTimeout(typeLoop, 2800);

// ── Skills ────────────────────────────────────────────
const skills = [
    { icon: '⚡', name: 'C++', level: .9 },
    { icon: '🐍', name: 'Python', level: .85 },
    { icon: '🌐', name: 'JavaScript', level: .88 },
    { icon: '⚛️', name: 'React', level: .82 },
    { icon: '🎨', name: 'Tailwind', level: .9 },
    { icon: '🟢', name: 'Node.js', level: .78 },
    { icon: '🗄️', name: 'SQL', level: .75 },
    { icon: '🧠', name: 'DSA', level: .88 },
    { icon: '🤖', name: 'Machine Learning', level: .7 },
];
const sg = document.getElementById('skillsGrid');
skills.forEach(s => {
    sg.innerHTML += `<div class="skill-chip">
    <div class="skill-icon">${s.icon}</div>
    <div class="skill-name">${s.name}</div>
    <div class="skill-level"><div class="skill-fill" style="width:${s.level * 100}%"></div></div>
  </div>`;
});

// ── Skill Globe ───────────────────────────────────────
(function () {
    const canvas = document.getElementById('globe-canvas');
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(300, 300);
    cam.position.z = 3;

    const sphereGeom = new THREE.SphereGeometry(1, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff, wireframe: true, opacity: .18, transparent: true });
    const sphere = new THREE.Mesh(sphereGeom, sphereMat);
    scene.add(sphere);

    const labels = skills.map(s => s.name);
    const dots = [];
    labels.forEach((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / labels.length);
        const theta = Math.sqrt(labels.length * Math.PI) * phi;
        const dg = new THREE.SphereGeometry(.04, 8, 8);
        const dm = new THREE.MeshBasicMaterial({ color: 0x00f5ff });
        const d = new THREE.Mesh(dg, dm);
        d.position.setFromSphericalCoords(1, phi, theta);
        scene.add(d);
        dots.push(d);
    });

    function animate() {
        requestAnimationFrame(animate);
        sphere.rotation.y += 0.005;
        sphere.rotation.x += 0.002;
        dots.forEach(d => {
            d.rotation.y = sphere.rotation.y;
            d.rotation.x = sphere.rotation.x;
            const pos = d.position.clone().applyEuler(sphere.rotation);
            d.position.copy(pos.normalize());
        });
        // Re-implement dot rotation properly
        renderer.render(scene, cam);
    }

    // Simpler approach: rotate the whole group
    const group = new THREE.Group();
    group.add(sphere);
    dots.forEach(d => group.add(d));
    scene.remove(sphere);
    dots.forEach(d => scene.remove(d));
    scene.add(group);

    function animateGlobe() {
        requestAnimationFrame(animateGlobe);
        group.rotation.y += 0.006;
        group.rotation.x += 0.002;
        renderer.render(scene, cam);
    }
    animateGlobe();
})();

// ── Projects ──────────────────────────────────────────
async function loadGithubProjects() {
    try {
        const res = await fetch("https://api.github.com/users/YOUR_USERNAME/repos?sort=updated");
        const data = await res.json();

        const top = data.slice(0, 6);

        pg.innerHTML = '';

        top.forEach(repo => {
            pg.innerHTML += `
        <div class="proj-card">
          <div class="proj-card-top">
            <div class="proj-icon">📦</div>
            <div class="proj-links">
              <a href="${repo.html_url}" target="_blank">⎋ GitHub</a>
            </div>
          </div>
          <div class="proj-title">${repo.name}</div>
          <div class="proj-desc">${repo.description || 'No description provided.'}</div>
          <div class="proj-meta">
            <div class="proj-lang"><div class="lang-dot"></div>${repo.language || 'Code'}</div>
            <div class="proj-stars">⭐ ${repo.stargazers_count}</div>
          </div>
        </div>`;
        });

    } catch (err) {
        console.log("GitHub API failed");
    }
}

loadGithubProjects();

const projects = [
    { name: 'AlgoViz Pro', desc: 'Interactive algorithm visualizer with step-by-step animations for sorting, pathfinding, and graph traversal.', tags: ['React', 'D3.js', 'Algorithms'], lang: 'JavaScript', stars: 42, icon: '📊' },
    { name: 'NeuralChat', desc: 'AI-powered chatbot with custom transformer architecture trained on technical conversations.', tags: ['Python', 'PyTorch', 'FastAPI'], lang: 'Python', stars: 31, icon: '🤖' },
    { name: 'DevSync', desc: 'Real-time collaborative code editor with syntax highlighting, live cursors, and integrated chat.', tags: ['React', 'Socket.io', 'Node.js'], lang: 'JavaScript', stars: 28, icon: '⚡' },
    { name: 'QueryMind', desc: 'Natural language to SQL converter leveraging LLM APIs for intuitive database querying.', tags: ['Python', 'SQL', 'LangChain'], lang: 'Python', stars: 19, icon: '🗄️' },
    { name: 'StockSense', desc: 'Stock market prediction engine using LSTM networks with sentiment analysis from news feeds.', tags: ['Python', 'TensorFlow', 'ML'], lang: 'Python', stars: 24, icon: '📈' },
    { name: 'FastRoute API', desc: 'High-performance RESTful API template with JWT auth, rate limiting, and auto-docs generation.', tags: ['Node.js', 'Express', 'MongoDB'], lang: 'JavaScript', stars: 17, icon: '🚀' },
];
const pg = document.getElementById('projectsGrid');
projects.forEach(p => {
    pg.innerHTML += `<div class="proj-card" onmousemove="tilt(event,this)" onmouseleave="resetTilt(this)">
    <div class="proj-card-top">
      <div class="proj-icon">${p.icon}</div>
      <div class="proj-links">
        <a href="#" onclick="showToast('Opening GitHub...');return false">⎋ GitHub</a>
      </div>
    </div>
    <div class="proj-title">${p.name}</div>
    <div class="proj-desc">${p.desc}</div>
    <div class="proj-tags">${p.tags.map(t => `<span class="proj-tag">${t}</span>`).join('')}</div>
    <div class="proj-meta">
      <div class="proj-lang"><div class="lang-dot"></div>${p.lang}</div>
      <div class="proj-stars">⭐ ${p.stars}</div>
    </div>
  </div>`;
});

// Tilt effect
function tilt(e, el) {
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 20;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -20;
    el.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-8px)`;
}
function resetTilt(el) { el.style.transform = ''; }

// ── Scroll observer ───────────────────────────────────
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            // Animate skill bars
            if (e.target.classList.contains('skill-chip')) {
                e.target.querySelector('.skill-fill').style.transform = 'scaleX(1)';
            }
        }
    });
}, { threshold: .15 });

document.querySelectorAll('.reveal, .story-block').forEach(el => observer.observe(el));
document.querySelectorAll('.skill-chip').forEach(el => observer.observe(el));

// ── Terminal ──────────────────────────────────────────
const termData = {
    about: `╔══════════════════════════════════╗
║  VAIBHAV SINGH  ·  CS Student    ║
╚══════════════════════════════════╝

🎓 Computer Science Student
📍 India
🔭 Building scalable apps & ML projects
💡 Passionate about DSA & AI systems
📧 vaibhav@email.com

"Engineering the future, one commit at a time."`,
    skills: `◉ Languages   : C++, Python, JavaScript, SQL
◉ Frontend    : React, Tailwind CSS, HTML/CSS
◉ Backend     : Node.js, Express, REST APIs
◉ ML/AI       : TensorFlow, PyTorch, LangChain
◉ Tools       : Git, Docker, VS Code, Linux
◉ CS Core     : DSA, Algorithms, OOP, DBMS`,
    projects: `┌─────────────────────────────────────────┐
│ 📊 AlgoViz Pro      [React · D3.js]     │
│ 🤖 NeuralChat       [Python · PyTorch]  │
│ ⚡ DevSync          [React · Socket.io] │
│ 🗄️  QueryMind        [Python · SQL]      │
│ 📈 StockSense       [Python · TF]       │
│ 🚀 FastRoute API    [Node.js · Mongo]   │
└─────────────────────────────────────────┘

Use → vaibhav.dev/projects for full details`,
    contact: `📧  vaibhav@email.com
⚡  github.com/vaibhavsingh
💼  linkedin.com/in/vaibhavsingh
🐦  @vaibhavsingh

Open to: internships, collabs & freelance`,
    help: `Available commands:
  about     →  Background & bio
  skills    →  Tech stack overview
  projects  →  Featured projects
  contact   →  Get in touch
  clear     →  Clear terminal
  whoami    →  User info`,
    whoami: `vaibhav · developer · dreamer · builder`
};

const termBody = document.getElementById('termBody');
const termInput = document.getElementById('term-input');
function attachTerminalListener(inputEl) {
    inputEl.addEventListener('keydown', function handler(e) {
        if (e.key !== 'Enter') return;

        const cmd = inputEl.value.trim().toLowerCase();
        inputEl.value = '';

        const echoEl = document.createElement('div');
        echoEl.className = 'term-line';
        echoEl.textContent = '$ ' + cmd;
        inputEl.closest('.term-input-line').before(echoEl);

        if (cmd === 'clear') {
            termBody.innerHTML = `
        <div class="term-input-line">
          <span class="term-prompt">$</span>
          <input type="text" id="term-input" placeholder="Enter command..." autocomplete="off" spellcheck="false"/>
        </div>`;
            attachTerminalListener(document.getElementById('term-input'));
            return;
        }

        const out = document.createElement('div');
        out.className = 'term-output';
        out.textContent = termData[cmd] || `Command not found: ${cmd}\nType 'help' for available commands.`;
        inputEl.closest('.term-input-line').before(out);

        termBody.scrollTop = termBody.scrollHeight;
    });
}

attachTerminalListener(termInput);


// ── AI Chat ───────────────────────────────────────────
const aiKB = {
    skills: "Vaibhav is proficient in **C++, Python, JavaScript, React, Node.js, Tailwind CSS, SQL, DSA**, and **Machine Learning** (TensorFlow, PyTorch).",
    projects: "He has built projects including AlgoViz Pro (algorithm visualizer), NeuralChat (AI chatbot), DevSync (collaborative code editor), QueryMind (NL-to-SQL), StockSense (stock ML), and FastRoute API.",
    experience: "Vaibhav is a CS student with hands-on project experience across full-stack development, competitive programming (50+ problems solved), and applied machine learning.",
    available: "Yes! Vaibhav is currently open to **internships**, **collaborative projects**, and **freelance opportunities**. Reach him at vaibhav@email.com.",
    contact: "📧 vaibhav@email.com · ⚡ github.com/vaibhavsingh · 💼 linkedin.com/in/vaibhavsingh",
    dsa: "Vaibhav has solved 50+ competitive programming problems and has deep knowledge of data structures and algorithms in C++.",
    ml: "Vaibhav explores machine learning with TensorFlow and PyTorch, building projects like NeuralChat and StockSense using LSTM and transformer architectures.",
};

function getAIResponse(msg) {
    const m = msg.toLowerCase();
    if (m.includes('skill') || m.includes('tech') || m.includes('language') || m.includes('know')) return aiKB.skills;
    if (m.includes('project') || m.includes('built') || m.includes('work')) return aiKB.projects;
    if (m.includes('experience') || m.includes('background') || m.includes('education')) return aiKB.experience;
    if (m.includes('available') || m.includes('hire') || m.includes('job') || m.includes('internship')) return aiKB.available;
    if (m.includes('contact') || m.includes('reach') || m.includes('email')) return aiKB.contact;
    if (m.includes('dsa') || m.includes('algorithm') || m.includes('competitive')) return aiKB.dsa;
    if (m.includes('ml') || m.includes('machine learning') || m.includes('ai')) return aiKB.ml;
    if (m.includes('hello') || m.includes('hi') || m.includes('hey')) return "Hey there! 👋 I'm Vaibhav's portfolio AI. Ask me about his skills, projects, experience, or how to contact him!";
    return "Great question! Vaibhav is a CS student specializing in full-stack development, DSA, and machine learning. Want to know about his specific skills, projects, or how to get in touch? 🚀";
}

const chatMessages = document.getElementById('chatMessages');
function addMsg(text, type) {
    const div = document.createElement('div');
    div.className = `msg ${type}`;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
function addBotTyping() {
    const div = document.createElement('div');
    div.className = 'msg bot'; div.id = 'typing-indicator';
    div.textContent = '...';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
}
function sendChat() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;
    addMsg(msg, 'user');
    input.value = '';
    const indicator = addBotTyping();
    setTimeout(() => {
        indicator.remove();
        addMsg(getAIResponse(msg), 'bot');
    }, 800);
}
function sendQuick(msg) {
    document.getElementById('chat-input').value = msg;
    sendChat();
}

// ── Contact form ──────────────────────────────────────
function submitForm() {
    const n = document.getElementById('fname').value.trim();
    const e = document.getElementById('femail').value.trim();
    const m = document.getElementById('fmsg').value.trim();
    if (!n || !e || !m) { showToast('⚠ Please fill all fields'); return; }
    showToast('✓ Message sent! I\'ll be in touch soon.');
    document.getElementById('fname').value = '';
    document.getElementById('femail').value = '';
    document.getElementById('fmsg').value = '';
}

// ── Nav scroll shrink ─────────────────────────────────
window.addEventListener('scroll', () => {
    document.querySelector('nav').style.height = window.scrollY > 60 ? '52px' : '64px';
});
console.log(`
██╗   ██╗ █████╗ ██╗██████╗ ██╗  ██╗ █████╗ ██╗   ██╗
██║   ██║██╔══██╗██║██╔══██╗██║  ██║██╔══██╗██║   ██║
██║   ██║███████║██║██████╔╝███████║███████║██║   ██║
╚██╗ ██╔╝██╔══██║██║██╔═══╝ ██╔══██║██╔══██║╚██╗ ██╔╝
 ╚████╔╝ ██║  ██║██║██║     ██║  ██║██║  ██║ ╚████╔╝ 
  ╚═══╝  ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  

Welcome to my portfolio. Curious minds are welcome.
`);
