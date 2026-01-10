import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../common/styles/navBar.css";
import "./styles/apps.css";
import INFO from "../../data/user";

const TRASH_RADIUS = 100;

const HomepageApps = ({
	spawnedApps = [],
	appPositions,
	setAppPositions,
	homepageApps,
	setHomepageApps,
	updateSpawnedApps,
	getHomepageBounds,
	clampPosition,
	onOpenDocuments,
}) => {
	const navigate = useNavigate();
	const [activeAppIndex, setActiveAppIndex] = useState(null);
	const [trashHover, setTrashHover] = useState(false);
	const dragData = useRef({
		active: false,
		index: -1,
		startX: 0,
		startY: 0,
		originX: 0,
		originY: 0,
		width: 0,
		height: 0,
		moved: false,
	});

	const getTrashIndex = () =>
		homepageApps.findIndex((app) => app && app.key === "trash");

	const getTrashPosition = (trashIndex) =>
		trashIndex >= 0 ? appPositions[trashIndex] : null;

	const getItemByIndex = (index) =>
		index < homepageApps.length
			? homepageApps[index]
			: spawnedApps[index - homepageApps.length];

	useEffect(() => {
		const handleMove = (event) => {
			const state = dragData.current;
			if (!state.active) {
				return;
			}

			const dx = event.clientX - state.startX;
			const dy = event.clientY - state.startY;
			if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
				state.moved = true;
			}

			const bounds = getHomepageBounds ? getHomepageBounds() : null;
			const nextPosition =
				bounds && clampPosition
					? clampPosition(
							{ x: state.originX + dx, y: state.originY + dy },
							bounds,
							{ width: state.width, height: state.height }
					  )
					: { x: state.originX + dx, y: state.originY + dy };

			setAppPositions((prev) =>
				prev.map((pos, index) =>
					index === state.index ? nextPosition : pos
				)
			);

			const trashIndex = getTrashIndex();
			if (trashIndex < 0 || trashIndex === state.index) {
				setTrashHover(false);
				return;
			}

			const trashPos = getTrashPosition(trashIndex);
			if (!trashPos) {
				setTrashHover(false);
				return;
			}

			const currentPos = nextPosition;
			const distance = Math.hypot(
				currentPos.x - trashPos.x,
				currentPos.y - trashPos.y
			);
			setTrashHover(distance <= TRASH_RADIUS);
		};

		const handleUp = () => {
			const state = dragData.current;
			dragData.current.active = false;
			setTrashHover(false);
			if (state.index >= homepageApps.length) {
				const spawnedIndex = state.index - homepageApps.length;
				const newSpawned = [...spawnedApps];
				newSpawned[spawnedIndex] = {
					...newSpawned[spawnedIndex],
					x: appPositions[state.index].x,
					y: appPositions[state.index].y,
				};
				updateSpawnedApps(newSpawned);
			}
			// Check for deletion
			const trashIndex = getTrashIndex();
			const trashPos = getTrashPosition(trashIndex);
			const currentPos = appPositions[state.index];
			if (!trashPos || !currentPos) {
				return;
			}

			const dx = currentPos.x - trashPos.x;
			const dy = currentPos.y - trashPos.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			const item = getItemByIndex(state.index);
			if (!item) {
				return;
			}
			if (distance <= TRASH_RADIUS && item.key !== "trash") {
				if (state.index < homepageApps.length) {
					// Delete default app
					const newHomepage = [...homepageApps];
					newHomepage[state.index] = null;
					setHomepageApps(newHomepage);
				} else {
					// Delete spawned app
					const spawnedIndex = state.index - homepageApps.length;
					const newSpawned = [...spawnedApps];
					newSpawned.splice(spawnedIndex, 1);
					updateSpawnedApps(newSpawned);
					// Update positions for spawned apps only
					const newPositions = [...appPositions];
					newPositions.splice(state.index, 1);
					setAppPositions(newPositions);
				}
			}
		};

		window.addEventListener("mousemove", handleMove);
		window.addEventListener("mouseup", handleUp);

		return () => {
			window.removeEventListener("mousemove", handleMove);
			window.removeEventListener("mouseup", handleUp);
		};
	}, [
		appPositions,
		homepageApps,
		setAppPositions,
		setHomepageApps,
		spawnedApps,
		updateSpawnedApps,
		getHomepageBounds,
		clampPosition,
	]);

	useEffect(() => {
		const handlePointerDown = (event) => {
			if (
				event.target instanceof Element &&
				event.target.closest(".homepage-app")
			) {
				return;
			}

			setActiveAppIndex(null);
		};

		window.addEventListener("pointerdown", handlePointerDown);
		return () => window.removeEventListener("pointerdown", handlePointerDown);
	}, []);

	const handleAppMouseDown = (index) => (event) => {
		event.preventDefault();
		setActiveAppIndex(index);
		const state = dragData.current;
		const targetRect = event.currentTarget.getBoundingClientRect();
		state.active = true;
		state.index = index;
		state.startX = event.clientX;
		state.startY = event.clientY;
		state.originX = appPositions[index].x;
		state.originY = appPositions[index].y;
		state.width = targetRect.width;
		state.height = targetRect.height;
		state.moved = false;
	};

	const handleAppClick = (index, item) => (event) => {
		if (dragData.current.moved) {
			event.preventDefault();
			return;
		}

		setActiveAppIndex(index);
	};

	const handleAppDoubleClick = (item) => (event) => {
		event.preventDefault();
		if (item.key === "documents") {
			if (onOpenDocuments) {
				onOpenDocuments();
			}
			return;
		}
		navigate({
			pathname: item.to,
			search: `?w=${Date.now()}${Math.random().toString(16).slice(2)}`,
		});
	};

	return (
		<div className="homepage-apps">
			{homepageApps.map((item, index) => {
				if (!item) {
					return null;
				}
				return (
					<button
						key={item.key}
						type="button"
						className="homepage-app"
						style={{
							transform: appPositions[index]
								? `translate(${appPositions[index].x}px, ${appPositions[index].y}px)`
								: undefined,
							opacity: appPositions[index] ? 1 : 0,
							pointerEvents: appPositions[index] ? "auto" : "none",
						}}
						onMouseDown={handleAppMouseDown(index)}
						onClick={handleAppClick(index, item)}
						onDoubleClick={handleAppDoubleClick(item)}
						aria-label={item.label}
					>
						<span
							className={
								activeAppIndex === index ||
								(item.key === "trash" && trashHover)
									? "homepage-app-active"
									: "homepage-app-active hidden"
							}
							aria-hidden="true"
						/>
						<span
							className={`homepage-app-image ${item.imageClass}`}
							aria-hidden="true"
						/>
						<span className="homepage-app-label">{item.label}</span>
					</button>
				);
			})}
			{spawnedApps.map((item, spawnedIndex) => {
				if (!item) {
					return null;
				}
				const index = homepageApps.length + spawnedIndex;
				return (
					<button
						key={`${item.key}-${spawnedIndex}`}
						type="button"
						className="homepage-app"
						style={{
							transform: appPositions[index]
								? `translate(${appPositions[index].x}px, ${appPositions[index].y}px)`
								: undefined,
							opacity: appPositions[index] ? 1 : 0,
							pointerEvents: appPositions[index] ? "auto" : "none",
						}}
						onMouseDown={handleAppMouseDown(index)}
						onClick={handleAppClick(index, item)}
						onDoubleClick={handleAppDoubleClick(item)}
						aria-label={item.label}
					>
						<span
							className={
								activeAppIndex === index ||
								(item.key === "trash" && trashHover)
									? "homepage-app-active"
									: "homepage-app-active hidden"
							}
							aria-hidden="true"
						/>
						<span
							className={`homepage-app-image ${item.imageClass}`}
							aria-hidden="true"
						/>
						<span className="homepage-app-label">{item.label}</span>
					</button>
				);
			})}
		</div>
	);
};

export default HomepageApps;
