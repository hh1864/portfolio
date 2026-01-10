const INFO = {
	main: {
		title: "Reyna's Portfolio",
		name: "Reyna M.",
		email: "r.d.macabebe@gmail.com",
		logo: "logo.png",
	},

	socials: {
		twitter: "https://twitter.com/",
		github: "https://github.com/",
		linkedin: "https://linkedin.com/",
		instagram: "https://instagram.com/",
		stackoverflow: "https://stackoverflow.com/",
		facebook: "https://facebook.com/",
	},

	homepage: {
		title: "Computer Science Graduate with an Eye for Design",
		description:
			"I am a recent Computer Science graduate from Wayne State University who enjoys solving complex problems and continuously learning new skills. I am passionate about blending design with functionality, creating clean, scalable code and intuitive UI and UX experiences. I am always looking for new challenges and opportunities to grow as a software developer and contribute to meaningful, well crafted projects.",
	},

	about: {
		title: "The Artist behind the Code",
		description:
			"I've worked on a variety of projects over the years and I'm proud of the progress I've made. Many of these projects are open-source and available for others to explore and contribute to. If you're interested in any of the projects I've worked on, please feel free to check out the code and suggest any improvements or enhancements you might have in mind. Collaborating with others is a great way to learn and grow, and I'm always open to new ideas and feedback.",
	},

	projects: [
		{
			title: "Project 1",
			description:
				"Lorem ipsum dolor sit amet. Et incidunt voluptatem ex tempore repellendus qui dicta nemo sit deleniti minima.",
			logo: "https://cdn.jsdelivr.net/npm/programming-languages-logos/src/javascript/javascript.png",
			linkText: "View Project",
			link: "https://github.com",
		},

		{
			title: "Project 2",
			description:
				"Lorem ipsum dolor sit amet. Et incidunt voluptatem ex tempore repellendus qui dicta nemo sit deleniti minima.",
			logo: "https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
			linkText: "View Project",
			link: "https://github.com",
		},

		{
			title: "Project 3",
			description:
				"Lorem ipsum dolor sit amet. Et incidunt voluptatem ex tempore repellendus qui dicta nemo sit deleniti minima.",
			logo: "https://cdn.jsdelivr.net/npm/programming-languages-logos/src/html/html.png",
			linkText: "View Project",
			link: "https://github.com",
		},

		// {
		// 	title: "Project 4",
		// 	description:
		// 		"Lorem ipsum dolor sit amet. Et incidunt voluptatem ex tempore repellendus qui dicta nemo sit deleniti minima.",
		// 	logo: "https://cdn.jsdelivr.net/npm/programming-languages-logos/src/javascript/javascript.png",
		// 	linkText: "View Project",
		// 	link: "https://github.com",
		// },

		// {
		// 	title: "Project 5",
		// 	description:
		// 		"Lorem ipsum dolor sit amet. Et incidunt voluptatem ex tempore repellendus qui dicta nemo sit deleniti minima.",
		// 	logo: "https://cdn.jsdelivr.net/npm/programming-languages-logos/src/javascript/javascript.png",
		// 	linkText: "View Project",
		// 	link: "https://github.com",
		// },
	],

	documentsApps: [
		{
			key: "skills",
			name: "Skills",
			path: "/documents/skills",
			imageClass: "nav-tile-documents-skills",
			title: "Skills Folder",
			description:
				"Placeholder text for a Skills document. Replace this with real content.",
		},
		{
			key: "work",
			name: "Work",
			path: "/documents/work",
			imageClass: "nav-tile-documents-work",
			title: "Work Folder",
			description:
				"Placeholder text for a Work document. Replace this with real content.",
		},
		{
			key: "webpage",
			name: "Webpage",
			path: "/documents/webpage",
			imageClass: "nav-tile-documents-webpage",
			title: "Webpage Folder",
			description:
				"Placeholder text for a Webpage document. Replace this with real content.",
		},
	],

	apps: [
		{ key: "about", label: "About", to: "/about", imageClass: "nav-tile-about" },
		{
			key: "projects",
			label: "Projects",
			to: "/projects",
			imageClass: "nav-tile-projects",
		},
		{
			key: "contact",
			label: "Contact",
			to: "/contact",
			imageClass: "nav-tile-contact",
		},
		{
			key: "documents",
			label: "Documents",
			to: "/documents",
			imageClass: "nav-tile-documents",
		},
		{
			key: "skills",
			label: "Skills",
			to: "/documents/skills",
			imageClass: "nav-tile-documents-skills",
		},
		{
			key: "work",
			label: "Work",
			to: "/documents/work",
			imageClass: "nav-tile-documents-work",
		},
		{
			key: "webpage",
			label: "Webpage",
			to: "/documents/webpage",
			imageClass: "nav-tile-documents-webpage",
		},
		{ key: "trash", 
			label: "Trash", 
			to: "/trash", 
			imageClass: "nav-tile-trash", 
		},
	],
};

export default INFO;
