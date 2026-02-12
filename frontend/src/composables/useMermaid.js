import { ref } from 'vue';
import mermaid from 'mermaid';

export function useMermaid(currentTheme) {
    const mermaidContainer = ref(null);
    const error = ref('');

    const renderDiagram = async (code) => {
        if (!code.trim()) return;
        try {
            error.value = '';
            const isDark = currentTheme.value !== 'sun';
            const primaryColor = currentTheme.value === 'sun' ? '#9333ea' : '#a855f7';
            const textColor = isDark ? '#e5e7eb' : '#111827';
            const contrastBg = isDark ? '#1b1b1b' : '#ffffff';

            mermaid.initialize({
                startOnLoad: false,
                theme: isDark ? 'dark' : 'default',
                securityLevel: 'loose',
                fontFamily: 'Inter',
                themeCSS: `
          text, tspan, .messageText, .noteText, .actorText, .actor > tspan {
            fill: ${textColor} !important;
            ${isDark ? 'filter: drop-shadow(0px 0px 1px black);' : ''}
            font-family: 'Inter', sans-serif !important;
            font-weight: 500 !important;
          }
          rect[fill*="235"], rect[fill*="245"], rect[fill*="255"], rect[fill="#ebf5ff"] {
            ${isDark ? 'fill: #334155 !important; stroke: ' + primaryColor + ' !important;' : ''}
          }
          .messageLine0, .messageLine1, .path, marker path {
            stroke: ${isDark ? '#4b5563' : '#9ca3af'} !important;
            stroke-width: 1.5px !important;
          }
          .note {
            fill: ${isDark ? '#27272a' : '#fff7ed'} !important;
            stroke: ${primaryColor} !important;
          }
          .actor {
            fill: ${contrastBg} !important;
            stroke: ${primaryColor} !important;
          }
        `,
                themeVariables: {
                    fontSize: '14px',
                    primaryColor: primaryColor,
                    noteBkgColor: isDark ? '#27272a' : '#fff7ed',
                    noteTextColor: textColor,
                    actorBkg: contrastBg,
                    actorBorder: primaryColor,
                    actorTextColor: textColor,
                }
            });

            const { svg } = await mermaid.render('mermaid-svg-' + Math.random().toString(36).substr(2, 9), code);
            if (mermaidContainer.value) {
                mermaidContainer.value.innerHTML = svg;
            }
        } catch (e) {
            error.value = '繪圖語法錯誤，請檢查輸入內容';
            console.error(e);
        }
    };

    const downloadPNG = () => {
        const svgElement = mermaidContainer.value.querySelector('svg');
        if (!svgElement) return;

        const bbox = svgElement.getBBox();
        const padding = 40;
        const exportScale = 2;

        const canvas = document.createElement('canvas');
        canvas.width = (bbox.width + padding * 2) * exportScale;
        canvas.height = (bbox.height + padding * 2) * exportScale;
        const ctx = canvas.getContext('2d');

        const clonedSvg = svgElement.cloneNode(true);
        clonedSvg.removeAttribute('style');
        clonedSvg.setAttribute('width', bbox.width);
        clonedSvg.setAttribute('height', bbox.height);
        clonedSvg.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);

        const svgData = new XMLSerializer().serializeToString(clonedSvg);
        const img = new Image();

        img.onload = () => {
            ctx.fillStyle = currentTheme.value === 'sun' ? '#ffffff' : '#131313';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, padding * exportScale, padding * exportScale, bbox.width * exportScale, bbox.height * exportScale);

            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png', 1.0);
            link.download = `mermaid-diagram-${Date.now()}.png`;
            link.click();
        };

        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.src = url;
        img.addEventListener('load', () => URL.revokeObjectURL(url), { once: true });
    };

    return {
        mermaidContainer,
        error,
        renderDiagram,
        downloadPNG
    };
}
