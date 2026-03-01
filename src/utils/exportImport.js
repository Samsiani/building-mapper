/**
 * Export/Import utilities for project data
 */

export function exportJSON(data, filename = 'masterplan-export.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function importJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        // Accept v3 (projectConfig + nodes), v2 (projectConfig + buildings + floors + units),
        // or v1 (buildingConfig + units)
        const isV3 = data.projectConfig && Array.isArray(data.nodes);
        const isV2 = data.projectConfig && Array.isArray(data.buildings);
        const isV1 = data.buildingConfig && Array.isArray(data.units);
        if (!isV3 && !isV2 && !isV1) {
          reject(new Error('Invalid masterplan file format'));
          return;
        }
        resolve(data);
      } catch (err) {
        reject(new Error('Failed to parse JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function exportPNG(svgEl, filename = 'masterplan.png') {
  return new Promise((resolve, reject) => {
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 2000;
    canvas.height = 2000;

    img.onload = () => {
      ctx.drawImage(img, 0, 0, 2000, 2000);
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error('Failed to create PNG')); return; }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        resolve();
      }, 'image/png');
    };
    img.onerror = () => reject(new Error('Failed to render SVG to image'));
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
  });
}
