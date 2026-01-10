import {
	Routes,
	Route,
	useLocation,
	useNavigate,
	matchPath,
} from "react-router-dom";
import { useEffect, useState } from "react";

import Homepage from "./pages/homepage.jsx";
import About from "./pages/about.jsx";
import Projects from "./pages/projects.jsx";
import Contact from "./pages/contact.jsx";
import DocumentApp from "./pages/documentApp.jsx";
import SkillsDocument from "./pages/skillsDocument.jsx";
import WorkDocument from "./pages/workDocument.jsx";
import WebpageDocument from "./pages/webpageDocument.jsx";
import OverlayModal from "./components/common/overlayModal.jsx";
import { getNextWindowZIndex } from "./utils/windowStack.js";

import "./App.css";

export default function App() {
	const location = useLocation();
	const navigate = useNavigate();
	const [windows, setWindows] = useState([]);

	const windowRoutes = [
		{ path: "/about", title: "About" },
		{ path: "/projects", title: "Projects" },
		{ path: "/contact", title: "Contact" },
		{
			path: "/documents/skills",
			title: "Skills",
			initialSize: { width: 500, height: 520 },
			minSize: { width: 360, height: 270 },
			spawnOffset: { x: 300, y: 20 },
			allowMultiple: true,
		},
		{
			path: "/documents/work",
			title: "Work",
			initialSize: { width: 500, height: 520 },
			minSize: { width: 360, height: 270 },
			spawnOffset: { x: 300, y: 20 },
			allowMultiple: true,
		},
		{
			path: "/documents/webpage",
			title: "Webpage",
			initialSize: { width: 500, height: 520 },
			minSize: { width: 360, height: 270 },
			spawnOffset: { x: 300, y: 20 },
			allowMultiple: true,
		},
		{
			path: "/documents/:slug",
			title: "Document",
			initialSize: { width: 500, height: 520 },
			minSize: { width: 360, height: 270 },
			spawnOffset: { x: 300, y: 20 },
			allowMultiple: true,
		},
	];

	const getWindowForPath = (pathname) => {
		for (const route of windowRoutes) {
			const match = matchPath({ path: route.path, end: true }, pathname);
			if (match) {
				const countKey = route.path.includes(":") ? pathname : route.path;
				return {
					path: pathname,
					title: route.title,
					countKey,
					initialSize: route.initialSize,
					minSize: route.minSize,
					spawnOffset: route.spawnOffset,
					allowMultiple: route.allowMultiple,
				};
			}
		}

		return null;
	};

	useEffect(() => {
		if (location.pathname === "/") {
			return;
		}

		const nextWindow = getWindowForPath(location.pathname);
		if (!nextWindow) {
			return;
		}

		setWindows((prev) => {
			const count = nextWindow.allowMultiple
				? prev.filter((item) => item.path === nextWindow.path).length
				: prev.filter((item) => item.countKey === nextWindow.countKey).length;
			if (count >= 10) {
				return prev;
			}

			const offsetIndex = prev.length;
			const spawnOffset = nextWindow.spawnOffset || { x: 0, y: 0 };
			return [
				...prev,
				{
					...nextWindow,
					key: location.key,
					countKey: nextWindow.allowMultiple
						? location.key
						: nextWindow.countKey,
					zIndex: getNextWindowZIndex(),
					offset: {
						x: spawnOffset.x + 22 * offsetIndex,
						y: spawnOffset.y + 18 * offsetIndex,
					},
				},
			];
		});
	}, [location.key, location.pathname]);

	const handleCloseWindow = (key) => {
		setWindows((prev) => prev.filter((item) => item.key !== key));
		navigate("/");
	};

	const handleMoveWindow = (key, direction) => {
		setWindows((prev) => {
			const current = prev.find((item) => item.key === key);
			if (!current) {
				return prev;
			}

			const sorted = [...prev].sort((a, b) => a.zIndex - b.zIndex);
			const index = sorted.findIndex((item) => item.key === key);
			const swapIndex =
				direction === "up"
					? Math.min(sorted.length - 1, index + 1)
					: Math.max(0, index - 1);
			if (swapIndex === index) {
				return prev;
			}

			const target = sorted[swapIndex];
			return prev.map((item) => {
				if (item.key === current.key) {
					return { ...item, zIndex: target.zIndex };
				}
				if (item.key === target.key) {
					return { ...item, zIndex: current.zIndex };
				}
				return item;
			});
		});
	};

	const handleActivateWindow = (key) => {
		setWindows((prev) => {
			const exists = prev.some((item) => item.key === key);
			if (!exists) {
				return prev;
			}

			const nextZIndex = getNextWindowZIndex();
			return prev.map((item) =>
				item.key === key ? { ...item, zIndex: nextZIndex } : item
			);
		});
	};

	return (
		<>
			<Homepage />
			{windows.map((window, index) => (
				<OverlayModal
					key={window.key}
					title={window.title}
					onClose={() => handleCloseWindow(window.key)}
					onMoveUp={() => handleMoveWindow(window.key, "up")}
					onMoveDown={() => handleMoveWindow(window.key, "down")}
					onActivate={() => handleActivateWindow(window.key)}
					initialOffset={window.offset}
					initialSize={window.initialSize}
					minSize={window.minSize}
					zIndex={window.zIndex}
				>
					<Routes location={{ pathname: window.path }}>
						<Route path="/about" element={<About />} />
						<Route path="/projects" element={<Projects />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="/documents/skills" element={<SkillsDocument />} />
						<Route path="/documents/work" element={<WorkDocument />} />
						<Route path="/documents/webpage" element={<WebpageDocument />} />
						<Route path="/documents/:slug" element={<DocumentApp />} />
					</Routes>
				</OverlayModal>
			))}
		</>
	);
}
