import React, { useEffect, useRef, useState } from "react";
import "./styles/overlayModal.css";

const OverlayModal = ({
	children,
	title = "Page Name",
	onClose,
	onMoveUp,
	onMoveDown,
	onActivate,
	initialOffset = { x: 0, y: 0 },
	initialSize = { width: 1100, height: 700 },
	minSize = { width: 520, height: 420 },
	zIndex,
}) => {
	const sheetZIndex = zIndex ?? 2100;
	const backdropZIndex = Math.max(0, sheetZIndex - 1);
	const dragData = useRef({
		active: false,
		startX: 0,
		startY: 0,
		startTranslateX: 0,
		startTranslateY: 0,
	});
	const [translate, setTranslate] = useState(() => initialOffset);
	const [isDragging, setIsDragging] = useState(false);
	const modalRef = useRef(null);
	const resizeData = useRef({
		active: false,
		startX: 0,
		startY: 0,
		startWidth: 0,
		startHeight: 0,
	});
	const [size, setSize] = useState(() => initialSize);
	const [isResizing, setIsResizing] = useState(false);

	const handleControlClick = (action) => (event) => {
		event.stopPropagation();
		if (onActivate) {
			onActivate();
		}
		if (action) {
			action();
		}
	};

	const handleClose = () => {
		if (onClose) {
			onClose();
		}
	};

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

	const handleResizeMouseDown = (event) => {
		event.preventDefault();
		const state = resizeData.current;
		const rect = modalRef.current?.getBoundingClientRect();
		state.active = true;
		state.startX = event.clientX;
		state.startY = event.clientY;
		state.startWidth = rect ? rect.width : size.width;
		state.startHeight = rect ? rect.height : size.height;
		setIsResizing(true);
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

	useEffect(() => {
		if (!isResizing) {
			return undefined;
		}

		const handleResizeMove = (event) => {
			const state = resizeData.current;
			if (!state.active) {
				return;
			}

			const dx = event.clientX - state.startX;
			const dy = event.clientY - state.startY;
			const nextWidth = Math.max(minSize.width, state.startWidth + dx);
			const nextHeight = Math.max(minSize.height, state.startHeight + dy);
			setSize({ width: nextWidth, height: nextHeight });
		};

		const handleResizeUp = () => {
			resizeData.current.active = false;
			setIsResizing(false);
		};

		window.addEventListener("mousemove", handleResizeMove);
		window.addEventListener("mouseup", handleResizeUp);

		return () => {
			window.removeEventListener("mousemove", handleResizeMove);
			window.removeEventListener("mouseup", handleResizeUp);
		};
	}, [isResizing]);

	return (
		<div
			className="modal-backdrop"
			role="dialog"
			aria-modal="true"
			style={{ zIndex: backdropZIndex }}
		>
			<div
				ref={modalRef}
				className={
					isDragging || isResizing ? "modal-sheet dragging" : "modal-sheet"
				}
				onMouseDown={onActivate}
				style={{
					width: `min(${size.width}px, 94vw)`,
					height: `min(${size.height}px, 92vh)`,
					transform: `translate(calc(-50% + ${translate.x}px), calc(-63% + ${translate.y}px))`,
					zIndex: sheetZIndex,
				}}
			>
				<div className="modal-topbar">
					<div className="modal-title">{title}</div>
					<div
						className="modal-drag"
						onMouseDown={handleMouseDown}
						role="button"
						aria-label="Drag window"
					/>
					<div className="modal-controls">
					<button
						type="button"
						className="modal-btn"
						onMouseDown={(event) => event.stopPropagation()}
						onClick={handleControlClick(onMoveUp)}
						aria-label="Move up"
					>
						^
					</button>
					<button
						type="button"
						className="modal-btn"
						onMouseDown={(event) => event.stopPropagation()}
						onClick={handleControlClick(onMoveDown)}
						aria-label="Move down"
					>
						v
					</button>
					<button
						type="button"
						className="modal-btn modal-btn-close"
						onMouseDown={(event) => event.stopPropagation()}
						onClick={handleControlClick(handleClose)}
						aria-label="Close window"
					>
						X
					</button>
					</div>
				</div>
				<div className="modal-body">
					<div className="modal-content">{children}</div>
				</div>
				<div
					className="modal-resize-handle corner-se"
					onMouseDown={handleResizeMouseDown}
					role="button"
					aria-label="Resize window"
				/>
				<div
					className="modal-resize-handle corner-sw"
					onMouseDown={handleResizeMouseDown}
					role="button"
					aria-label="Resize window"
				/>
				<div
					className="modal-resize-handle corner-ne"
					onMouseDown={handleResizeMouseDown}
					role="button"
					aria-label="Resize window"
				/>
				<div
					className="modal-resize-handle corner-nw"
					onMouseDown={handleResizeMouseDown}
					role="button"
					aria-label="Resize window"
				/>
			</div>
		</div>
	);
};

export default OverlayModal;
