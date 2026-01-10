import type { Supplier, Buyer } from '@/types/supabase';

export interface FitResult {
  fitScore: number;
  readinessScore: number;
  gaps: string[];
}

const REQUIRED_CERTS_GERMAN_MARKET = ['HACCP', 'ISO 22000'];
const EUDR_CERT = 'EUDR Compliant';

export function calculateFitScore(
  supplier: Supplier,
  buyerRequirements?: Partial<Buyer>
): FitResult {
  let fitScore = 100;
  let readinessScore = 100;
  const gaps: string[] = [];

  const supplierCerts = supplier.certifications || [];

  // Check required certifications
  REQUIRED_CERTS_GERMAN_MARKET.forEach(cert => {
    if (!supplierCerts.includes(cert)) {
      fitScore -= 15;
      readinessScore -= 10;
      gaps.push(`Missing ${cert} certification`);
    }
  });

  // Check EUDR compliance
  if (!supplierCerts.includes(EUDR_CERT)) {
    fitScore -= 10;
    readinessScore -= 15;
    gaps.push('EUDR documentation incomplete');
  }

  // Check export experience
  if (!supplier.export_experience) {
    fitScore -= 10;
    readinessScore -= 5;
    gaps.push('No prior export experience');
  }

  // Check processing level
  if (supplier.processing_level === 'raw') {
    fitScore -= 5;
    gaps.push('Product requires additional processing for German market');
  }

  // Check capacity against buyer minimum (if provided)
  if (buyerRequirements?.min_order_quantity && supplier.production_capacity_monthly) {
    if (supplier.production_capacity_monthly < buyerRequirements.min_order_quantity) {
      fitScore -= 20;
      gaps.push(`Production capacity below buyer minimum (${buyerRequirements.min_order_quantity} MT)`);
    }
  }

  // Check product category alignment
  if (buyerRequirements?.product_category) {
    if (!supplier.product_category.toLowerCase().includes(buyerRequirements.product_category.toLowerCase())) {
      fitScore -= 25;
      gaps.push('Product category does not match buyer requirements');
    }
  }

  // Bonus for Organic certification
  if (supplierCerts.includes('Organic')) {
    fitScore += 5;
    readinessScore += 5;
  }

  // Bonus for Fair Trade
  if (supplierCerts.includes('Fair Trade')) {
    fitScore += 3;
  }

  return {
    fitScore: Math.max(0, Math.min(100, fitScore)),
    readinessScore: Math.max(0, Math.min(100, readinessScore)),
    gaps,
  };
}

export function calculateReadinessFromFormData(formData: {
  certifications: string[];
  eudrStatus: string;
  traceability: string;
  exportCapacity: number;
  annualVolume: number;
}): FitResult {
  let readinessScore = 100;
  const gaps: string[] = [];

  // Check certifications
  REQUIRED_CERTS_GERMAN_MARKET.forEach(cert => {
    if (!formData.certifications.includes(cert)) {
      readinessScore -= 12;
      gaps.push(`Missing ${cert} certification`);
    }
  });

  // Check EUDR status
  if (formData.eudrStatus === 'Not started') {
    readinessScore -= 20;
    gaps.push('EUDR documentation not started');
  } else if (formData.eudrStatus === 'In progress') {
    readinessScore -= 10;
    gaps.push('EUDR documentation in progress');
  } else if (formData.eudrStatus === 'Unsure') {
    readinessScore -= 15;
    gaps.push('EUDR compliance status unknown');
  }

  // Check traceability
  if (formData.traceability === 'None') {
    readinessScore -= 15;
    gaps.push('No traceability to farm level');
  } else if (formData.traceability === 'Partial') {
    readinessScore -= 8;
    gaps.push('Partial traceability - full farm-level tracing recommended');
  }

  // Check if export capacity is lower than annual volume (a positive signal)
  if (formData.exportCapacity > 0 && formData.annualVolume > 0) {
    const exportRatio = formData.exportCapacity / formData.annualVolume;
    if (exportRatio >= 0.5) {
      readinessScore += 5; // Bonus for strong export orientation
    }
  }

  // Bonus certifications
  if (formData.certifications.includes('Organic')) {
    readinessScore += 5;
  }
  if (formData.certifications.includes('Fair Trade')) {
    readinessScore += 3;
  }

  return {
    fitScore: readinessScore, // For preliminary assessment, fitScore = readinessScore
    readinessScore: Math.max(0, Math.min(100, readinessScore)),
    gaps,
  };
}
