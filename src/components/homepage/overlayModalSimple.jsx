import React, { useEffect, useRef, useState } from "react";

import "./styles/overlayModalSimple.css";

const OverlayModalSimple = ({
	children,
	title = "Page Name",
	initialOffset = { x: 0, y: 0 },
	zIndex,
	className,
}) => {
	const dragData = useRef({
		active: false,
		startX: 0,
		startY: 0,
		startTranslateX: 0,
		startTranslateY: 0,
	});
	const [translate, setTranslate] = useState(() => initialOffset);
	const [isDragging, setIsDragging] = useState(false);

	const handleMouseDown = (event) => {
		event.preventDefault();
		const state = dragData.current;
		state.active = true;
		state.startX = event.clientX;
		state.startY = event.clientY;
		state.startTranslateX = translate.x;
		state.startTranslateY = translate.y;
		setIsDragging(true);
	};

	useEffect(() => {
		if (!isDragging) {
			return undefined;
		}

		const handleMouseMove = (event) => {
			const state = dragData.current;
			if (!state.active) {
				return;
			}

			const dx = event.clientX - state.startX;
			const dy = event.clientY - state.startY;
			setTranslate({
				x: state.startTranslateX + dx,
				y: state.startTranslateY + dy,
			});
		};

		const handleMouseUp = () => {
			dragData.current.active = false;
			setIsDragging(false);
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging]);

	return (
		<div
			className={
				`${isDragging ? "overlay-simple dragging" : "overlay-simple"} ${className || ""}`.trim()
			}
			style={{
				transform: `translate(${translate.x}px, ${translate.y}px)`,
				zIndex,
			}}
		>
			<div className="overlay-simple-topbar">
				<div className="overlay-simple-title">{title}</div>
				<div
					className="overlay-simple-drag"
					onMouseDown={handleMouseDown}
					role="button"
					aria-label="Drag window"
				/>
			</div>
			<div className="overlay-simple-body">
				<div className="overlay-simple-content">{children}</div>
			</div>
		</div>
	);
};

export default OverlayModalSimple;



