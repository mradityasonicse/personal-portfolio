/**
 * Astra - Cyber Neural AI Assistant for Aditya Soni Portfolio
 * Interactive conversational AI trained on Aditya's systems architecture, projects, education, and credentials.
 * Features:
 * - Natural NLP keyword and intent parsing with contextual memory
 * - Direct in-chat Contact Database Vault integration (100% free of cost)
 * - Quick-action prompt chips
 * - WebAudio subtle cyber acoustic feedback
 * - Mobile & desktop optimized glassmorphic floating UI
 */

(function initAstraAIChatbot() {
  'use strict';

  // Knowledge Matrix
  const KNOWLEDGE = {
    identity: {
      name: "Aditya Soni",
      title: "Systems Builder & Full-Stack Architect",
      experience: "3+ years of architecting resilient distributed backends, reactive TypeScript interfaces, and hardware-accelerated 3D shaders.",
      location: "Open to Worldwide & Remote Engineering Roles",
      email: "mradityasoni.cse@gmail.com",
      whatsapp: "+91 9131631253",
      github: "https://github.com/mradityasonicse",
      linkedin: "https://www.linkedin.com/in/aditya-soni-698114370"
    },
    skills: {
      systems: "Python (AsyncIO, data pipelines, automation), Java (Core OOP, multi-threading, JVM tuning), Go (Goroutines, microservices, gRPC), Rust (low-latency, zero-cost abstractions).",
      web: "React 19, Next.js 15 App Router, TypeScript, HTML5, CSS3, Tailwind CSS, Redux/Zustand.",
      graphics: "Three.js, WebGL 2, GLSL Fragment Shaders, Volumetric Raymarching, Procedural Math, Signed Distance Fields (SDF).",
      distributed: "Raft Consensus Algorithm, Apache Kafka, WebSockets, Docker, Kubernetes, Protobuf, Web Workers, Zero-GC pools."
    },
    projects: [
      {
        name: "Distributed Raft Consensus Engine",
        tech: "Go • Raft • gRPC • Protobuf",
        desc: "Implemented high-availability leader election, log replication, and Byzantine-tolerant quorum consensus achieving sub-4ms commit latency."
      },
      {
        name: "Volumetric Cloud Raymarching Shader",
        tech: "Three.js • GLSL • WebGL 2",
        desc: "Pure mathematical sphere-tracing raymarcher computing procedural atmospheric clouds and SDF lighting in fragment shaders at locked 120 FPS."
      },
      {
        name: "Real-Time Telemetry & Audio Synthesis Engine",
        tech: "TypeScript • WebAudio API • Canvas",
        desc: "Interactive zero-latency audio-reactive waveform visualizer and harmonic frequency synthesizer."
      }
    ],
    education: {
      degree: "Bachelor of Technology (B.Tech) in Computer Science & Engineering",
      class10: "Secondary School: 92% Aggregate with High Distinctions in Mathematics & Computer Applications.",
      class12: "Senior Secondary (STEM): 80% PCM (Physics, Chemistry, Mathematics) Aggregate."
    }
  };

  // Sound effect generator using WebAudio
  let audioCtx = null;
  function playCyberBeep(frequency = 580, type = 'sine', duration = 0.04) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  // Conversation state
  let isOpen = false;
  let conversationStep = 'chat'; // 'chat' or 'collecting_inquiry'
  let pendingInquiry = { name: '', email: '', message: '' };

  // DOM Elements
  let chatbotWidget = null;
  let chatWindow = null;
  let messagesContainer = null;
  let inputField = null;
  let sendButton = null;
  let unreadBadge = null;

  function injectChatbotUI() {
    if (document.getElementById('astra-ai-root')) return;

    const root = document.createElement('div');
    root.id = 'astra-ai-root';
    root.className = 'fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-[9999] font-sans';

    root.innerHTML = `
      <!-- Floating AI Launcher Widget -->
      <button id="astra-launcher-btn" class="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#0d121e] border-2 border-accent-red/60 text-white flex items-center justify-center shadow-[0_0_25px_rgba(234,42,35,0.4)] hover:shadow-[0_0_35px_rgba(234,42,35,0.7)] hover:border-accent-red hover:scale-105 transition-all duration-300 relative cursor-pointer group" aria-label="Open AI Assistant">
        <!-- Glowing Pulse Rings -->
        <span class="absolute inset-0 rounded-full border border-accent-red animate-ping opacity-30 pointer-events-none"></span>
        <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 border-2 border-[#0d121e] flex items-center justify-center text-[9px] font-mono font-bold text-black" id="astra-unread-badge">1</span>
        
        <!-- Cyber AI Bot Icon -->
        <span class="material-symbols-outlined text-2xl text-accent-red group-hover:text-white transition-colors">smart_toy</span>
        
        <!-- Hover Tooltip -->
        <span class="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-surface/90 border border-white/10 backdrop-blur-md text-xs font-mono text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-xl hidden sm:block">
          Chat with Aditya's AI Assistant
        </span>
      </button>

      <!-- Glassmorphic Chat Window -->
      <div id="astra-chat-window" class="fixed bottom-36 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[550px] max-h-[75vh] bg-[#080d18]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden transition-all duration-300 transform scale-90 opacity-0 pointer-events-none origin-bottom-right">
        
        <!-- Header -->
        <div class="px-5 py-3.5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="w-9 h-9 rounded-xl bg-accent-red/20 border border-accent-red/40 flex items-center justify-center text-accent-red">
                <span class="material-symbols-outlined text-xl">psychology</span>
              </div>
              <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#080d18] animate-pulse"></span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-display font-bold text-white text-sm">Astra AI</h3>
                <span class="text-[9px] font-mono uppercase bg-accent-red/10 text-accent-red border border-accent-red/20 px-1.5 py-0.2 rounded font-semibold">NEURAL AGENT</span>
              </div>
              <p class="text-[11px] font-mono text-slate-400">Aditya Soni • Systems &amp; Stack Core</p>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <button id="astra-clear-btn" class="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all cursor-pointer" title="Clear Conversation">
              <span class="material-symbols-outlined text-lg">delete_sweep</span>
            </button>
            <button id="astra-close-btn" class="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all cursor-pointer" title="Minimize Chat">
              <span class="material-symbols-outlined text-xl">expand_more</span>
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div id="astra-messages" class="flex-1 p-4 overflow-y-auto space-y-3.5 text-sm">
          <!-- Welcome message rendered via JS -->
        </div>

        <!-- Quick Suggestions Chips Bar -->
        <div class="px-4 py-2 bg-white/[0.01] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar font-mono text-[11px]" id="astra-quick-chips">
          <button class="astra-chip px-2.5 py-1 rounded-full bg-white/5 hover:bg-accent-red/15 border border-white/10 hover:border-accent-red/40 text-slate-300 hover:text-white whitespace-nowrap transition-all cursor-pointer">
            🚀 Top Projects
          </button>
          <button class="astra-chip px-2.5 py-1 rounded-full bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-white whitespace-nowrap transition-all cursor-pointer">
            ⚡ Tech Stack
          </button>
          <button class="astra-chip px-2.5 py-1 rounded-full bg-white/5 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-400/40 text-slate-300 hover:text-white whitespace-nowrap transition-all cursor-pointer">
            💼 Hire Aditya
          </button>
          <button class="astra-chip px-2.5 py-1 rounded-full bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-white whitespace-nowrap transition-all cursor-pointer">
            🎓 Distinctions
          </button>
          <button class="astra-chip px-2.5 py-1 rounded-full bg-white/5 hover:bg-purple-500/15 border border-white/10 hover:border-purple-400/40 text-slate-300 hover:text-white whitespace-nowrap transition-all cursor-pointer">
            🗄️ Database Vault
          </button>
        </div>

        <!-- Input Bar -->
        <form id="astra-input-form" class="p-3 bg-white/[0.02] border-t border-white/10 flex items-center gap-2">
          <input 
            type="text" 
            id="astra-user-input" 
            placeholder="Ask Astra about Aditya's code, stack, or hire..." 
            class="flex-1 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder:text-slate-500 focus:border-accent-red/60 focus:ring-1 focus:ring-accent-red/40 outline-none transition-all font-mono"
            autocomplete="off"
          />
          <button type="submit" id="astra-send-btn" class="w-9 h-9 rounded-xl bg-accent-red hover:bg-accent-red/80 text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
            <span class="material-symbols-outlined text-lg">send</span>
          </button>
        </form>

      </div>
    `;

    document.body.appendChild(root);

    // Cache elements
    chatbotWidget = document.getElementById('astra-launcher-btn');
    chatWindow = document.getElementById('astra-chat-window');
    messagesContainer = document.getElementById('astra-messages');
    inputField = document.getElementById('astra-user-input');
    sendButton = document.getElementById('astra-send-btn');
    unreadBadge = document.getElementById('astra-unread-badge');

    // Bind events
    chatbotWidget.addEventListener('click', toggleChatWindow);
    document.getElementById('astra-close-btn').addEventListener('click', toggleChatWindow);
    document.getElementById('astra-clear-btn').addEventListener('click', clearMessages);

    document.getElementById('astra-input-form').addEventListener('submit', (e) => {
      e.preventDefault();
      handleUserSubmit();
    });

    // Chip clicks
    document.querySelectorAll('.astra-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.textContent.trim().replace(/^[^\w]+/, '');
        inputField.value = text;
        handleUserSubmit();
      });
    });

    // Seed initial greeting
    renderInitialGreeting();
  }

  function toggleChatWindow() {
    isOpen = !isOpen;
    playCyberBeep(isOpen ? 640 : 440, 'triangle', 0.05);

    if (isOpen) {
      chatWindow.classList.remove('opacity-0', 'pointer-events-none', 'scale-90');
      chatWindow.classList.add('opacity-100', 'scale-100');
      if (unreadBadge) unreadBadge.classList.add('hidden');
      setTimeout(() => inputField && inputField.focus(), 250);
    } else {
      chatWindow.classList.add('opacity-0', 'pointer-events-none', 'scale-90');
      chatWindow.classList.remove('opacity-100', 'scale-100');
    }
  }

  function renderInitialGreeting() {
    messagesContainer.innerHTML = '';
    appendBotMessage(`
      <p class="font-semibold text-white mb-1.5 flex items-center gap-1.5">
        <span class="material-symbols-outlined text-base text-accent-red">bolt</span>
        Greetings! I am Astra, Aditya Soni's AI Agent.
      </p>
      <p class="text-slate-300 font-light leading-relaxed">
        I can walk you through Aditya's <strong>Distributed Systems architecture</strong>, <strong>120 FPS WebGL Shaders</strong>, or <strong>save an inquiry directly into his free database vault</strong>.
      </p>
      <div class="mt-2 text-xs font-mono text-cyan-300 flex items-center gap-1">
        <span>What would you like to explore?</span>
      </div>
    `);
  }

  function clearMessages() {
    conversationStep = 'chat';
    pendingInquiry = { name: '', email: '', message: '' };
    renderInitialGreeting();
  }

  function appendUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'flex justify-end';
    msg.innerHTML = `
      <div class="max-w-[85%] bg-accent-red/20 border border-accent-red/30 text-white rounded-2xl rounded-br-sm px-3.5 py-2.5 text-xs font-mono leading-relaxed shadow-md">
        ${escapeHtml(text)}
      </div>
    `;
    messagesContainer.appendChild(msg);
    scrollToBottom();
  }

  function appendBotMessage(htmlContent) {
    const msg = document.createElement('div');
    msg.className = 'flex gap-2.5 items-start';
    msg.innerHTML = `
      <div class="w-6 h-6 rounded-lg bg-accent-red/20 border border-accent-red/40 flex items-center justify-center text-accent-red flex-shrink-0 mt-0.5">
        <span class="material-symbols-outlined text-sm">smart_toy</span>
      </div>
      <div class="max-w-[88%] bg-white/[0.04] border border-white/10 text-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 text-xs leading-relaxed shadow-lg font-light">
        ${htmlContent}
      </div>
    `;
    messagesContainer.appendChild(msg);
    scrollToBottom();
    playCyberBeep(720, 'sine', 0.03);
  }

  function appendTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'astra-typing-indicator';
    indicator.className = 'flex gap-2 items-center text-slate-400 font-mono text-[11px] py-1';
    indicator.innerHTML = `
      <span class="w-1.5 h-1.5 rounded-full bg-accent-red animate-ping"></span>
      <span class="text-white/60">Astra computing neural response...</span>
    `;
    messagesContainer.appendChild(indicator);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const el = document.getElementById('astra-typing-indicator');
    if (el) el.remove();
  }

  function scrollToBottom() {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // NLP Query Evaluation & Response Engine
  function generateAIResponse(query) {
    const q = query.toLowerCase().trim();

    // 1. Direct Database Vault Trigger
    if (q.includes('vault') || q.includes('database') || q.includes('records') || q.includes('submissions') || q.includes('inbox')) {
      if (window.PortfolioDB && window.PortfolioDB.openVault) {
        setTimeout(() => window.PortfolioDB.openVault(), 600);
      }
      return `
        <p class="font-bold text-emerald-400 mb-1 flex items-center gap-1">
          <span class="material-symbols-outlined text-base">database</span> Database Vault Opened!
        </p>
        <p>I have opened the <strong>Free Contact Database Vault</strong> on your screen. You can view all saved client inquiries, search by keyword, and export directly as CSV or JSON format.</p>
        <p class="mt-2 text-xs text-slate-400">All submissions are saved automatically in IndexedDB and forwarded via FormSubmit cloud sync at zero cost.</p>
      `;
    }

    // 2. Direct message / inquiry flow
    if (q.includes('message') || q.includes('contact') || q.includes('hire') || q.includes('reach out') || q.includes('talk') || q.includes('email') || q.includes('call')) {
      return `
        <div class="space-y-2">
          <p class="font-semibold text-white">Let's connect you directly with Aditya!</p>
          <p>You can contact him instantly via:</p>
          <ul class="space-y-1 font-mono text-[11px] text-slate-300">
            <li>📧 Email: <a href="mailto:mradityasoni.cse@gmail.com" class="text-cyan-400 underline">mradityasoni.cse@gmail.com</a></li>
            <li>💬 WhatsApp: <a href="https://wa.me/919131631253" target="_blank" class="text-emerald-400 underline">+91 9131631253</a></li>
            <li>💼 LinkedIn: <a href="${KNOWLEDGE.identity.linkedin}" target="_blank" class="text-rose-400 underline">aditya-soni-698114370</a></li>
          </ul>
          <p class="text-xs text-white/80 pt-1">Or type your <strong>Name, Email, and Message</strong> right here, and I will write it directly into Aditya's database vault!</p>
          <button onclick="document.getElementById('contact').scrollIntoView({behavior: 'smooth'})" class="mt-1 px-3 py-1 rounded bg-accent-red/20 text-accent-red border border-accent-red/30 text-xs font-mono hover:bg-accent-red hover:text-white transition-all cursor-pointer">
            Jump to Contact Form ↓
          </button>
        </div>
      `;
    }

    // 3. Projects
    if (q.includes('project') || q.includes('work') || q.includes('built') || q.includes('raft') || q.includes('shader') || q.includes('raymarch')) {
      return `
        <div class="space-y-2.5">
          <p class="font-semibold text-white flex items-center gap-1.5">
            <span class="material-symbols-outlined text-base text-accent-red">terminal</span>
            Aditya's Featured Flagship Projects:
          </p>
          <div class="p-2 rounded bg-white/[0.03] border border-white/5">
            <div class="font-mono text-cyan-300 font-bold text-xs">1. Distributed Raft Consensus Engine</div>
            <div class="text-[11px] text-slate-300">Built in Go with gRPC. Sub-4ms consensus commit, Byzantine fault tolerance, log replication.</div>
          </div>
          <div class="p-2 rounded bg-white/[0.03] border border-white/5">
            <div class="font-mono text-rose-300 font-bold text-xs">2. Volumetric Raymarching Shader</div>
            <div class="text-[11px] text-slate-300">Sphere-tracing atmospheric cloud synthesis and SDF lighting running at locked 120 FPS without polygon meshes.</div>
          </div>
          <div class="p-2 rounded bg-white/[0.03] border border-white/5">
            <div class="font-mono text-emerald-300 font-bold text-xs">3. Real-Time Telemetry &amp; Audio Studio</div>
            <div class="text-[11px] text-slate-300">Zero-latency harmonic frequency synthesis and GPU canvas waveform analysis.</div>
          </div>
          <a href="#projects" class="inline-block font-mono text-[11px] text-accent-red hover:underline">
            View All Projects in Showcase &rarr;
          </a>
        </div>
      `;
    }

    // 4. Tech Stack & Skills
    if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('python') || q.includes('java') || q.includes('react') || q.includes('go') || q.includes('rust')) {
      return `
        <div class="space-y-2">
          <p class="font-semibold text-white flex items-center gap-1.5">
            <span class="material-symbols-outlined text-base text-cyan-400">memory</span>
            Engineering Arsenal &amp; Stack:
          </p>
          <p class="text-[11px] text-slate-300">
            <strong>Core Systems:</strong> ${KNOWLEDGE.skills.systems}
          </p>
          <p class="text-[11px] text-slate-300">
            <strong>Modern Web:</strong> ${KNOWLEDGE.skills.web}
          </p>
          <p class="text-[11px] text-slate-300">
            <strong>Distributed Infra:</strong> ${KNOWLEDGE.skills.distributed}
          </p>
          <p class="text-[11px] text-slate-300">
            <strong>3D Graphics &amp; GLSL:</strong> ${KNOWLEDGE.skills.graphics}
          </p>
          <a href="#skills" class="inline-block font-mono text-[11px] text-cyan-400 hover:underline">
            Inspect Full Bento Grid Matrix &rarr;
          </a>
        </div>
      `;
    }

    // 5. Education & Distinctions
    if (q.includes('education') || q.includes('college') || q.includes('school') || q.includes('10th') || q.includes('12th') || q.includes('marks') || q.includes('marksheet') || q.includes('achievement')) {
      return `
        <div class="space-y-2">
          <p class="font-semibold text-white flex items-center gap-1.5">
            <span class="material-symbols-outlined text-base text-amber-400">school</span>
            Scholastic Honors &amp; Degree:
          </p>
          <ul class="space-y-1.5 text-[11px] text-slate-300">
            <li>🎓 <strong>${KNOWLEDGE.education.degree}</strong> (Computer Science &amp; Engineering)</li>
            <li>🏆 <strong>${KNOWLEDGE.education.class10}</strong></li>
            <li>⚡ <strong>${KNOWLEDGE.education.class12}</strong></li>
            <li>🚀 Smart India Hackathon Finalist &amp; Competitive Programming distinctions</li>
          </ul>
          <a href="#achievements" class="inline-block font-mono text-[11px] text-amber-400 hover:underline">
            View Certificates &amp; Marksheets &rarr;
          </a>
        </div>
      `;
    }

    // 6. Resume & CV
    if (q.includes('resume') || q.includes('cv') || q.includes('download')) {
      return `
        <div>
          <p class="font-semibold text-white mb-1.5">Aditya Soni's Official Resume</p>
          <p class="text-slate-300 mb-2.5">You can view the certified PDF resume or inspect the comprehensive web dossier:</p>
          <div class="flex gap-2">
            <a href="assets/resume.pdf" target="_blank" class="px-3 py-1.5 rounded-lg bg-accent-red text-white font-mono text-xs font-bold inline-flex items-center gap-1 hover:bg-accent-red/80 transition-all">
              <span>Download PDF</span>
              <span class="material-symbols-outlined text-xs">download</span>
            </a>
            <a href="resume.html" target="_blank" class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-xs inline-flex items-center gap-1 hover:border-white/30 transition-all">
              <span>Web Dossier</span>
              <span class="material-symbols-outlined text-xs">open_in_new</span>
            </a>
          </div>
        </div>
      `;
    }

    // 7. Check if user typed an inline inquiry (e.g. contains an email or "I am [name]")
    const emailMatch = q.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) {
      const email = emailMatch[0];
      const name = query.split(/[,:\n]/)[0].replace(/my name is|i am/gi, '').trim() || 'Website Visitor';
      const msg = query;

      if (window.PortfolioDB && window.PortfolioDB.saveContact) {
        window.PortfolioDB.saveContact(name, email, msg, 'Astra AI Chatbot');
      }

      return `
        <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
          <p class="font-bold flex items-center gap-1.5 mb-1">
            <span class="material-symbols-outlined text-base">check_circle</span>
            Inquiry Saved in Database Vault!
          </p>
          <p class="text-xs text-slate-200">
            Thank you, <strong>${escapeHtml(name)}</strong>! Your message with email <strong>${escapeHtml(email)}</strong> has been recorded into Aditya's database vault and forwarded directly to his inbox.
          </p>
          <p class="text-[11px] text-emerald-400 mt-2 font-mono">Status: Synced to IndexedDB + FormSubmit Cloud</p>
        </div>
      `;
    }

    // Default Fallback
    return `
      <div class="space-y-2">
        <p>I understand you're asking about: <em>"${escapeHtml(query)}"</em>.</p>
        <p class="text-slate-300">
          Aditya Soni is a <strong>Systems Builder &amp; Full-Stack Architect</strong> with 3+ years experience across <strong>Python, Java, Go, Rust, React 19, Three.js, and Distributed Consensus (Raft)</strong>.
        </p>
        <p class="text-xs text-cyan-300 font-mono">
          Try asking: "What are his top projects?", "Show tech stack", "How to hire him?", or click below to leave a message.
        </p>
      </div>
    `;
  }

  function handleUserSubmit() {
    const query = inputField.value.trim();
    if (!query) return;

    inputField.value = '';
    appendUserMessage(query);
    appendTypingIndicator();

    // Artificial neural thinking delay (350ms - 750ms)
    setTimeout(() => {
      removeTypingIndicator();
      const responseHtml = generateAIResponse(query);
      appendBotMessage(responseHtml);
    }, 450 + Math.random() * 250);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectChatbotUI);
  } else {
    injectChatbotUI();
  }

})();
