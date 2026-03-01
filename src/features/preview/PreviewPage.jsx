import { useState, useEffect } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { STATUS } from '../../utils/constants';
import PreviewNavbar from './PreviewNavbar';
import PreviewHero from './PreviewHero';
import PreviewBuilding from './PreviewBuilding';
import PreviewLegend from './PreviewLegend';
import PreviewStats from './PreviewStats';
import PreviewFooter from './PreviewFooter';
import PreviewTooltip from './PreviewTooltip';
import UnitDetailModal from './UnitDetailModal';
import NoDataFallback from './NoDataFallback';
import PreviewBreadcrumbs from './PreviewBreadcrumbs';

export default function PreviewPage() {
  const config = useProjectStore((s) => s.projectConfig);
  const buildings = useProjectStore((s) => s.buildings);
  const floors = useProjectStore((s) => s.floors);
  const units = useProjectStore((s) => s.units);

  const [hoveredUnit, setHoveredUnit] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedUnit, setSelectedUnit] = useState(null);

  // Local drill-down navigation
  const [previewView, setPreviewView] = useState({
    level: 'global', buildingId: null, floorId: null,
  });

  // Backwards compat — config shape for navbar/hero/footer
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

  // If there's only 1 building and no building polygons, auto-drill into it
  useEffect(() => {
    if (previewView.level === 'global' && buildings.length === 1 && buildings[0].points.length < 3) {
      setPreviewView({ level: 'building', buildingId: buildings[0].id, floorId: null });
    }
  }, []);

  // Get entities for current preview level
  let entities = [];
  let entityType = 'building';
  let backgroundImage = null;
  let proceduralConfig = null;

  if (previewView.level === 'global') {
    entities = buildings;
    entityType = 'building';
  } else if (previewView.level === 'building') {
    const building = buildings.find((b) => b.id === previewView.buildingId);
    entities = floors.filter((f) => f.buildingId === previewView.buildingId);
    entityType = 'floor';
    if (building?.backgroundImage) {
      backgroundImage = building.backgroundImage;
    } else if (building) {
      proceduralConfig = {
        buildingName: building.name,
        floors: building.floors || 6,
        unitsPerFloor: building.unitsPerFloor || 4,
        companyName: config.companyName,
      };
    }
  } else if (previewView.level === 'floor') {
    entities = units.filter((u) => u.floorId === previewView.floorId);
    entityType = 'unit';
    const floor = floors.find((f) => f.id === previewView.floorId);
    backgroundImage = floor?.backgroundImage || null;
  }

  const handleEntityClick = (entity) => {
    if (entityType === 'building') {
      setHoveredUnit(null);
      setPreviewView({ level: 'building', buildingId: entity.id, floorId: null });
    } else if (entityType === 'floor') {
      setHoveredUnit(null);
      setPreviewView({ level: 'floor', buildingId: previewView.buildingId, floorId: entity.id });
    } else {
      setSelectedUnit(entity);
    }
  };

  const handleNavigate = (level, buildingId = null, floorId = null) => {
    setPreviewView({ level, buildingId, floorId });
    setHoveredUnit(null);
  };

  // Stats for current level's units
  const currentUnits = previewView.level === 'floor'
    ? entities
    : previewView.level === 'building'
      ? units.filter((u) => floors.filter((f) => f.buildingId === previewView.buildingId).some((f) => f.id === u.floorId))
      : units;

  const stats = {
    total: currentUnits.length,
    available: currentUnits.filter((u) => u.status === 'available').length,
    reserved: currentUnits.filter((u) => u.status === 'reserved').length,
    minPrice: (() => {
      const prices = currentUnits.filter((u) => u.status === 'available' && u.price > 0).map((u) => u.price);
      return prices.length ? Math.min(...prices) : 0;
    })(),
  };

  if (!buildings.length && !units.length) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--pv-bg)', fontFamily: 'var(--font-sans)' }}>
        <PreviewNavbar config={displayConfig} />
        <NoDataFallback />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--pv-bg)', fontFamily: 'var(--font-sans)', color: 'var(--pv-text)' }}>
      <PreviewNavbar config={displayConfig} />
      <PreviewHero config={displayConfig} />

      <section className="max-w-[900px] mx-auto px-8 pb-8">
        <PreviewBreadcrumbs
          previewView={previewView}
          buildings={buildings}
          floors={floors}
          onNavigate={handleNavigate}
        />
        <div className="bg-[var(--pv-surface)] rounded-[var(--pv-radius)] shadow-[var(--pv-shadow-lg)] overflow-hidden relative">
          <PreviewBuilding
            entities={entities}
            entityType={entityType}
            backgroundImage={backgroundImage}
            proceduralConfig={proceduralConfig}
            onHover={(entity, pos) => { setHoveredUnit(entity); setTooltipPos(pos); }}
            onLeave={() => setHoveredUnit(null)}
            onClick={handleEntityClick}
          />
          {entityType === 'unit' && <PreviewLegend />}
        </div>
      </section>

      <PreviewStats stats={stats} currency={config.currency} />
      <PreviewFooter config={displayConfig} />

      <PreviewTooltip
        unit={entityType === 'unit' ? hoveredUnit : null}
        entity={entityType !== 'unit' ? hoveredUnit : null}
        entityType={entityType}
        position={tooltipPos}
        currency={config.currency}
      />

      <UnitDetailModal
        unit={selectedUnit}
        config={displayConfig}
        onClose={() => setSelectedUnit(null)}
      />
    </div>
  );
}
