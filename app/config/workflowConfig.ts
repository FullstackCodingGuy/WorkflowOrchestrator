export interface HandleConnectionLimit {
  max: number;
  type: 'source' | 'target';
}

export interface NodeConnectionLimits {
  handleSpecific?: {
    [handleId: string]: HandleConnectionLimit;
  };
  nodeOverallSourceMax?: number;
  nodeOverallTargetMax?: number;
}

export interface ConnectionLimitRules {
  [nodeType: string]: NodeConnectionLimits;
}

export const connectionRules: ConnectionLimitRules = {
  start: {
    nodeOverallSourceMax: 1,
    nodeOverallTargetMax: 0,
  },
  action: {
    nodeOverallSourceMax: 1,
    nodeOverallTargetMax: 10, // Increased from 1 to 10
  },
  condition: {
    nodeOverallSourceMax: 10, // Increased from 2 to 10
    nodeOverallTargetMax: 1,
    // Example for specific handles if needed:
    // handleSpecific: {
    //   'condition-source-true': { max: 1, type: 'source' },
    //   'condition-source-false': { max: 1, type: 'source' }
    //   // Add more handles if the condition node supports more than two outputs
    // }
  },
  end: {
    nodeOverallSourceMax: 0,
    nodeOverallTargetMax: 1,
  },
};

// Future configurations can be added here, for example:
// export const defaultNodeWidth = 180;
// export const defaultNodeHeight = 60;
// export const defaultNewNodeColor = '#f5f5f5';
