document.addEventListener("DOMContentLoaded", function () {

/* =========================
   MEMBERS DATA
========================= */

const members = [


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

  { name: "Janani J", role: "Co-Founder & Chief Strategy Officer (CSO)", desc: "AI systems strategist building predictive solutions. I am a builder at heart — obsessed with solving real-world problems using AI, data, and intelligent systems. I design high-impact solutions ranging from algorithmic trading engines to scalable cloud-native applications. With a sharp analytical mindset and a bias for action, I turn complex ideas into working products fast. I thrive in fast-moving environments where experimentation, iteration, and innovation drive growth. Focused on the future of predictive AI and automation, I am here to build what’s next — not just talk about it.", linkedin: "https://www.linkedin.com/in/janani-j-aa35532a4/" },
  { name: "Visva Sugin N R", role: "Head of UI/UX Design", desc: "Design-focused creative contributor. I'm Visvasugin, currently pursuing B.Tech CSBS at K. Ramakrishnan College of Engineering, after completing my HSLC at Karur Vetri Vinayaga Hr Sec School. I'm passionate about designing and editing, and I'm on a mission to overcome procrastination and build emotional intelligence. One of my strengths is adapting easily to people and environments, which I believe also sometimes becomes a weakness when I take on too much. Overall, I'm working on turning my passions into strengths and growing as a person", linkedin: "#" },
  { name: "Devi Priya P", role: "Social Media & Growth Manager", desc: "Growth-focused digital strategist.", linkedin: "https://www.linkedin.com/in/devipriya-p-7a8353327" },
  { name: "Gnyanodhaya S", role: "Content Research Analyst", desc: "Structured analytical thinker. I bring a strong blend of technology, data analytics, and creative skills to the team, making me well-suited for fast-paced startup environments. I take ownership of tasks and effectively translate ideas into scalable, real-world solutions. With hands-on experience in software development, cloud platforms, data analysis, and video editing, I support both product development and digital communication needs. I approach problems with a practical, growth-oriented mindset and adapt quickly to change. I consistently add value by combining analytical thinking with creativity to drive business and user impact.", linkedin: "https://www.linkedin.com/in/gnyanodhaya-s-4033b12a4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
  { name: "Arjun J S", role: "Head of Operations", desc: "Accurate and reliable executor. I am a dedicated and goal-oriented young professional who believes in continuous learning and self-improvement. I have strong analytical skills with a keen interest in accounting, aptitude, and cloud technologies. I manage my time effectively and always strive to improve my communication and professional skills. I am passionate about contributing to meaningful work, especially initiatives that help others and support green actions. I am self-aware, confident, and committed to growing into a responsible and impactful professional.", linkedin: "https://www.linkedin.com/in/arjun-js-a792b42a3?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
  { name: "Hariprakash R", role: "Technical Lead", desc: "Driven to grow and build. I am Hariprakash.I’m passionate about technology and always eager to learn new things in the field of software development and design.", linkedin: "https://www.linkedin.com/in/hariprakash-r-4672b42a3?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
  { name: "Praveen P", role: "Head of Media Production", desc: "Calm, observant, detail-focused.", linkedin: "https://www.linkedin.com/in/praveen-parankunran-3194302a3?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
 // { name: "Thomas Livingston", role: "Head of Innovation & AI Systems", desc: "Passionate about meaningful software.", linkedin: "#" }
 // { name: "Gowtham R", role: "Head of Innovation & AI Systems", desc: "Passionate about meaningful software.", linkedin: "#" }
   
   
];

/* =========================
   DOM ELEMENTS
========================= */

const slider = document.getElementById("teamSlider");
const modal = document.getElementById("profileModal");
const modalContent = document.getElementById("modalContent");
const closeBtn = document.getElementById("closeModal");
const modalVideo = document.getElementById("modalVideo");

if (!slider) return; // Stop if section missing

/* =========================
   CREATE TEAM CARDS
========================= */

members.forEach(member => {
  const card = document.createElement("div");
  card.className = "team-card";

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

  const linkedinBtn = document.getElementById("modalLinkedin");
  if (linkedinBtn) linkedinBtn.href = member.linkedin;

  modal.classList.add("active");
  document.body.style.overflow = "hidden"; // lock scroll

  if (modalVideo) {
    modalVideo.currentTime = 0;
    modalVideo.play().catch(() => {});
  }

  if (typeof gsap !== "undefined") {
    gsap.fromTo(modalContent,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power4.out" }
    );
  }
}

function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "auto";

  if (modalVideo) modalVideo.pause();
}

if (closeBtn) closeBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

/* =========================
   PARALLAX EFFECT
========================= */

document.addEventListener("mousemove", (e) => {
  const back = document.querySelector(".layer-back");
  const front = document.querySelector(".layer-front");

  if (back)
    back.style.transform = `translate(${e.clientX * 0.01}px, ${e.clientY * 0.01}px)`;

  if (front)
    front.style.transform = `translate(${e.clientX * 0.02}px, ${e.clientY * 0.02}px)`;
});

/* =========================
   WEBGL SHADER (FIXED)
========================= */

const canvas = document.getElementById("shaderCanvas");

if (canvas) {
  const gl = canvas.getContext("webgl");
  if (!gl) return;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  resize();
  window.addEventListener("resize", resize);

  const vertexShaderSource = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    uniform float time;
    uniform vec2 resolution;

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution;
      float wave = 0.5 + 0.5 * sin(time + uv.x * 10.0);
      gl_FragColor = vec4(vec3(wave * 0.08), 1.0);
    }
  `;

  function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  const program = gl.createProgram();
  gl.attachShader(program, createShader(gl.VERTEX_SHADER, vertexShaderSource));
  gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fragmentShaderSource));
  gl.linkProgram(program);
  gl.useProgram(program);

  const vertices = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
     1,  1
  ]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const timeLocation = gl.getUniformLocation(program, "time");
  const resolutionLocation = gl.getUniformLocation(program, "resolution");

  function animate(time) {
    gl.uniform1f(timeLocation, time * 0.001);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(animate);
  }

  animate(0);
}

});

