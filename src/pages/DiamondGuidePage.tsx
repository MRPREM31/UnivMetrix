import React from 'react';
import { Gem, ShieldCheck, Sparkles, Scale, Eye, Award, Info } from 'lucide-react';
import { DIAMOND_GUIDE_DATA } from '../data/demoData';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const DiamondGuidePage: React.FC = () => {
  const guide = DIAMOND_GUIDE_DATA;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center font-bold text-lg border border-sky-500/20">
            <Gem className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                Diamond Valuation Guide
              </h1>
              <Badge variant="platinum">4Cs Valuation Framework</Badge>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Educational reference for diamond pricing, quality metrics, and certification in India
            </p>
          </div>
        </div>
      </div>

      {/* Critical Disclaimer: Why diamonds do not have a single spot price */}
      <div className="p-4 rounded-xl bg-surface-elevated border border-border flex items-start gap-3">
        <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 text-xs">
          <h3 className="font-bold text-sm text-text-primary">
            Why There Is No Universal Single Spot Price for Diamonds
          </h3>
          <p className="text-text-secondary leading-relaxed">
            Unlike standardized bullion commodities like Gold (24K) or Silver (999), every diamond is an individual gemstone valued on a multi-dimensional matrix. Diamond valuation depends simultaneously on <strong>Carat Weight, Cut Precision, Color Grade, Clarity Purity, Shape, Fluorescence, and Laboratory Certification</strong>.
          </p>
          <p className="text-text-muted">
            MetalPrice provides this comprehensive guide instead of misleading pseudo-spot rates.
          </p>
        </div>
      </div>

      {/* 4Cs Visual Interactive Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Carat Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gold-500/15 text-gold-500">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-text-primary">1. {guide.carat.title}</h3>
              <p className="text-xs text-text-muted">1 Carat = 0.200 Grams (200 mg)</p>
            </div>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {guide.carat.description}
          </p>
          <div className="space-y-2 pt-2 border-t border-border">
            <span className="text-xs font-semibold text-text-primary">Buyer Tips:</span>
            <ul className="space-y-1.5 text-xs text-text-muted">
              {guide.carat.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-gold-500 font-bold">&bull;</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Cut Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/15 text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-text-primary">2. {guide.cut.title}</h3>
              <p className="text-xs text-text-muted">Proportions, Symmetry & Polish</p>
            </div>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {guide.cut.description}
          </p>
          <div className="space-y-2 pt-2 border-t border-border">
            <span className="text-xs font-semibold text-text-primary">GIA / IGI Cut Grades:</span>
            <div className="grid grid-cols-1 gap-1.5">
              {guide.cut.grades.map((grade, i) => (
                <div key={i} className="text-xs p-2 rounded-lg bg-surface-elevated border border-border text-text-secondary">
                  {grade}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Color Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-text-primary">3. {guide.color.title}</h3>
              <p className="text-xs text-text-muted">D (Colorless) to Z (Light Tint)</p>
            </div>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {guide.color.description}
          </p>
          <div className="space-y-2 pt-2 border-t border-border">
            <span className="text-xs font-semibold text-text-primary">Color Spectrum Breakdown:</span>
            <div className="grid grid-cols-1 gap-1.5">
              {guide.color.grades.map((grade, i) => (
                <div key={i} className="text-xs p-2 rounded-lg bg-surface-elevated border border-border text-text-secondary">
                  {grade}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Clarity Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-text-primary">4. {guide.clarity.title}</h3>
              <p className="text-xs text-text-muted">10x Magnification Benchmark</p>
            </div>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {guide.clarity.description}
          </p>
          <div className="space-y-2 pt-2 border-t border-border">
            <span className="text-xs font-semibold text-text-primary">Clarity Tiers:</span>
            <div className="grid grid-cols-1 gap-1.5">
              {guide.clarity.grades.map((grade, i) => (
                <div key={i} className="text-xs p-2 rounded-lg bg-surface-elevated border border-border text-text-secondary">
                  {grade}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Natural vs Lab-Grown Diamonds Section */}
      <Card className="p-6 space-y-4">
        <h3 className="font-bold text-lg text-text-primary">
          Natural Mined Diamonds vs. Lab-Grown Diamonds (CVD / HPHT)
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Both natural and lab-grown diamonds share identical physical, chemical, and optical properties (pure crystallized carbon). However, their market valuation trajectories diverge dramatically:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-text-primary">Natural Mined Diamonds</span>
              <Badge variant="gold">Geological Rarity</Badge>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Formed billions of years ago under extreme mantle pressure. Priced on scarcity, high resale retention, and traditional heirloom appeal.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-text-primary">Lab-Grown (CVD / HPHT)</span>
              <Badge variant="platinum">Technological Value</Badge>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Cultivated in advanced laboratories within weeks. Typically 60% to 85% lower retail cost, making larger diamond jewelry accessible without secondary resale expectations.
            </p>
          </div>
        </div>
      </Card>

      {/* Certification Authorities */}
      <Card className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <h3 className="font-bold text-base text-text-primary">Third-Party Grading Authorities</h3>
        </div>
        <p className="text-xs text-text-secondary">
          {guide.certification.description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          {guide.certification.labs.map((lab, i) => (
            <div key={i} className="text-xs p-3 rounded-lg bg-surface-elevated border border-border text-text-secondary flex items-start gap-2">
              <span className="text-emerald-500 font-bold">&check;</span>
              <span>{lab}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
