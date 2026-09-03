// map_zoom.js
let isMapZoomInitialized = false;

function initMapZoom(containerSelector, svgSelector) {
    const container = document.querySelector(containerSelector);
    const svg = document.querySelector(svgSelector);

    if (!container || !svg) {
        console.warn("指定された要素が見つかりませんでした");
        return;
    }

    // ★他のパーツに合わせて transform-origin を '50% 50%' に設定
    svg.style.transformOrigin = '50% 50%';

    let scale = 1;
    let posX = 0; // コンテナ中心から見たSVG中心のオフセット
    let posY = 0;

    const MIN_SCALE = 0.5;
    const MAX_SCALE = 5.0;

    // コンテナの基準サイズを取得
    const baseWidth = container.clientWidth;
    const baseHeight = container.clientHeight;
    const centerX = baseWidth / 2;
    const centerY = baseHeight / 2;

    // SVG自体の元々の縦横比を計算
    let svgAspect = 1;
    const viewBox = svg.getAttribute('viewBox');
    if (viewBox) {
        const parts = viewBox.split(/[\s,]+/).map(Number);
        if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
            svgAspect = parts[2] / parts[3];
        }
    }

    // タッチ管理用
    const activePointers = new Map();
    let initialPointerDistance = 0;
    let initialScale = 1;
    let initialSvgX = 0;
    let initialSvgY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    function updateTransform() {
        // --- 1. X軸（左右）の制限計算 ---
        const currentWidth = baseWidth * scale;
        let maxOffsetX;
        
        if (currentWidth <= baseWidth) {
            maxOffsetX = (baseWidth - currentWidth) / 2;
        } else {
            const limitX = baseWidth * 0.15;
            maxOffsetX = (currentWidth - baseWidth) / 2 + limitX;
        }

        if (posX < -maxOffsetX) posX = -maxOffsetX;
        if (posX > maxOffsetX) posX = maxOffsetX;

        // --- 2. Y軸（上下）の制限計算 ---
        const currentHeight = (baseWidth / svgAspect) * scale;
        let maxOffsetY;

        if (currentHeight <= baseHeight) {
            maxOffsetY = (baseHeight - currentHeight) / 2;
        } else {
            const limitY = baseHeight * 0.15;
            maxOffsetY = (currentHeight - baseHeight) / 2 + limitY;
        }

        if (posY < -maxOffsetY) posY = -maxOffsetY;
        if (posY > maxOffsetY) posY = maxOffsetY;

        svg.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
    }

    updateTransform();

    // 2点間距離の計算
    function getDistance(p1, p2) {
        return Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);
    }

    // イベントリスナー
    container.addEventListener('pointerdown', (e) => {
        if (e.target.closest('button')) return;

        activePointers.set(e.pointerId, e);
        container.setPointerCapture(e.pointerId);

        if (activePointers.size === 1) {
            isDragging = true;
            startX = e.clientX - posX;
            startY = e.clientY - posY;
        } else if (activePointers.size === 2) {
            isDragging = false;
            const pointers = Array.from(activePointers.values());
            initialPointerDistance = getDistance(pointers[0], pointers[1]);
            initialScale = scale;

            // ピンチ開始時の2点中点（コンテナ基準）
            const rect = container.getBoundingClientRect();
            const midX = (pointers[0].clientX + pointers[1].clientX) / 2 - rect.left;
            const midY = (pointers[0].clientY + pointers[1].clientY) / 2 - rect.top;

            // 50% 50% 基準での現在のSVG中心座標
            const currentSvgCenterX = centerX + posX;
            const currentSvgCenterY = centerY + posY;

            // 中点が指しているSVG上のローカル座標（中心からの相対距離）を計算
            initialSvgX = (midX - currentSvgCenterX) / scale;
            initialSvgY = (midY - currentSvgCenterY) / scale;
        }
    });

    container.addEventListener('pointermove', (e) => {
        if (!activePointers.has(e.pointerId)) return;
        activePointers.set(e.pointerId, e);

        if (activePointers.size === 2) {
            const pointers = Array.from(activePointers.values());
            const currentDistance = getDistance(pointers[0], pointers[1]);

            if (initialPointerDistance > 0) {
                const ratio = currentDistance / initialPointerDistance;
                let nextScale = initialScale * ratio;

                if (nextScale < MIN_SCALE) nextScale = MIN_SCALE;
                if (nextScale > MAX_SCALE) nextScale = MAX_SCALE;

                // 現在の2点中点（コンテナ基準）を取得
                const rect = container.getBoundingClientRect();
                const currentMidX = (pointers[0].clientX + pointers[1].clientX) / 2 - rect.left;
                const currentMidY = (pointers[0].clientY + pointers[1].clientY) / 2 - rect.top;

                // 中点が常に同じSVG上の位置を指し続けるように、新しい中心位置からオフセットを逆算
                const newCenterX = currentMidX - initialSvgX * nextScale;
                const newCenterY = currentMidY - initialSvgY * nextScale;

                posX = newCenterX - centerX;
                posY = newCenterY - centerY;
                scale = nextScale;

                updateTransform();
            }
        } else if (isDragging && activePointers.size === 1) {
            posX = e.clientX - startX;
            posY = e.clientY - startY;
            updateTransform();
        }
    });

    const handlePointerEnd = (e) => {
        activePointers.delete(e.pointerId);
    if (activePointers.size < 2) {
            initialPointerDistance = 0;
        }
        if (activePointers.size === 1) {
            const remainingPointer = Array.from(activePointers.values())[0];
            isDragging = true;
            startX = remainingPointer.clientX - posX;
            startY = remainingPointer.clientY - posY;
        } else if (activePointers.size === 0) {
            isDragging = false;
        }
    };

    container.addEventListener('pointerup', handlePointerEnd);
    container.addEventListener('pointercancel', handlePointerEnd);

    container.addEventListener('wheel', (e) => {
        if (e.target.closest('button')) return;

        e.preventDefault();
        
        // マウス位置（コンテナ基準）を取得
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // 現在のSVG中心座標
        const currentSvgCenterX = centerX + posX;
        const currentSvgCenterY = centerY + posY;

        // マウス位置が指しているSVG上のローカル座標（中心からの相対距離）を計算
        const svgOffsetX = (mouseX - currentSvgCenterX) / scale;
        const svgOffsetY = (mouseY - currentSvgCenterY) / scale;

        const zoomIntensity = 0.1;
        let nextScale = e.deltaY < 0 ? scale * (1 + zoomIntensity) : scale * (1 - zoomIntensity);

        if (nextScale < MIN_SCALE) nextScale = MIN_SCALE;
        if (nextScale > MAX_SCALE) nextScale = MAX_SCALE;

        // マウス位置を中心にして新しいSVG中心座標を求め、オフセットを更新
        const newCenterX = mouseX - svgOffsetX * nextScale;
        const newCenterY = mouseY - svgOffsetY * nextScale;

        posX = newCenterX - centerX;
        posY = newCenterY - centerY;
        scale = nextScale;

        updateTransform();
    }, { passive: false });

    console.log("Map zoom initialized with transform-origin 50% 50% and center-based zooming!");
}