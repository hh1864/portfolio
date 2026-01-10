import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import { faMailBulk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTwitter,
	faGithub,
	faStackOverflow,
	faInstagram,
} from "@fortawesome/free-brands-svg-icons";

import Logo from "../components/common/logo";
import Footer from "../components/common/footer";
import NavBar from "../components/common/navBar";
import OverlayModal from "../components/common/overlayModal";
import HomepageApps from "../components/homepage/apps";
import OverlayModalSimple from "../components/homepage/overlayModalSimple";

import INFO from "../data/user";
import { getNextWindowZIndex, getPrevWindowZIndex } from "../utils/windowStack.js";
import SEO from "../data/seo";

import "./styles/homepage.css";

const Homepage = () => {
	const pageContentRef = useRef(null);
	const homepageContentRef = useRef(null);
	const didInitPositions = useRef(false);
	const didInitLayout = useRef(false);
	const documentDragImageRef = useRef(null);
	const [stayLogo, setStayLogo] = useState(false);
	const [logoSize, setLogoSize] = useState(80);
	const [oldLogoSize, setOldLogoSize] = useState(80);
	const [spawnedApps, setSpawnedApps] = useState([]);
	const [appPositions, setAppPositions] = useState([]);
	const [homepageApps, setHomepageApps] = useState(INFO.apps);
	const [documentsWindows, setDocumentsWindows] = useState([]);
	const [selectedDocumentPath, setSelectedDocumentPath] = useState(null);
	const navigate = useNavigate();
	const defaultApps = homepageApps;
	const MOBILE_BREAKPOINT = 768;
	const DEFAULT_APP_WIDTH = 72;
	const DEFAULT_APP_HEIGHT = 96;
	const DEFAULT_APP_SPACING = 120;
	const DEFAULT_RIGHT_PADDING = 24;
	const DEFAULT_BOTTOM_PADDING = 380;
	const DOCUMENT_DOCK_KEYS = ["skills", "work", "webpage"];
	const DOCUMENT_DOCK_GAP = 16;
	const DOCUMENT_DOCK_TO_ABOUT_GAP = 160;
	const TRASH_OFFSET_Y = 200;
	const APP_BOUNDARY_PADDING = 20;

	const isMobileLayout = () => window.innerWidth <= MOBILE_BREAKPOINT;

	const getHomepageBounds = useCallback(() => {
		const pageEl = pageContentRef.current;
		const contentEl = homepageContentRef.current;
		if (!pageEl || !contentEl) {
			return {
				left: 0,
				top: 0,
				width: window.innerWidth,
				height: window.innerHeight,
			};
		}
		const pageRect = pageEl.getBoundingClientRect();
		const contentRect = contentEl.getBoundingClientRect();
		const left = Math.max(0, contentRect.left - pageRect.left);
		const top = Math.max(0, contentRect.top - pageRect.top);
		const width = Math.max(0, contentRect.width - APP_BOUNDARY_PADDING * 2);
		const height = Math.max(
			0,
			Math.max(contentRect.height, window.innerHeight) -
				APP_BOUNDARY_PADDING * 2
		);
		return {
			left: left + APP_BOUNDARY_PADDING,
			top: top + APP_BOUNDARY_PADDING,
			width,
			height,
		};
	}, []);

	const clampPosition = useCallback((position, bounds, size) => {
		const maxX = Math.max(bounds.left, bounds.left + bounds.width - size.width);
		const maxY = Math.max(bounds.top, bounds.top + bounds.height - size.height);
		return {
			x: Math.min(Math.max(position.x, bounds.left), maxX),
			y: Math.min(Math.max(position.y, bounds.top), maxY),
		};
	}, []);

	const getDesktopPosition = (index, total, bounds) => {
		const rightX =
			bounds.left + bounds.width - DEFAULT_APP_WIDTH - DEFAULT_RIGHT_PADDING;
		const stackFromBottom = total - 1 - index;
		return {
			x: rightX,
			y:
				bounds.top +
				bounds.height -
				DEFAULT_BOTTOM_PADDING -
				(stackFromBottom * DEFAULT_APP_SPACING),
		};
	};

	const getMobilePosition = (index, total, bounds) => {
		const paddingX = 16;
		const paddingY = 16;
		const maxWidth = Math.max(0, bounds.width - paddingX * 2);
		const slotWidth = total > 0 ? maxWidth / total : maxWidth;
		const itemWidth = Math.min(72, Math.floor(slotWidth));
		const offsetX = Math.max(0, Math.floor((slotWidth - itemWidth) / 2));
		return {
			x: Math.round(bounds.left + paddingX + (index * slotWidth) + offsetX),
			y: bounds.top + paddingY,
		};
	};

	const getDefaultPosition = (index, total, bounds) =>
		isMobileLayout()
			? getMobilePosition(index, total, bounds)
			: getDesktopPosition(index, total, bounds);

	const getDefaultPositions = (bounds, previous = [], resetDefaults = false) => {
		const rightStackApps = defaultApps.filter(
			(app) => app && !DOCUMENT_DOCK_KEYS.includes(app.key)
		);
		const rightStackIndexByKey = new Map(
			rightStackApps.map((app, index) => [app.key, index])
		);
		const rightStackCount = rightStackApps.length;
		const rightStackPositions = new Map();

		rightStackApps.forEach((app, index) => {
			rightStackPositions.set(
				app.key,
				clampPosition(
					getDefaultPosition(index, rightStackCount, bounds),
					bounds,
					{ width: DEFAULT_APP_WIDTH, height: DEFAULT_APP_HEIGHT }
				)
			);
		});

		const aboutPosition = rightStackPositions.get("about");
		const dockPositions = new Map();
		if (aboutPosition) {
			const dockCount = DOCUMENT_DOCK_KEYS.length;
			const dockRightX =
				aboutPosition.x - DEFAULT_APP_WIDTH - DOCUMENT_DOCK_TO_ABOUT_GAP;
			const dockStartX =
				dockRightX -
				(dockCount - 1) * (DEFAULT_APP_WIDTH + DOCUMENT_DOCK_GAP);
			const dockY = aboutPosition.y;
			DOCUMENT_DOCK_KEYS.forEach((key, index) => {
				dockPositions.set(
					key,
					clampPosition(
						{
							x: dockStartX + index * (DEFAULT_APP_WIDTH + DOCUMENT_DOCK_GAP),
							y: dockY,
						},
						bounds,
						{ width: DEFAULT_APP_WIDTH, height: DEFAULT_APP_HEIGHT }
					)
				);
			});
		}

		return defaultApps.map((app, index) => {
			const hasPrevious = !resetDefaults && previous[index];
			let basePosition = hasPrevious ? previous[index] : null;

			if (!basePosition && app?.key && dockPositions.has(app.key)) {
				basePosition = dockPositions.get(app.key);
			}

			if (!basePosition && app?.key && rightStackPositions.has(app.key)) {
				basePosition = rightStackPositions.get(app.key);
			}

			if (!basePosition && app?.key && rightStackIndexByKey.has(app.key)) {
				const stackIndex = rightStackIndexByKey.get(app.key);
				basePosition = getDefaultPosition(stackIndex, rightStackCount, bounds);
			}

			if (!basePosition) {
				basePosition = getDefaultPosition(index, defaultApps.length, bounds);
			}

			const position =
				!hasPrevious && app?.key === "trash"
					? { ...basePosition, y: basePosition.y + TRASH_OFFSET_Y }
					: basePosition;
			return clampPosition(position, bounds, {
				width: DEFAULT_APP_WIDTH,
				height: DEFAULT_APP_HEIGHT,
			});
		});
	};

	const updatePositions = useCallback((options = {}) => {
		const { resetDefaults = false } = options;
		setAppPositions((prev) => {
			const bounds = getHomepageBounds();
			const defaultPositions = getDefaultPositions(
				bounds,
				prev,
				resetDefaults
			);
			const spawnedPositions = spawnedApps.map((item, index) => {
				const previous = prev[defaultApps.length + index];
				const position = previous || { x: item.x, y: item.y };
				return clampPosition(position, bounds, {
					width: DEFAULT_APP_WIDTH,
					height: DEFAULT_APP_HEIGHT,
				});
			});
			return [...defaultPositions, ...spawnedPositions];
		});
	}, [clampPosition, defaultApps, getHomepageBounds, spawnedApps]);

	useEffect(() => {
		if (didInitPositions.current) {
			updatePositions();
		}
	}, [updatePositions]);

	useEffect(() => {
		if (didInitPositions.current) {
			return;
		}
		updatePositions({ resetDefaults: true });
		didInitPositions.current = true;
	}, [updatePositions]);

	useEffect(() => {
		const handleResize = () => updatePositions({ resetDefaults: true });
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [updatePositions]);

	useEffect(() => {
		if (!homepageContentRef.current) {
			return;
		}
		const observer = new ResizeObserver(() => {
			if (!didInitLayout.current) {
				updatePositions({ resetDefaults: true });
				didInitLayout.current = true;
				return;
			}
			updatePositions();
		});
		observer.observe(homepageContentRef.current);
		return () => observer.disconnect();
	}, [updatePositions]);

	const updateSpawnedApps = (newSpawned) => setSpawnedApps(newSpawned);
	const handleOpenDocuments = useCallback(() => {
		setDocumentsWindows((prev) => {
			const offsetIndex = prev.length;
			return [
				...prev,
				{
					key: `documents-${Date.now()}-${Math.random()
						.toString(16)
						.slice(2)}`,
					zIndex: getNextWindowZIndex(),
					offset: { x: -265 + 22 * offsetIndex, y: 140 + 18 * offsetIndex },
				},
			];
		});
	}, []);
	const handleCloseDocuments = useCallback((key) => {
		setDocumentsWindows((prev) => prev.filter((item) => item.key !== key));
	}, []);
	const handleActivateDocuments = useCallback((key) => {
		setDocumentsWindows((prev) =>
			prev.map((item) =>
				item.key === key
					? { ...item, zIndex: getNextWindowZIndex() }
					: item
			)
		);
	}, []);
	const handleMoveDocuments = useCallback((key, direction) => {
		setDocumentsWindows((prev) => {
			const current = prev.find((item) => item.key === key);
			if (!current) {
				return prev;
			}

			const nextZIndex =
				direction === "up"
					? getNextWindowZIndex()
					: getPrevWindowZIndex();
			return prev.map((item) =>
				item.key === key ? { ...item, zIndex: nextZIndex } : item
			);
		});
	}, []);
	const documentsApps = INFO.documentsApps || [];

	const handleDocumentClick = (path) => {
		setSelectedDocumentPath(path);
	};

	const handleDocumentOpen = (path) => {
		setSelectedDocumentPath(path);
		navigate({
			pathname: path,
			search: `?w=${Date.now()}${Math.random().toString(16).slice(2)}`,
		});
	};

	const handleDocumentDragStart = (app) => (event) => {
		event.dataTransfer.setData(
			"application/json",
			JSON.stringify({
				key: app.key,
				label: app.name,
				to: app.path,
				imageClass: app.imageClass,
			})
		);
		const dragImg = event.currentTarget.cloneNode(true);
		dragImg.style.opacity = "0.75";
		dragImg.style.position = "absolute";
		dragImg.style.pointerEvents = "none";
		dragImg.style.zIndex = "1000";
		dragImg.style.transform = "scale(0.9)";
		document.body.appendChild(dragImg);
		documentDragImageRef.current = dragImg;
		event.dataTransfer.setDragImage(dragImg, 30, 30);
		document.body.style.overflow = "hidden";
	};

	const handleDocumentDragEnd = () => {
		if (documentDragImageRef.current) {
			document.body.removeChild(documentDragImageRef.current);
			documentDragImageRef.current = null;
		}
		document.body.style.overflow = "";
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			let scroll = Math.round(window.pageYOffset, 2);

			let newLogoSize = 80 - (scroll * 4) / 10;

			if (newLogoSize < oldLogoSize) {
				if (newLogoSize > 40) {
					setLogoSize(newLogoSize);
					setOldLogoSize(newLogoSize);
					setStayLogo(false);
				} else {
					setStayLogo(true);
				}
			} else {
				setLogoSize(newLogoSize);
				setStayLogo(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [logoSize, oldLogoSize]);

	const currentSEO = SEO.find((item) => item.page === "home");

	const logoStyle = {
		display: "flex",
		position: stayLogo ? "fixed" : "relative",
		top: stayLogo ? "3vh" : "auto",
		zIndex: 999,
		border: stayLogo ? "1px solid white" : "none",
		borderRadius: stayLogo ? "50%" : "none",
		boxShadow: stayLogo ? "0px 4px 10px rgba(0, 0, 0, 0.25)" : "none",
	};

	return (
		<React.Fragment>
			<Helmet>
				<title>{INFO.main.title}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div 
				className="page-content"
				ref={pageContentRef}
				onDragOver={(e) => e.preventDefault()}
				onDrop={(e) => {
					e.preventDefault();
					const data = e.dataTransfer.getData('application/json');
					if (data) {
						const item = JSON.parse(data);
						const bounds = getHomepageBounds();
						const pageRect = pageContentRef.current?.getBoundingClientRect();
						const startX = pageRect ? e.clientX - pageRect.left : e.clientX;
						const startY = pageRect ? e.clientY - pageRect.top : e.clientY;
						const clamped = clampPosition(
							{ x: startX, y: startY },
							bounds,
							{ width: DEFAULT_APP_WIDTH, height: DEFAULT_APP_HEIGHT }
						);
						setSpawnedApps(prev => {
							const newSpawned = [...prev, { ...item, x: clamped.x, y: clamped.y }];
							const boundsNow = getHomepageBounds();
							const spawnedPositions = newSpawned.map(app => ({
								x: app.x,
								y: app.y,
							}));
							const defaultPositions = getDefaultPositions(boundsNow);
							setAppPositions([...defaultPositions, ...spawnedPositions]);
							return newSpawned;
						});
					}
				}}
			>
				<HomepageApps 
					spawnedApps={spawnedApps} 
					appPositions={appPositions} 
					setAppPositions={setAppPositions} 
					homepageApps={homepageApps}
					setHomepageApps={setHomepageApps}
					updateSpawnedApps={updateSpawnedApps}
					getHomepageBounds={getHomepageBounds}
					clampPosition={clampPosition}
					onOpenDocuments={handleOpenDocuments}
				/>
				{documentsWindows.map((window, index) => (
					<OverlayModal
						key={window.key}
						title="Documents"
						onClose={() => handleCloseDocuments(window.key)}
						onMoveUp={() => handleMoveDocuments(window.key, "up")}
						onMoveDown={() => handleMoveDocuments(window.key, "down")}
						onActivate={() => handleActivateDocuments(window.key)}
						initialOffset={window.offset}
						initialSize={{ width: 500, height: 200 }}
						minSize={{ width: 300, height: 200 }}
						zIndex={window.zIndex}
					>
						<div className="documents-folder">
							<div className="documents-grid">
								{documentsApps.map((app) => (
									<div
										className={
											selectedDocumentPath === app.path
												? "documents-item selected"
												: "documents-item"
										}
										key={app.path}
										role="button"
										tabIndex={0}
										onClick={() => handleDocumentClick(app.path)}
										onDoubleClick={() => handleDocumentOpen(app.path)}
										draggable="true"
										onDragStart={handleDocumentDragStart(app)}
										onDragEnd={handleDocumentDragEnd}
										onKeyDown={(event) => {
											if (event.key === "Enter") {
												handleDocumentOpen(app.path);
											}
										}}
									>
										<div
											className="documents-item-icon"
											aria-hidden="true"
										/>
										<div className="documents-item-text">
											<div className="documents-item-name">
												{app.name}
											</div>
											<div className="documents-item-path">
												{app.path}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</OverlayModal>
				))}
				<div
					className="content-wrapper page-shell page-shell--framed"
					ref={homepageContentRef}
				>
					<div className="homepage-logo-container">
						<div style={logoStyle}>
							<Logo width={logoSize} link={false} />
						</div>
					</div>

					<div className="homepage-container">
						<div className="homepage-first-area">
							<div className="homepage-first-area-left-side">
								<div className="title homepage-title">
									{INFO.homepage.title}
								</div>

								<div className="subtitle homepage-subtitle">
									{INFO.homepage.description}
								</div>
							</div>

							<div className="homepage-first-area-right-side">
								<div className="homepage-image-container">
								{/* Overlay Modal Simple */}
								<OverlayModalSimple
									title="Welcome to my Portfolio!"
									initialOffset={{ x: -40, y: 0 }}
									zIndex={25}>
										<img
											src="homepage.jpg"
											alt="about"
											className="homepage-image"
										/>
								</OverlayModalSimple>
								<OverlayModalSimple
									title="Another Modal"
									initialOffset={{ x: -90, y: 220 }}
									zIndex={30}
									className="small">
										<img
											src="homepage.jpg"
											alt="another"
											className="homepage-image"
										/>
									</OverlayModalSimple>
								</div>
							</div>
						</div>

						<div className="homepage-socials">
							{/* <a
								href={INFO.socials.twitter}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faTwitter}
									className="homepage-social-icon"
								/>
							</a> */}
							<a
								href={INFO.socials.github}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faGithub}
									className="homepage-social-icon"
								/>
							</a>
							{/* <a
								href={INFO.socials.stackoverflow}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faStackOverflow}
									className="homepage-social-icon"
								/>
							</a> */}
							{/* <a
								href={INFO.socials.instagram}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faInstagram}
									className="homepage-social-icon"
								/>
							</a> */}
							<a
								href={`mailto:${INFO.main.email}`}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faMailBulk}
									className="homepage-social-icon"
								/>
							</a>
						</div>

						{/* <div className="homepage-projects">
							<AllProjects />
						</div>
						 */}

						{/* <div className="homepage-after-title">
							<div className="homepage-articles">
								{myArticles.map((article, index) => (
									<div
										className="homepage-article"
										key={(index + 1).toString()}
									>
										<Article
											key={(index + 1).toString()}
											date={article().date}
											title={article().title}
											description={article().description}
											link={"/article/" + (index + 1)}
										/>
									</div>
								))}
							</div>

							<div className="homepage-works">
								<Works />
							</div>
						</div> */}

						<div className="homepage-nav">
							<NavBar active="home" onOpenDocuments={handleOpenDocuments} />
						</div>
						<div className="page-footer">
							<Footer />
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Homepage;





