import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { NODE_TYPES, canDrillInto } from '../../utils/nodeTypes';
import { STATUS } from '../../utils/constants';
import PreviewBuilding from './PreviewBuilding';
import PreviewLegend from './PreviewLegend';
import PreviewStats from './PreviewStats';
import PreviewTooltip from './PreviewTooltip';
import UnitDetailModal from './UnitDetailModal';
import NoDataFallback from './NoDataFallback';
import PreviewBreadcrumbs from './PreviewBreadcrumbs';
import PreviewDetailCard from './PreviewDetailCard';
import ConfirmDialog from './ConfirmDialog';

export default function PreviewPage() {
  const config = useProjectStore((s) => s.projectConfig);
  const nodes = useProjectStore((s) => s.nodes);
  const removeNode = useProjectStore((s) => s.removeNode);
  const updateProjectConfig = useProjectStore((s) => s.updateProjectConfig);

  const [hoveredEntity, setHoveredEntity] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // parentId-based navigation
  const [previewView, setPreviewView] = useState({ parentId: null });

  const displayConfig = {
    buildingName: config.projectName,
    companyName: config.companyName,
    companyTagline: config.companyTagline,
    currency: config.currency,
    contactPhone: config.contactPhone,
    contactEmail: config.contactEmail,
  };

  useEffect(() => {
    document.title = `${config.projectName || 'Preview'} — ${config.companyName || 'Real Estate'}`;
  }, [config]);

  // Current entities = children of current parentId
  const entities = useMemo(
    () => nodes.filter((n) => n.parentId === previewView.parentId),
    [nodes, previewView.parentId]
  );

  // Background determination
  let backgroundImage = null;
  let proceduralConfig = null;

  if (previewView.parentId === null) {
    backgroundImage = config.siteBackgroundImage || null;
  } else {
    const parentNode = nodes.find((n) => n.id === previewView.parentId);
    if (parentNode) {
      const typeDef = NODE_TYPES[parentNode.type];
      if (parentNode.backgroundImage) {
        backgroundImage = parentNode.backgroundImage;
      } else if (typeDef?.hasProceduralFallback) {
        proceduralConfig = {
          buildingName: parentNode.name,
          floors: parentNode.floors || 6,
          unitsPerFloor: parentNode.unitsPerFloor || 4,
          companyName: config.companyName,
        };
      }
    }
  }

  const handleEntityClick = (entity) => {
    if (canDrillInto(entity.type)) {
      setHoveredEntity(null);
      setPreviewView({ parentId: entity.id });
    } else if (NODE_TYPES[entity.type]?.hasStatus) {
      setSelectedUnit(entity);
    }
  };

  const handleDeleteRequest = useCallback((entity, pos) => {
    setConfirmDelete({ entity, pos });
    setHoveredEntity(null);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!confirmDelete) return;
    removeNode(confirmDelete.entity.id);
    setConfirmDelete(null);
  }, [confirmDelete, removeNode]);

  const handleNavigate = (parentId) => {
    setPreviewView({ parentId });
    setHoveredEntity(null);
  };

  // Site photo upload
  const fileInputRef = useRef(null);
  const handleSiteImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateProjectConfig({ siteBackgroundImage: reader.result });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [updateProjectConfig]);

  const handleRemoveSiteImage = useCallback(() => {
    updateProjectConfig({ siteBackgroundImage: null });
  }, [updateProjectConfig]);

  // Stats — collect all apartment descendants under current view
  const getApartmentDescendants = useCallback((parentId) => {
    const result = [];
    const queue = [parentId];
    while (queue.length > 0) {
      const current = queue.shift();
      for (const n of nodes) {
        if (n.parentId === current) {
          if (NODE_TYPES[n.type]?.hasStatus) result.push(n);
          if (canDrillInto(n.type)) queue.push(n.id);
        }
      }
    }
    return result;
  }, [nodes]);

  const currentApartments = previewView.parentId === null
    ? nodes.filter((n) => NODE_TYPES[n.type]?.hasStatus)
    : (() => {
        // Direct hasStatus children + descendants
        const direct = entities.filter((n) => NODE_TYPES[n.type]?.hasStatus);
        const deeper = entities.filter((n) => canDrillInto(n.type)).flatMap((n) => getApartmentDescendants(n.id));
        return [...direct, ...deeper];
      })();

  const stats = {
    total: currentApartments.length,
    ...Object.fromEntries(Object.keys(STATUS).map((key) => [key, currentApartments.filter((u) => u.status === key).length])),
    minPrice: (() => {
      const prices = currentApartments.filter((u) => u.status === 'for_sale' && u.price > 0).map((u) => u.price);
      return prices.length ? Math.min(...prices) : 0;
    })(),
  };

  if (nodes.length === 0) {
    return (
      <div className="pv-page">
        <NoDataFallback />
      </div>
    );
  }

  // Info for topbar
  const parentNode = previewView.parentId !== null ? nodes.find((n) => n.id === previewView.parentId) : null;
  const hasStatusEntities = entities.some((n) => NODE_TYPES[n.type]?.hasStatus);
  const isUnitView = parentNode && NODE_TYPES[parentNode.type]?.hasStatus;

  return (
    <div className="pv-page">
      <header className="pv-topbar">
        <div className="pv-header-left">
          <PreviewBreadcrumbs
            previewView={previewView}
            nodes={nodes}
            onNavigate={handleNavigate}
          />
          {parentNode && (
            <>
              <span className="pv-topbar-sep" />
              <span className="pv-topbar-info">
                {parentNode.name} &middot; {entities.length} item{entities.length !== 1 ? 's' : ''}
              </span>
            </>
          )}
        </div>
        <div className="pv-header-right">
          {hasStatusEntities && <PreviewLegend />}
          {previewView.parentId === null && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="pv-hidden-input"
                onChange={handleSiteImageUpload}
              />
              {config.siteBackgroundImage ? (
                <button className="pv-upload-btn pv-upload-btn--remove" onClick={handleRemoveSiteImage}>
                  Remove Photo
                </button>
              ) : (
                <button className="pv-upload-btn" onClick={() => fileInputRef.current?.click()}>
                  Upload Site Photo
                </button>
              )}
            </>
          )}
        </div>
      </header>

      <main className="pv-canvas-area pv-canvas-area--with-sidebar">
        <div className="pv-canvas-wrapper">
          <PreviewBuilding
            entities={entities}
            backgroundImage={backgroundImage}
            proceduralConfig={proceduralConfig}
            onHover={(entity, pos) => { setHoveredEntity(entity); setTooltipPos(pos); }}
            onLeave={() => setHoveredEntity(null)}
            onClick={handleEntityClick}
            onDelete={handleDeleteRequest}
          />
        </div>
        {isUnitView ? (
          <PreviewDetailCard node={parentNode} currency={config.currency} config={displayConfig} />
        ) : (
          <PreviewStats stats={stats} currency={config.currency} />
        )}
      </main>

      <PreviewTooltip
        entity={hoveredEntity}
        nodes={nodes}
        position={tooltipPos}
        currency={config.currency}
      />

      <UnitDetailModal
        unit={selectedUnit}
        config={displayConfig}
        onClose={() => setSelectedUnit(null)}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete this item?"
        message={`Are you sure you want to delete "${confirmDelete?.entity?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
