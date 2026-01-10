import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./styles/navBar.css";

const NavBar = (props) => {
	const { active, onOpenDocuments } = props;
	const navigate = useNavigate();
	const dragImageRef = useRef(null);
	const navItems = [
		{ key: "about", label: "About", to: "/about", imageClass: "nav-tile-about" },
		{ key: "projects", label: "Projects", to: "/projects", imageClass: "nav-tile-projects" },
		{ key: "contact", label: "Contact", to: "/contact", imageClass: "nav-tile-contact" },
		{ key: "documents", label: "Documents", to: "/documents", imageClass: "nav-tile-documents" },
	];

	return (
		<React.Fragment>
			<div className="nav-container">
				<nav className="navbar">
					<div className="nav-background">
						<ul className="nav-grid">
							{navItems.map((item) => (
								<React.Fragment key={item.key}>
									<li
										className={
											active === item.key ? "nav-tile active" : "nav-tile"
										}
										draggable="true"
										onDragStart={(e) => {
											e.dataTransfer.setData('application/json', JSON.stringify(item));
											const dragImg = e.currentTarget.cloneNode(true);
											dragImg.style.opacity = '0.5';
											dragImg.style.position = 'absolute';
											dragImg.style.pointerEvents = 'none';
											dragImg.style.zIndex = '1000';
											dragImg.style.transform = 'scale(0.8)';
											document.body.appendChild(dragImg);
											dragImageRef.current = dragImg;
											e.dataTransfer.setDragImage(dragImg, e.offsetX, e.offsetY);
											document.body.style.overflow = 'hidden';
										}}
										onDragEnd={() => {
											if (dragImageRef.current) {
												document.body.removeChild(dragImageRef.current);
												dragImageRef.current = null;
											}
											document.body.style.overflow = '';
										}}
									>
										<Link
											to={item.to}
											onClick={(event) => {
												if (item.key === "documents") {
													event.preventDefault();
													if (onOpenDocuments) {
														onOpenDocuments();
													}
													return;
												}
												if (item.to === "/") {
													return;
												}

												event.preventDefault();
												navigate({
													pathname: item.to,
													search: `?w=${Date.now()}${Math.random()
														.toString(16)
														.slice(2)}`,
												});
											}}
											className="nav-link"
											aria-label={item.label}
										>
											<span
												className={`nav-tile-image ${item.imageClass}`}
												aria-hidden="true"
											/>
											<span className="nav-tile-label">
												{item.label}
											</span>
										</Link>
									</li>
									{item.key === "contact" ? (
										<li className="nav-divider" aria-hidden="true" />
									) : null}
								</React.Fragment>
							))}
						</ul>
					</div>
				</nav>
			</div>
		</React.Fragment>
	);
};

export default NavBar;
