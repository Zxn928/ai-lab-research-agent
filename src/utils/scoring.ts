import type { AIScenario, ScenarioScore } from '../types/scenario';

export function calculateScenarioTotal(score: Omit<ScenarioScore, 'total'>) {
  return Math.round(
    score.businessValue * 0.2 +
      score.painIntensity * 0.15 +
      score.technicalFeasibility * 0.15 +
      score.dataAvailability * 0.15 +
      score.processClarity * 0.1 +
      score.organizationSupport * 0.1 +
      score.oneMonthImpact * 0.1 +
      score.replicability * 0.05
  );
}

export function scenarioPriority(total: number): AIScenario['priority'] {
  if (total >= 80) return 'priority';
  if (total >= 65) return 'cultivate';
  if (total >= 50) return 'cautious';
  return 'deferred';
}
