import { CoreMessage } from 'ai';
import { Spread } from './tarot';

export interface AgentPlanRequest {
  sessionId: string;
  messages: CoreMessage[];
  currentSpread?: Spread;
  mode: 'macro' | 'micro';
}

export interface AgentPlanResponse {
  action: 'DESIGN_SPREAD' | 'DIRECT_REPLY';
  
  // Present when action === 'DESIGN_SPREAD'
  spread?: {
    name: string;
    description: string;
    positions: Array<{
      id: string;
      name: string;
      description: string;
      x: number;
      y: number;
    }>;
  };

  reasoning: string;
}
