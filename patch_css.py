import sys

with open(r'c:\Users\manis\Desktop\MIQNAF1\style.css', encoding='utf-8') as f:
    css = f.read()

pat_start = css.find('PATIENT PANELS')
block_start = css.rfind('/*', 0, pat_start)

clin_pos = css.find('CLINICAL EXPERIENCE')
block_end = css.rfind('/*', 0, clin_pos)

new_block = r"""/* ══════════════════════════════════════════════════
   PATIENT PANEL TABS  (click/arrow navigation — no scroll lock)
══════════════════════════════════════════════════ */

/* Tab bar above panels */
.panel-tabs {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 0 40px 0;
  flex-wrap: wrap;
  background: var(--off-white);
  margin-bottom: 0;
}
.panel-tab-btn {
  font-family: var(--f-head);
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: var(--text-mid);
  background: rgba(255,255,255,0.7);
  border: 2px solid rgba(0,45,98,0.12);
  border-radius: 30px;
  padding: 9px 22px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
  white-space: nowrap;
}
.panel-tab-btn:hover {
  border-color: var(--navy);
  color: var(--navy);
  background: #fff;
}
.panel-tab-btn.active {
  background: var(--navy);
  border-color: var(--navy);
  color: #fff;
  box-shadow: 0 4px 14px rgba(0,45,98,0.22);
}

/* Panels wrapper — fixed height, panels absolutely stacked */
.panels-wrap {
  position: relative;
  overflow: hidden;
  height: 480px;
  margin-top: 18px;
}

.panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 56px 80px;
  gap: 0;
  position: absolute;
  inset: 0;

  /* Hide state */
  opacity: 0;
  transform: translateX(40px);
  pointer-events: none;
  transition:
    opacity 0.45s cubic-bezier(0.4,0,0.2,1),
    transform 0.45s cubic-bezier(0.4,0,0.2,1);
}
.panel.active-panel {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}

/* Panel colors */
.panel-elderly      { background: var(--red-dark);  color: #fff; }
.panel-professional { background: var(--slate);      color: #fff; }
.panel-hospitalized { background: var(--peach);      color: #fff; }
.panel-discharge    { background: var(--mustard);    color: var(--navy); }

/* Panel image column */
.panel-image-col {
  display: flex;
  align-items: center;
  justify-content: center;
}
.panel-img-frame {
  position: relative;
  width: min(260px, 100%);
  height: 320px;
  border-radius: 20px;
  overflow: visible;
}
.panel-img-frame::before,
.panel-img-frame::after {
  content: '';
  position: absolute;
  border-radius: 14px;
  pointer-events: none;
  z-index: 0;
}

/* Frame accents per color */
.frame-red::before  { top:-14px; right:-14px; width:60%; height:60%; border:3.5px dashed rgba(255,255,255,0.45); }
.frame-red::after   { bottom:-14px; left:-14px; width:55%; height:55%; border:3.5px dashed rgba(255,255,255,0.25); }
.frame-blue::before { top:-14px; right:-14px; width:60%; height:60%; border:3.5px dashed rgba(255,255,255,0.4); }
.frame-blue::after  { bottom:-14px; left:-14px; width:55%; height:55%; border:3.5px dashed rgba(255,255,255,0.2); }
.frame-peach::before{ top:-14px; right:-14px; width:60%; height:60%; border:3.5px dashed rgba(255,255,255,0.5); }
.frame-peach::after { bottom:-14px; left:-14px; width:55%; height:55%; border:3.5px dashed rgba(255,255,255,0.25); }
.frame-yellow::before{ top:-14px; right:-14px; width:60%; height:60%; border:3.5px dashed rgba(0,45,98,0.3); }
.frame-yellow::after { bottom:-14px; left:-14px; width:55%; height:55%; border:3.5px dashed rgba(0,45,98,0.15); }

.panel-img {
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: 20px;
  filter: grayscale(70%) contrast(1.08);
  transition: filter 0.5s;
  position: relative; z-index: 1;
}
.panel.active-panel .panel-img,
.panel-img:hover { filter: grayscale(10%); }

/* Panel content */
.panel-content-col { padding-left: 64px; }
.panel-title {
  font-family: var(--f-head);
  font-weight: 800;
  font-size: clamp(1.5rem, 2.8vw, 2.4rem);
  line-height: 1.1;
  margin-bottom: 16px;
  font-stretch: 120%;
}
.panel-rule {
  width: 56px; height: 3px;
  background: currentColor;
  opacity: 0.65;
  border-radius: 2px;
  margin-bottom: 18px;
}
.panel-desc {
  font-size: 1rem;
  line-height: 1.65;
  opacity: 0.88;
  margin-bottom: 20px;
  font-weight: 400;
}
.panel-cta {
  font-size: 0.98rem;
  line-height: 1.75;
  font-weight: 500;
}
.panel-cta em { font-style: italic; opacity: 0.85; }

/* Nav bar: arrows + dots */
.panel-nav-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 18px 0 20px;
  background: var(--off-white);
}

/* Arrow buttons */
.panel-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px; height: 40px;
  border-radius: 50%;
  background: rgba(0,45,98,0.08);
  color: var(--navy);
  cursor: pointer;
  border: 2px solid rgba(0,45,98,0.15);
  transition: all 0.22s ease;
  flex-shrink: 0;
}
.panel-arrow:hover {
  background: var(--navy);
  color: #fff;
  border-color: var(--navy);
  transform: scale(1.08);
}
.panel-arrow svg {
  width: 18px; height: 18px;
  stroke: currentColor;
  fill: none;
}

/* Panel navigation dots */
.panel-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.pdot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: rgba(0,45,98,0.2);
  border: 2px solid transparent;
  transition: all 0.3s;
}
.pdot.active {
  background: var(--navy);
  border-color: var(--navy);
  transform: scale(1.28);
}

"""

new_css = css[:block_start] + new_block + css[block_end:]

with open(r'c:\Users\manis\Desktop\MIQNAF1\style.css', 'w', encoding='utf-8') as f:
    f.write(new_css)

print(f'Done! Original size: {len(css)}, New size: {len(new_css)}')
