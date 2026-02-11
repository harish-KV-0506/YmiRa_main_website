const members = [
    { name: "GoDaddy", role: "Operations", desc: "Execution-focused and detail oriented.", linkedin: "#" },
    { name: "Copilot", role: "Operations", desc: "Execution-focused and detail oriented.", linkedin: "#" },
    { name: "Perplexity AI", role: "Operations", desc: "Execution-focused and detail oriented.", linkedin: "#" },
    { name: "Grok", role: "Operations", desc: "Execution-focused and detail oriented.", linkedin: "#" },
    { name: "Gemini", role: "Operations", desc: "Execution-focused and detail oriented.", linkedin: "#" },
    { name: "ChatGPT", role: "Operations", desc: "Execution-focused and detail oriented.", linkedin: "#" },

    {
    name: "Harish K V",
    role: "Founder & Chief Executive Officer (CEO)",
    desc: `I’m not here to impress.
I’m here to create.
I’m Harish — founder of YmiRa.

I question systems.
I build differently.
I don’t follow what’s popular — I follow what’s powerful.

Technology is my tool.
Creativity is my weapon.
Impact is the goal.

If you’re looking for ordinary, this isn’t it.
If you’re looking for something real — welcome.`,
    linkedin: "https://www.linkedin.com/in/harish-k-v10/"
  },
    { name: "Janani J", role: "Co-Founder & Chief Strategy Officer (CSO)", desc: "I am Janani \n a builder at heart — obsessed with solving real-world problems using AI, data, and intelligent systems. She designs high-impact solutions ranging from algorithmic trading engines to scalable cloud-native applications. With a sharp analytical mindset and a bias for action, she turns complex ideas into working products fast. She thrives in fast-moving environments where experimentation, iteration, and innovation drive growth. Focused on the future of predictive AI and automation, Janani is here to build what’s next — not just talk about it.", linkedin: "https://www.linkedin.com/in/janani-j-aa35532a4/" },

  { name: "Visva Sugin N R", role: "Head of UI/UX Design", desc: "I'm Visvasugin, currently pursuing B.Tech CSBS at K. Ramakrishnan College of Engineering, after completing my HSLC at Karur Vetri Vinayaga Hr Sec School. I'm passionate about designing and editing, and I'm on a mission to overcome procrastination and build emotional intelligence. One of my strengths is adapting easily to people and environments, which I believe also sometimes becomes a weakness when I take on too much. Overall, I'm working on turning my passions into strengths and growing as a person", linkedin: "#" },

  { name: "Devi Priya P", role: "Social Media & Growth Manager", desc: "My name is Devipriya P, and I am a dedicated computer science student at K. Ramakrishnan College of Technology.\nI have a strong interest in software development and problem-solving.\nI have basic knowledge of programming languages like Java and Python, along with web technologies.\nI enjoy learning new concepts and applying them through academic and personal projects.\nI aspire to continuously improve my skills and build a successful career in the software industry", linkedin: "https://www.linkedin.com/in/devipriya-p-7a8353327" },

  { name: "Gnyanodhaya S", role: "Content Research Analyst", desc: "I am Gnyanodhaya and I bring a strong blend of technology, data analytics, and creative skills to the team, making her well-suited for fast-paced startup environments. She takes ownership of tasks and effectively translates ideas into scalable, real-world solutions. With hands-on experience in software development, cloud platforms, data analysis, and video editing, she supports both product development and digital communication needs. She approaches problems with a practical, growth-oriented mindset and adapts quickly to change. She consistently adds value by combining analytical thinking with creativity to drive business and user impact.", linkedin: "#" },

  { name: "Arjun J S", role: "Head of Operations", desc: "Accurate and reliable executor.", linkedin: "#" },

  { name: "Hariprakash S", role: "Technical Lead", desc: "Driven to grow and build.", linkedin: "#" },

  { name: "Praveen P", role: "Head of Media Production", desc: "Calm, observant, detail-focused.", linkedin: "#" },

  { name: "Gowtham S", role: "Head of Innovation & AI Systems", desc: "Passionate about meaningful software.", linkedin: "#" }

];

/* =========================
   DOM ELEMENTS
========================= */

const slider = document.getElementById("teamSlider");
const modal = document.getElementById("profileModal");
const modalContent = document.getElementById("modalContent");
const closeBtn = document.getElementById("closeModal");
const modalVideo = document.getElementById("modalVideo");


/* =========================
   CREATE TEAM CARDS
========================= */

members.forEach(member => {
  const card = document.createElement("div");
  card.classList.add("team-card");

  card.innerHTML = `
    <h3>${member.name}</h3>
    <p>${member.role}</p>
  `;

  card.addEventListener("click", () => openModal(member));
  slider.appendChild(card);
});


/* =========================
   MODAL FUNCTIONS
========================= */

function openModal(member) {

  document.getElementById("modalName").textContent = member.name;
  document.getElementById("modalRole").textContent = member.role;
  document.getElementById("modalDesc").textContent = member.desc;
  document.getElementById("modalLinkedin").href = member.linkedin;

  modal.classList.add("active");

  // 🎥 Play video when opened
  if (modalVideo) {
    modalVideo.currentTime = 0;
    modalVideo.play();
  }

  gsap.fromTo(modalContent,
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }
  );
}

function closeModal() {
  modal.classList.remove("active");

  // ⛔ Stop video
  if (modalVideo) {
    modalVideo.pause();
  }
}

closeBtn.addEventListener("click", closeModal);

// Close when clicking outside content
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});


/* =========================
   PARALLAX EFFECT
========================= */

document.addEventListener("mousemove", (e) => {
  const back = document.querySelector(".layer-back");
  const front = document.querySelector(".layer-front");

  if (back) back.style.transform =
    `translate(${e.clientX * 0.01}px, ${e.clientY * 0.01}px)`;

  if (front) front.style.transform =
    `translate(${e.clientX * 0.02}px, ${e.clientY * 0.02}px)`;
});


/* =========================
   WEBGL SHADER BACKGROUND
========================= */

const canvas = document.getElementById("shaderCanvas");

if (canvas) {
  const gl = canvas.getContext("webgl");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);

  const vertexShaderSource = `
    attribute vec4 position;
    void main() {
      gl_Position = position;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    uniform float time;
    void main() {
      vec2 uv = gl_FragCoord.xy / vec2(${window.innerWidth}.0, ${window.innerHeight}.0);
      float color = 0.5 + 0.5 * sin(time + uv.x * 10.0);
      gl_FragColor = vec4(vec3(color * 0.1), 1.0);
    }
  `;

  function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  const vertices = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
     1,  1,
  ]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const timeLocation = gl.getUniformLocation(program, "time");

  function animate(time) {
    gl.uniform1f(timeLocation, time * 0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(animate);
  }

  animate(0);
}