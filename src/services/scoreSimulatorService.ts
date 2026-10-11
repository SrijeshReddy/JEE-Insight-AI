import { ScoreScenarioSimulation } from '../types';

export interface SimulatorInputs {
  mathAccuracyDelta: number;     // 0 to 40%
  chemAccuracyDelta: number;     // 0 to 30%
  physicsAccuracyDelta: number;  // 0 to 30%
  negativeMarksSaved: number;    // 0 to 10 questions
  extraWeeklyHours: number;      // 0 to 15 hours
  speedOptimizationSec: number;  // 0 to 40 seconds
  customBaselineScore?: number;
}

export interface IScoreSimulatorService {
  calculateScenario(inputs: SimulatorInputs): ScoreScenarioSimulation;
}

class LocalScoreSimulatorService implements IScoreSimulatorService {
  calculateScenario(inputs: SimulatorInputs): ScoreScenarioSimulation {
    const baselineScore = inputs.customBaselineScore !== undefined ? inputs.customBaselineScore : 112;

    // Mathematical formula breakdown:
    // 1. Math accuracy delta: Converting an incorrect question to correct gains (+4 - (-1)) = +5 raw marks.
    // In a 25-question Math section, a +10% accuracy gain converts ~2.5 questions => ~12.5 marks on 100-scale.
    // On 300 aggregate scale, scaled effect is approx +5.5 marks per 10% gain.
    const fromAccuracyMath = Math.round((inputs.mathAccuracyDelta / 10) * 5.5);

    // 2. Chemistry accuracy delta:
    const fromAccuracyChem = Math.round((inputs.chemAccuracyDelta / 10) * 4.5);

    // 3. Physics accuracy delta:
    const fromAccuracyPhys = Math.round((inputs.physicsAccuracyDelta / 10) * 4.0);

    const fromAccuracy = fromAccuracyMath + fromAccuracyChem + fromAccuracyPhys;

    // 4. Negative marks saved: Each omitted blind guess saves the -1 penalty (+1 raw mark, ~2.5 on scaled benchmark)
    const fromNegativeReduction = Math.round(inputs.negativeMarksSaved * 2.5);

    // 5. Extra practice hours: Every 3 hours of focused drill adds approx 2 marks through pattern recognition
    const fromExtraPractice = Math.round((inputs.extraWeeklyHours / 3) * 2.0);

    // 6. Speed optimization: Saving seconds allows reallocating time to 1-2 additional high-confidence questions
    const fromSpeedReallocation = Math.round((inputs.speedOptimizationSec / 10) * 1.5);

    const totalDelta = fromAccuracy + fromNegativeReduction + fromExtraPractice + fromSpeedReallocation;
    const estimatedScore = Math.min(300, Math.max(0, baselineScore + totalDelta));

    // Historical JEE Main Percentile & Rank Bracket Lookups (Heuristic)
    let estimatedRankBand = 'AIR 95,000 - 1,15,000';
    let estimatedPercentile = '92.5 - 93.8 %ile';

    if (estimatedScore >= 240) {
      estimatedRankBand = 'AIR 800 - 2,500 (Top NIT CSE / IIIT-H)';
      estimatedPercentile = '99.5 - 99.8 %ile';
    } else if (estimatedScore >= 210) {
      estimatedRankBand = 'AIR 2,500 - 6,500 (Top NITs Electrical / CSE)';
      estimatedPercentile = '98.8 - 99.4 %ile';
    } else if (estimatedScore >= 180) {
      estimatedRankBand = 'AIR 8,000 - 16,000 (Established NIT Core Branches)';
      estimatedPercentile = '97.5 - 98.6 %ile';
    } else if (estimatedScore >= 150) {
      estimatedRankBand = 'AIR 22,000 - 38,000 (Top State Colleges / Middle NITs)';
      estimatedPercentile = '95.2 - 97.2 %ile';
    } else if (estimatedScore >= 130) {
      estimatedRankBand = 'AIR 45,000 - 70,000 (Qualifying Comfortably)';
      estimatedPercentile = '93.5 - 95.0 %ile';
    } else if (estimatedScore < 100) {
      estimatedRankBand = 'AIR 1,20,000 - 1,60,000';
      estimatedPercentile = '85.0 - 90.0 %ile';
    }

    const assumptions = [
      `Mathematics accuracy improvement of +${inputs.mathAccuracyDelta}% assumes converting indifferently guessed Calculus and Algebra problems into verified steps (+${fromAccuracyMath} marks).`,
      `Chemistry accuracy improvement of +${inputs.chemAccuracyDelta}% assumes systematic review of Organic Reaction Mechanisms and Equilibrium (+${fromAccuracyChem} marks).`,
      `Physics accuracy improvement of +${inputs.physicsAccuracyDelta}% assumes eliminating torque axis and inclined plane relative errors (+${fromAccuracyPhys} marks).`,
      `Eliminating ${inputs.negativeMarksSaved} blind guesses removes the -1 negative marking penalty without requiring any additional syllabus coverage (+${fromNegativeReduction} marks).`,
      `${inputs.extraWeeklyHours} additional practice hours provides approximately ${inputs.extraWeeklyHours * 15} additional solved problems per week (+${fromExtraPractice} marks).`,
      `Pacing improvement of ${inputs.speedOptimizationSec}s in Physics and Chemistry reallocates critical cognitive bandwidth to complex Mathematics calculations (+${fromSpeedReallocation} marks).`,
      `All projections enforce the theoretical JEE Main ceiling of 300 maximum marks.`
    ];

    return {
      baselineScore,
      mathAccuracyDelta: inputs.mathAccuracyDelta,
      chemAccuracyDelta: inputs.chemAccuracyDelta,
      physicsAccuracyDelta: inputs.physicsAccuracyDelta,
      negativeMarksSaved: inputs.negativeMarksSaved,
      extraWeeklyHours: inputs.extraWeeklyHours,
      speedOptimizationSec: inputs.speedOptimizationSec,
      estimatedScore,
      estimatedRankBand,
      estimatedPercentile,
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
