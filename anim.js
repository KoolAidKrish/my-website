const header = document.querySelector(".header");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
	const currentScrollY = window.scrollY;
	if (Math.abs(currentScrollY - lastScrollY) < 5) return;
	if (currentScrollY > lastScrollY && currentScrollY > 100) {
		header.classList.add("header--hidden");
	} else {
		header.classList.remove("header--hidden");
	}
	lastScrollY = currentScrollY;
});

const skills = [
  { name: "Java", desc: "General-purpose programming language used in backend systems and Android development.", icon: "https://cdn.svgporn.com/logos/java.svg" },
	{ name: "Python", desc: "Used for scripting, automation, and data analysis.", icon: "https://cdn.svgporn.com/logos/python.svg" },
	{ name: "C#", desc: "Object-oriented language used for game development and .NET applications.", icon: "https://cdn.svgporn.com/logos/c-sharp.svg" },
	{ name: "C++", desc: "High-performance language for systems programming and software engineering.", icon: "https://cdn.svgporn.com/logos/c-plusplus.svg" },
	{ name: "JavaScript", desc: "Core web language for interactive front ends and dynamic web apps.", icon: "https://cdn.svgporn.com/logos/javascript.svg" },
	{ name: "HTML", desc: "Markup language for building web layouts and structure.", icon: "https://cdn.svgporn.com/logos/html-5.svg" },
	{ name: "CSS", desc: "Styling language for responsive and modern web design.", icon: "https://cdn.svgporn.com/logos/css-3.svg" },
	{ name: "MATLAB", desc: "Technical computing environment for simulation and data visualization.", icon:"https://www.svgrepo.com/show/373830/matlab.svg" },
	{ name: "SQL", desc: "Used for database querying and relational data management.", icon: "https://cdn.svgporn.com/logos/sqlite.svg" },
	{ name: "Ruby", desc: "Dynamic language used for web development with Rails.", icon: "https://cdn.svgporn.com/logos/ruby.svg" },
	{ name: "Bash", desc: "Shell scripting for automation and system tasks on Linux.", icon: "https://www.svgrepo.com/show/376359/bash.svg" },
	{ name: "PostgreSQL", desc: "Advanced open-source relational database system.", icon: "https://cdn.svgporn.com/logos/postgresql.svg" },
	{ name: "React", desc: "JavaScript library for building user interfaces.", icon: "https://cdn.svgporn.com/logos/react.svg" },
	{ name: "Node.js", desc: "Server-side JavaScript runtime for building APIs.", icon: "https://cdn.svgporn.com/logos/nodejs.svg" },
	{ name: "Arduino", desc: "Microcontroller platform for embedded hardware projects.", icon: "https://cdn.svgporn.com/logos/arduino.svg" },

];

document.addEventListener("DOMContentLoaded", () => {
	const arena = document.getElementById("skills-arena");
	if (!arena) return;

	const cols = 5;
	const spacing = 120;
	const gridWidth = (cols - 1) * spacing;
	const gridHeight = Math.ceil(skills.length / cols) * spacing;

	const arenaWidth = arena.getBoundingClientRect().width;
	const arenaHeight = arena.offsetHeight;

	let expandedBubble = null; // Track which bubble is expanded

	skills.forEach((skill, i) => {
		const bubble = document.createElement("div");
		bubble.className = "skill-bubble";

		const col = i % cols;
		const row = Math.floor(i / cols);
		const x = (col * spacing) + (row % 2 === 0 ? 0 : spacing / 2) - (gridWidth / 2) + (arenaWidth / 2);
		const y = (row * (spacing * 0.85)) - (gridHeight / 2) + (arenaHeight / 2);

		bubble.style.left = `${x}px`;
		bubble.style.top = `${y}px`;
		bubble.dataset.origX = x;
		bubble.dataset.origY = y;

		// Icon shown when collapsed
		const icon = document.createElement("img");
		icon.src = skill.icon;
		icon.alt = skill.name;
		icon.className = "bubble-icon";

		// Content shown when expanded
		const content = document.createElement("div");
		content.className = "bubble-content";
		content.innerHTML = `
			<button class="bubble-close">&times;</button>
			<img class="card-icon" src="${skill.icon}" alt="${skill.name}">
			<h2>${skill.name}</h2>
			<hr class="bubble-divider">
			<p>${skill.desc}</p>
		`;

		bubble.appendChild(icon);
		bubble.appendChild(content);

		// Staggered entrance animation
		bubble.style.animationDelay = `${1.1 + i * 0.1}s`;
		bubble.classList.add("bubble--enter");

		// Remove animation class after it finishes so hover transform works cleanly
		bubble.addEventListener("animationend", () => {
			bubble.classList.remove("bubble--enter");
			bubble.style.opacity = "1";
			bubble.style.animationDelay = "";
		}, { once: true });

		// --- Expand on click ---
		bubble.addEventListener("click", (e) => {
			// If already expanded, don't re-expand
			if (bubble.classList.contains("bubble--expanded")) return;

			// Collapse any other open bubble first
			if (expandedBubble && expandedBubble !== bubble) {
				collapseBubble(expandedBubble);
			}

			expandedBubble = bubble;

			// Step 1: record current screen position
			const rect = bubble.getBoundingClientRect();

			// Step 2: pull out of arena flow by switching to fixed at current coords
			bubble.style.position = "fixed";
			bubble.style.left = `${rect.left}px`;
			bubble.style.top = `${rect.top}px`;
			bubble.style.width = `${rect.width}px`;
			bubble.style.height = `${rect.height}px`;
			bubble.style.zIndex = "2000";

			// Step 3: small delay then animate to expanded state
			setTimeout(() => {
				bubble.classList.add("bubble--expanded");
			}, 20);
		});

		// --- Close button ---
		content.querySelector(".bubble-close").addEventListener("click", (e) => {
			e.stopPropagation(); // Don't re-trigger expand
			collapseBubble(bubble);
			expandedBubble = null;
		});

		arena.appendChild(bubble);
	});

	// --- Collapse helper ---
	function collapseBubble(bubble) {
		bubble.classList.remove("bubble--expanded");
		bubble.classList.add("bubble--collapsing");

		bubble.addEventListener("transitionend", function handler() {
			bubble.classList.remove("bubble--collapsing");
			// Restore absolute positioning inside the arena
			bubble.style.position = "absolute";
			bubble.style.left = `${bubble.dataset.origX}px`;
			bubble.style.top = `${bubble.dataset.origY}px`;
			bubble.style.width = "";
			bubble.style.height = "";
			bubble.style.zIndex = "";
			bubble.removeEventListener("transitionend", handler);
		});
	}

	// --- Mouse repulsion ---
	arena.addEventListener("mousemove", (e) => {
		const rect = arena.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		document.querySelectorAll(".skill-bubble").forEach(bubble => {
			if (bubble.classList.contains("bubble--expanded")) return;

			const bX = parseFloat(bubble.dataset.origX) + 40;
			const bY = parseFloat(bubble.dataset.origY) + 40;

			const deltaX = mouseX - bX;
			const deltaY = mouseY - bY;
			const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

			if (distance < 250) {
				const pushFactor = (250 - distance) / 15;
				const moveX = (deltaX / distance) * -pushFactor;
				const moveY = (deltaY / distance) * -pushFactor;
				bubble.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
			} else {
				bubble.style.transform = `translate(0, 0) scale(1)`;
			}
		});
	});
});