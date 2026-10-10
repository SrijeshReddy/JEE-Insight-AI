import { ScoreScenarioSimulation } from '../types';

export interface SimulatorInputs {
  mathAccuracyDelta: number; // 0 to 40%
  chemAccuracyDelta: number; // 0 to 30%
  negativeMarksSaved: number; // 0 to 8 questions
  extraWeeklyHours: number; // 0 to 15 hours
  speedOptimizationSec: number; // 0 to 40 seconds
}

export interface IScoreSimulatorService {
  calculateScenario(inputs: SimulatorInputs): ScoreScenarioSimulation;
}

class LocalScoreSimulatorService implements IScoreSimulatorService {
  calculateScenario(inputs: SimulatorInputs): ScoreScenarioSimulation {
    const baselineScore = 112;

    // Demonstration calculation models:
    // 1. Math accuracy delta: Every 10% gains approx 5 scaled marks by converting mistakes to correct
    const fromAccuracyMath = Math.round((inputs.mathAccuracyDelta / 10) * 5.5);
    
    // 2. Chemistry accuracy delta: Every 10% gains approx 4 scaled marks
    const fromAccuracyChem = Math.round((inputs.chemAccuracyDelta / 10) * 4.0);
    const fromAccuracy = fromAccuracyMath + fromAccuracyChem;

    // 3. Negative marks saved: Each blind guess avoided saves 1 raw mark = ~2.5 scaled marks in aggregate
    const fromNegativeReduction = Math.round(inputs.negativeMarksSaved * 2.5);

    // 4. Extra practice hours: Every 3 hours of focused drill adds approx 2 marks via retention
    const fromExtraPractice = Math.round((inputs.extraWeeklyHours / 3) * 2.0);

    // 5. Speed optimization: Saving 20s allows reallocation of time to 1-2 additional questions
    const fromSpeedReallocation = Math.round((inputs.speedOptimizationSec / 10) * 1.5);

    const totalDelta = fromAccuracy + fromNegativeReduction + fromExtraPractice + fromSpeedReallocation;
    const estimatedScore = Math.min(300, baselineScore + totalDelta);

    // Illustrative percentile / rank estimation for demonstration
    let estimatedRankBand = 'AIR 95,000 - 1,15,000';
    if (estimatedScore >= 220) estimatedRankBand = 'AIR 2,500 - 5,000 (Top NITs / IIITs)';
    else if (estimatedScore >= 190) estimatedRankBand = 'AIR 8,000 - 15,000 (NIT Core Branches)';
    else if (estimatedScore >= 160) estimatedRankBand = 'AIR 22,000 - 38,000 (Top State / Established NITs)';
    else if (estimatedScore >= 135) estimatedRankBand = 'AIR 45,000 - 70,000 (Qualifying comfortably)';
    else if (estimatedScore >= 120) estimatedRankBand = 'AIR 75,000 - 95,000';

    const assumptions = [
      `Mathematics accuracy improvement of +${inputs.mathAccuracyDelta}% assumes converting indifferently attempted Calculus questions into sound solutions (+${fromAccuracyMath} marks).`,
      `Chemistry accuracy improvement of +${inputs.chemAccuracyDelta}% assumes structured review of Organic Mechanisms (+${fromAccuracyChem} marks).`,
      `Eliminating ${inputs.negativeMarksSaved} blind guesses removes the -1 negative marking penalty without requiring new syllabus coverage (+${fromNegativeReduction} marks).`,
      `${inputs.extraWeeklyHours} additional practice hours provides approximately 60 extra solved problems per week (+${fromExtraPractice} marks).`,
      `Pacing improvement of ${inputs.speedOptimizationSec}s in Physics reallocates critical cognitive bandwidth to Calculus (+${fromSpeedReallocation} marks).`
    ];

    return {
      baselineScore,
      mathAccuracyDelta: inputs.mathAccuracyDelta,
      chemAccuracyDelta: inputs.chemAccuracyDelta,
      negativeMarksSaved: inputs.negativeMarksSaved,
      extraWeeklyHours: inputs.extraWeeklyHours,
      speedOptimizationSec: inputs.speedOptimizationSec,
      estimatedScore,
      estimatedRankBand,
      scoreDelta: totalDelta,
      breakdown: {
        fromAccuracy,
        fromNegativeReduction,
        fromExtraPractice,
        fromSpeedReallocation
      },
      assumptions
    };
  }
}

export const scoreSimulatorService: IScoreSimulatorService = new LocalScoreSimulatorService();
